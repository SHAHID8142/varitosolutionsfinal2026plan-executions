/**
 * @file route.ts
 * @description Customer unread message count API.
 *              GET — returns count of conversations where unreadCustomer > 0.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { conversations } from "@/db/schema"
import { eq, and, gt, count } from "drizzle-orm"

// ─────────────────────────────────────────────
// GET /api/conversations/unread-count
// ─────────────────────────────────────────────

/**
 * Returns the number of conversations where the authenticated customer has unread messages.
 * Used to drive the chat widget unread badge dot.
 */
export async function GET(request: NextRequest) {
  const authUser = await getAuthUser(request)

  if (!authUser?.dbUser) {
    return NextResponse.json(
      { error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 }
    )
  }

  const [result] = await db
    .select({ count: count() })
    .from(conversations)
    .where(
      and(
        eq(conversations.customerId, authUser.dbUser.id),
        gt(conversations.unreadCustomer, 0)
      )
    )

  return NextResponse.json({ data: { count: result?.count ?? 0 } })
}
