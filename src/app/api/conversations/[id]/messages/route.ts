/**
 * @file route.ts
 * @description Send a message to a conversation.
 *              POST — inserts message, updates unread counters, broadcasts via Supabase Realtime.
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
import { eq, sql } from "drizzle-orm"

// ─────────────────────────────────────────────
// SCHEMAS
// ─────────────────────────────────────────────

const sendMessageSchema = z.object({
  content: z.string().min(1).max(5000),
})

// ─────────────────────────────────────────────
// POST /api/conversations/[id]/messages
// ─────────────────────────────────────────────

/**
 * Appends a message to the conversation.
 * Verifies ownership (customer) or staff role.
 * Increments unread counter for the OTHER party.
 * Broadcasts the new message via Supabase Realtime.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authUser = await getAuthUser(request)

  if (!authUser?.dbUser) {
    return NextResponse.json(
      { error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 }
    )
  }

  const { id } = await params
  const conversationId = parseInt(id, 10)

  if (isNaN(conversationId)) {
    return NextResponse.json(
      { error: "Invalid conversation ID", code: "INVALID_ID" },
      { status: 400 }
    )
  }

  const body = await request.json()
  const parsed = sendMessageSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", code: "VALIDATION_ERROR", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  // ── Load conversation ────────────────────────────────────────────────────
  const [convo] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1)

  if (!convo) {
    return NextResponse.json(
      { error: "Conversation not found", code: "NOT_FOUND" },
      { status: 404 }
    )
  }

  // ── Authorization ────────────────────────────────────────────────────────
  const isOwner = convo.customerId === authUser.dbUser.id
  const isStaff =
    authUser.dbUser.role === "staff" || authUser.dbUser.role === "super_admin"

  if (!isOwner && !isStaff) {
    return NextResponse.json(
      { error: "Forbidden", code: "FORBIDDEN" },
      { status: 403 }
    )
  }

  const senderRole = isStaff ? "staff" : "customer"
  const now = new Date()

  // ── Insert message + update conversation atomically ─────────────────────
  const [newMessage] = await db.transaction(async (tx) => {
    const [msg] = await tx
      .insert(messages)
      .values({
        conversationId,
        senderId: authUser.dbUser!.id,
        senderRole,
        content: parsed.data.content,
      })
      .returning()

    // Increment unread counter for the OTHER party
    await tx
      .update(conversations)
      .set({
        lastMessageAt: now,
        updatedAt: now,
        // Staff sent → increment customer's unread; customer sent → increment staff's unread
        unreadStaff: isStaff
          ? conversations.unreadStaff
          : sql`${conversations.unreadStaff} + 1`,
        unreadCustomer: isStaff
          ? sql`${conversations.unreadCustomer} + 1`
          : conversations.unreadCustomer,
      })
      .where(eq(conversations.id, conversationId))

    return [msg]
  })

  // ── Broadcast to Supabase Realtime ────────────────────────────────────────
  await broadcastMessage(conversationId, {
    conversationId,
    message: newMessage,
  })

  return NextResponse.json({ data: newMessage, message: "Message sent" }, { status: 201 })
}
