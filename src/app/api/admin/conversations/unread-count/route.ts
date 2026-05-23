/**
 * @file route.ts
 * @description Admin unread staff messages count API.
 *              GET — total unreadStaff across all open conversations.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { conversations } from "@/db/schema"
import { eq, and, gt, sql } from "drizzle-orm"

// ─────────────────────────────────────────────
// GET /api/admin/conversations/unread-count
// ─────────────────────────────────────────────

/**
 * Admin-only: returns the total count of unread staff messages across all open conversations.
 * Used to drive the sidebar Messages badge.
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

  // Sum the unreadStaff counter across all open conversations
  const [result] = await db
    .select({ total: sql<number>`coalesce(sum(${conversations.unreadStaff}), 0)` })
    .from(conversations)
    .where(
      and(
        eq(conversations.status, "open"),
        gt(conversations.unreadStaff, 0)
      )
    )

  return NextResponse.json({ data: { count: Number(result?.total ?? 0) } })
}
