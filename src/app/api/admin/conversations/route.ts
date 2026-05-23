/**
 * @file route.ts
 * @description Admin conversations inbox API.
 *              GET — list all conversations with customer info + latest message preview.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { conversations, users, messages } from "@/db/schema"
import { eq, desc, ilike, or, and, ne } from "drizzle-orm"

// ─────────────────────────────────────────────
// GET /api/admin/conversations
// ─────────────────────────────────────────────

/**
 * Admin-only: returns all conversations with customer info and latest message.
 * Supports query params: status (open|resolved|closed|all), search (customer name/phone).
 */
export async function GET(request: NextRequest) {
  const authUser = await getAuthUser(request)

  if (!authUser?.dbUser) {
    return NextResponse.json(
      { error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 }
    )
  }

  const isStaff =
    authUser.dbUser.role === "staff" || authUser.dbUser.role === "super_admin"

  if (!isStaff) {
    return NextResponse.json(
      { error: "Forbidden", code: "FORBIDDEN" },
      { status: 403 }
    )
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status") ?? "all"
  const search = searchParams.get("search") ?? ""

  // ── Build filters ────────────────────────────────────────────────────────
  const filters = []

  if (status !== "all") {
    filters.push(eq(conversations.status, status))
  }

  // Search by joining users — we'll handle this with a subquery approach
  // using a join so we can filter on customer name/phone
  const query = db
    .select({
      id: conversations.id,
      subject: conversations.subject,
      status: conversations.status,
      unreadStaff: conversations.unreadStaff,
      unreadCustomer: conversations.unreadCustomer,
      lastMessageAt: conversations.lastMessageAt,
      orderId: conversations.orderId,
      closedAt: conversations.closedAt,
      createdAt: conversations.createdAt,
      customerId: conversations.customerId,
      customerName: users.name,
      customerPhone: users.phone,
    })
    .from(conversations)
    .innerJoin(users, eq(conversations.customerId, users.id))
    .orderBy(desc(conversations.lastMessageAt))

  const baseFilters = [...filters]

  if (search) {
    baseFilters.push(
      or(
        ilike(users.name, `%${search}%`),
        ilike(users.phone, `%${search}%`)
      )!
    )
  }

  const rows =
    baseFilters.length > 0
      ? await query.where(and(...baseFilters))
      : await query

  // ── Fetch latest message for each conversation ────────────────────────────
  // Efficient: one extra query to get the latest messages for all conversation IDs
  const conversationIds = rows.map((r) => r.id)

  let latestMessages: Array<{ conversationId: number; content: string }> = []

  if (conversationIds.length > 0) {
    // Get one latest message per conversation using a subquery
    const allLatest = await Promise.all(
      conversationIds.map(async (cid) => {
        const [msg] = await db
          .select({ conversationId: messages.conversationId, content: messages.content })
          .from(messages)
          .where(eq(messages.conversationId, cid))
          .orderBy(desc(messages.createdAt))
          .limit(1)
        return msg ?? null
      })
    )
    latestMessages = allLatest.filter(Boolean) as typeof latestMessages
  }

  const latestMap = new Map(latestMessages.map((m) => [m.conversationId, m.content]))

  const data = rows.map((r) => ({
    ...r,
    latestMessage: latestMap.get(r.id) ?? null,
  }))

  return NextResponse.json({ data })
}
