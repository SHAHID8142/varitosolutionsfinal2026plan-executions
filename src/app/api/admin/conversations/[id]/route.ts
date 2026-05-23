/**
 * @file route.ts
 * @description Admin single conversation management API.
 *              PATCH — update conversation status (open | resolved | closed).
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { conversations } from "@/db/schema"
import { eq } from "drizzle-orm"

// ─────────────────────────────────────────────
// SCHEMAS
// ─────────────────────────────────────────────

const updateStatusSchema = z.object({
  status: z.enum(["open", "resolved", "closed"]),
})

// ─────────────────────────────────────────────
// PATCH /api/admin/conversations/[id]
// ─────────────────────────────────────────────

/**
 * Admin-only: updates a conversation's status.
 * Sets closedAt and closedBy when status is 'closed'.
 * Clears closedAt when re-opening.
 */
export async function PATCH(
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

  const isStaff =
    authUser.dbUser.role === "staff" || authUser.dbUser.role === "super_admin"

  if (!isStaff) {
    return NextResponse.json(
      { error: "Forbidden", code: "FORBIDDEN" },
      { status: 403 }
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
  const parsed = updateStatusSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", code: "VALIDATION_ERROR", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { status } = parsed.data
  const now = new Date()

  const updateValues: Partial<{
    status: string
    updatedAt: Date
    closedAt: Date | null
    closedBy: string | null
  }> = {
    status,
    updatedAt: now,
  }

  if (status === "closed") {
    // Record who closed it and when
    updateValues.closedAt = now
    updateValues.closedBy = authUser.dbUser.id
  } else {
    // Re-opening or resolving — clear close metadata
    updateValues.closedAt = null
    updateValues.closedBy = null
  }

  const [updated] = await db
    .update(conversations)
    .set(updateValues)
    .where(eq(conversations.id, conversationId))
    .returning()

  if (!updated) {
    return NextResponse.json(
      { error: "Conversation not found", code: "NOT_FOUND" },
      { status: 404 }
    )
  }

  return NextResponse.json({ data: updated, message: "Status updated" })
}
