/**
 * @file route.ts
 * @description Customer conversations list + create API.
 *              GET  — list authenticated customer's conversations.
 *              POST — create a new conversation with a first message.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { broadcastMessage } from "@/lib/realtime"
import { conversations, messages } from "@/db/schema"
import { eq, desc } from "drizzle-orm"

// ─────────────────────────────────────────────
// SCHEMAS
// ─────────────────────────────────────────────

const createConversationSchema = z.object({
  subject: z.string().max(200).optional(),
  orderId: z.number().int().positive().optional(),
  firstMessage: z.string().min(1).max(5000),
})

// ─────────────────────────────────────────────
// GET /api/conversations
// ─────────────────────────────────────────────

/**
 * Returns the authenticated customer's conversations sorted by lastMessageAt DESC.
 * Each conversation includes the latest message content as a preview.
 */
export async function GET(request: NextRequest) {
  const authUser = await getAuthUser(request)

  if (!authUser?.dbUser) {
    return NextResponse.json(
      { error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 }
    )
  }

  const rows = await db.query.conversations.findMany({
    where: eq(conversations.customerId, authUser.dbUser.id),
    with: {
      messages: {
        orderBy: [desc(messages.createdAt)],
        limit: 1,
      },
    },
    orderBy: [desc(conversations.lastMessageAt)],
  })

  const data = rows.map((c) => ({
    id: c.id,
    subject: c.subject,
    status: c.status,
    unreadCustomer: c.unreadCustomer,
    lastMessageAt: c.lastMessageAt,
    orderId: c.orderId,
    latestMessage: c.messages[0]?.content ?? null,
    createdAt: c.createdAt,
  }))

  return NextResponse.json({ data })
}

// ─────────────────────────────────────────────
// POST /api/conversations
// ─────────────────────────────────────────────

/**
 * Creates a new conversation and inserts the first message atomically.
 * Broadcasts the first message to the Supabase Realtime channel.
 */
export async function POST(request: NextRequest) {
  const authUser = await getAuthUser(request)

  if (!authUser?.dbUser) {
    return NextResponse.json(
      { error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 }
    )
  }

  const body = await request.json()
  const parsed = createConversationSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", code: "VALIDATION_ERROR", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { subject, orderId, firstMessage } = parsed.data

  // ── Transactional: create conversation + first message ──────────────────
  const result = await db.transaction(async (tx) => {
    const [convo] = await tx
      .insert(conversations)
      .values({
        customerId: authUser.dbUser!.id,
        orderId: orderId ?? null,
        subject: subject ?? "Support Request",
        // Staff has 1 unread message immediately
        unreadStaff: 1,
      })
      .returning()

    const [msg] = await tx
      .insert(messages)
      .values({
        conversationId: convo.id,
        senderId: authUser.dbUser!.id,
        senderRole: "customer",
        content: firstMessage,
      })
      .returning()

    return { convo, msg }
  })

  // ── Broadcast to staff channel (non-fatal if fails) ──────────────────────
  await broadcastMessage(result.convo.id, {
    conversationId: result.convo.id,
    message: result.msg,
  })

  return NextResponse.json(
    { data: result.convo, message: "Conversation created" },
    { status: 201 }
  )
}
