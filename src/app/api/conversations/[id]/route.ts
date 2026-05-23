/**
 * @file route.ts
 * @description Single conversation detail API.
 *              GET — returns conversation + all messages, marks unread as read.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { conversations, messages } from "@/db/schema"
import { eq, and, asc } from "drizzle-orm"

// ─────────────────────────────────────────────
// GET /api/conversations/[id]
// ─────────────────────────────────────────────

/**
 * Returns a conversation with all its messages.
 * Ownership verified: only the conversation's customer or staff/super_admin may access.
 * Marks all unread messages (from staff) as read and resets the unreadCustomer counter.
 */
export async function GET(
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

  // ── Authorization: owner or staff ────────────────────────────────────────
  const isOwner = convo.customerId === authUser.dbUser.id
  const isStaff =
    authUser.dbUser.role === "staff" || authUser.dbUser.role === "super_admin"

  if (!isOwner && !isStaff) {
    return NextResponse.json(
      { error: "Forbidden", code: "FORBIDDEN" },
      { status: 403 }
    )
  }

  // ── Fetch all messages ───────────────────────────────────────────────────
  const allMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt))

  // ── Mark unread messages as read (relevant for each party) ───────────────
  const now = new Date()

  if (isOwner && convo.unreadCustomer > 0) {
    // Customer reading — mark staff messages as read, reset unreadCustomer
    await db
      .update(messages)
      .set({ isRead: true, readAt: now })
      .where(
        and(
          eq(messages.conversationId, conversationId),
          eq(messages.senderRole, "staff"),
          eq(messages.isRead, false)
        )
      )

    await db
      .update(conversations)
      .set({ unreadCustomer: 0 })
      .where(eq(conversations.id, conversationId))
  } else if (isStaff && convo.unreadStaff > 0) {
    // Staff reading — mark customer messages as read, reset unreadStaff
    await db
      .update(messages)
      .set({ isRead: true, readAt: now })
      .where(
        and(
          eq(messages.conversationId, conversationId),
          eq(messages.senderRole, "customer"),
          eq(messages.isRead, false)
        )
      )

    await db
      .update(conversations)
      .set({ unreadStaff: 0 })
      .where(eq(conversations.id, conversationId))
  }

  return NextResponse.json({
    data: {
      conversation: convo,
      messages: allMessages,
    },
  })
}
