/**
 * @file api/admin/customers/[id]/unban/route.ts
 * @description Admin (super_admin): unban a customer account.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { requireAdmin, isAuthError, auditLog } from "@/lib/admin-auth"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request, { role: "super_admin" })
  if (isAuthError(admin)) return admin

  const { id } = await params

  const [updated] = await db
    .update(users)
    .set({ isBanned: false, banReason: null, updatedAt: new Date() })
    .where(and(eq(users.id, id), eq(users.role, "customer")))
    .returning({ id: users.id })

  if (!updated) {
    return NextResponse.json(
      { error: "Customer not found", code: "NOT_FOUND" },
      { status: 404 }
    )
  }

  auditLog(admin, request, "unban_customer", "user", id, {})

  return NextResponse.json({ data: { message: "Customer unbanned" } })
}
