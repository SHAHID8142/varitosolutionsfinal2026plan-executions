/**
 * @file api/admin/coupons/[id]/route.ts
 * @description Admin (super_admin): update or delete a coupon.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { coupons } from "@/db/schema"
import { eq } from "drizzle-orm"
import { requireAdmin, isAuthError, auditLog } from "@/lib/admin-auth"

const updateSchema = z.object({
  type: z.enum(["percent", "fixed"]).optional(),
  value: z.number().positive().optional(),
  maxDiscount: z.number().positive().optional().nullable(),
  minOrder: z.number().min(0).optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
  isActive: z.boolean().optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request, { role: "super_admin" })
  if (isAuthError(admin)) return admin

  const { id } = await params
  const couponId = parseInt(id, 10)
  if (isNaN(couponId)) {
    return NextResponse.json({ error: "Invalid coupon ID", code: "INVALID_ID" }, { status: 400 })
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

  const data = parsed.data
  const updateData: Record<string, unknown> = {}
  if (data.type !== undefined) updateData.type = data.type
  if (data.value !== undefined) updateData.value = String(data.value)
  if (data.maxDiscount !== undefined) updateData.maxDiscount = data.maxDiscount ? String(data.maxDiscount) : null
  if (data.minOrder !== undefined) updateData.minOrder = data.minOrder ? String(data.minOrder) : null
  if (data.usageLimit !== undefined) updateData.usageLimit = data.usageLimit
  if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null
  if (data.isActive !== undefined) updateData.isActive = data.isActive

  const [updated] = await db
    .update(coupons)
    .set(updateData)
    .where(eq(coupons.id, couponId))
    .returning({ id: coupons.id })

  if (!updated) {
    return NextResponse.json({ error: "Coupon not found", code: "NOT_FOUND" }, { status: 404 })
  }

  auditLog(admin, request, "update_coupon", "coupon", id, data)

  return NextResponse.json({ data: { message: "Coupon updated" } })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request, { role: "super_admin" })
  if (isAuthError(admin)) return admin

  const { id } = await params
  const couponId = parseInt(id, 10)
  if (isNaN(couponId)) {
    return NextResponse.json({ error: "Invalid coupon ID", code: "INVALID_ID" }, { status: 400 })
  }

  // Deactivate rather than hard delete — preserves coupon usage history
  const [deleted] = await db
    .update(coupons)
    .set({ isActive: false })
    .where(eq(coupons.id, couponId))
    .returning({ id: coupons.id, code: coupons.code })

  if (!deleted) {
    return NextResponse.json({ error: "Coupon not found", code: "NOT_FOUND" }, { status: 404 })
  }

  auditLog(admin, request, "delete_coupon", "coupon", id, { code: deleted.code })

  return NextResponse.json({ data: { message: "Coupon deactivated" } })
}
