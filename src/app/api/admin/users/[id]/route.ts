/**
 * @file api/admin/users/[id]/route.ts
 * @description Admin (super_admin): update an admin user's role or name.
 *              A super_admin cannot modify themselves.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { requireAdmin, isAuthError, auditLog } from "@/lib/admin-auth"

const updateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  role: z.enum(["super_admin", "staff"]).optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request, { role: "super_admin" })
  if (isAuthError(admin)) return admin

  const { id } = await params

  if (id === admin.userId) {
    return NextResponse.json(
      { error: "Cannot modify your own admin account", code: "SELF_MODIFY_FORBIDDEN" },
      { status: 403 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body", code: "INVALID_BODY" }, { status: 400 })
  }

  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
      { status: 400 }
    )
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() }
  if (parsed.data.name) updateData.name = parsed.data.name
  if (parsed.data.role) updateData.role = parsed.data.role

  const [updated] = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, id))
    .returning({ id: users.id })

  if (!updated) {
    return NextResponse.json({ error: "User not found", code: "NOT_FOUND" }, { status: 404 })
  }

  auditLog(admin, request, "update_admin_user", "user", id, parsed.data)

  return NextResponse.json({ data: { message: "Admin user updated" } })
}
