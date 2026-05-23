/**
 * @file api/admin/users/route.ts
 * @description Admin (super_admin): list and create admin users.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { users } from "@/db/schema"
import { desc, ne } from "drizzle-orm"
import { requireAdmin, isAuthError, auditLog } from "@/lib/admin-auth"
import { supabaseAdmin } from "@/lib/auth"

const createSchema = z.object({
  phone: z.string().regex(/^\+8801[3-9]\d{8}$/, "Invalid Bangladesh phone number"),
  name: z.string().min(2).max(100),
  role: z.enum(["super_admin", "staff"]),
})

export async function GET(request: Request) {
  const admin = await requireAdmin(request, { role: "super_admin" })
  if (isAuthError(admin)) return admin

  const adminUsers = await db
    .select({
      id: users.id,
      name: users.name,
      phone: users.phone,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(ne(users.role, "customer"))
    .orderBy(desc(users.createdAt))

  return NextResponse.json({
    data: adminUsers.map((u) => ({
      id: u.id,
      name: u.name,
      phone: u.phone,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt.toISOString(),
    })),
  })
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request, { role: "super_admin" })
  if (isAuthError(admin)) return admin

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body", code: "INVALID_BODY" }, { status: 400 })
  }

  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
      { status: 400 }
    )
  }

  const { phone, name, role } = parsed.data

  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    phone,
    phone_confirm: true,
    user_metadata: { name, role },
  })

  if (authError || !authUser.user) {
    return NextResponse.json(
      { error: authError?.message ?? "Failed to create auth user", code: "AUTH_ERROR" },
      { status: 500 }
    )
  }

  const [user] = await db
    .insert(users)
    .values({
      supabaseId: authUser.user.id,
      phone,
      name,
      role,
    })
    .onConflictDoUpdate({
      target: users.supabaseId,
      set: { name, role, updatedAt: new Date() },
    })
    .returning({ id: users.id })

  auditLog(admin, request, "create_admin_user", "user", user.id, { phone, role })

  return NextResponse.json({ data: { id: user.id } }, { status: 201 })
}
