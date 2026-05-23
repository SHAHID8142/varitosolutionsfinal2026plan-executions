/**
 * @file api/admin/customers/[id]/ban/route.ts
 * @description Admin (super_admin): ban a customer account.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { users } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { requireAdmin, isAuthError, auditLog } from "@/lib/admin-auth"

const bodySchema = z.object({
  reason: z.string().min(5).max(500),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request, { role: "super_admin" })
  if (isAuthError(admin)) return admin

  const { id } = await params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body", code: "INVALID_BODY" }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
      { status: 400 }
    )
  }

  const [updated] = await db
    .update(users)
    .set({ isBanned: true, banReason: parsed.data.reason, updatedAt: new Date() })
    .where(and(eq(users.id, id), eq(users.role, "customer")))
    .returning({ id: users.id, phone: users.phone })

  if (!updated) {
    return NextResponse.json(
      { error: "Customer not found", code: "NOT_FOUND" },
      { status: 404 }
    )
  }

  auditLog(admin, request, "ban_customer", "user", id, { reason: parsed.data.reason })

  return NextResponse.json({ data: { message: "Customer banned" } })
}
