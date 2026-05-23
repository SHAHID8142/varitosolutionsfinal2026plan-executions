/**
 * @file api/admin/coupons/route.ts
 * @description Admin (super_admin): list and create discount coupons.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { coupons } from "@/db/schema"
import { desc } from "drizzle-orm"
import { requireAdmin, isAuthError, auditLog } from "@/lib/admin-auth"

const createSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[A-Z0-9_-]+$/, "Coupon code must be uppercase letters, numbers, hyphens, underscores"),
  type: z.enum(["percent", "fixed"]),
  value: z.number().positive(),
  maxDiscount: z.number().positive().optional(),
  minOrder: z.number().min(0).optional(),
  usageLimit: z.number().int().positive().optional(),
  expiresAt: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
})

export async function GET(request: Request) {
  const admin = await requireAdmin(request, { role: "super_admin" })
  if (isAuthError(admin)) return admin

  const rows = await db
    .select()
    .from(coupons)
    .orderBy(desc(coupons.createdAt))

  return NextResponse.json({
    data: rows.map((c) => ({
      id: String(c.id),
      code: c.code,
      type: c.type,
      value: parseFloat(c.value),
      maxDiscount: c.maxDiscount ? parseFloat(c.maxDiscount) : null,
      minOrder: c.minOrder ? parseFloat(c.minOrder) : null,
      usageLimit: c.usageLimit,
      usedCount: c.usedCount,
      expiresAt: c.expiresAt?.toISOString(),
      isActive: c.isActive,
      createdAt: c.createdAt.toISOString(),
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

  const data = parsed.data
  const [coupon] = await db
    .insert(coupons)
    .values({
      code: data.code.toUpperCase(),
      type: data.type,
      value: String(data.value),
      maxDiscount: data.maxDiscount ? String(data.maxDiscount) : null,
      minOrder: data.minOrder ? String(data.minOrder) : null,
      usageLimit: data.usageLimit ?? null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      isActive: data.isActive,
      createdBy: admin.userId,
    })
    .returning({ id: coupons.id })

  auditLog(admin, request, "create_coupon", "coupon", String(coupon.id), { code: data.code })

  return NextResponse.json({ data: { id: String(coupon.id) } }, { status: 201 })
}
