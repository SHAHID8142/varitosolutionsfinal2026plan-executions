/**
 * @file api/coupons/validate/route.ts
 * @description Public: validate a coupon code before order placement.
 *              Returns discount amount and type — does NOT apply the coupon.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { coupons } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { getAuthUser } from "@/lib/auth"

const bodySchema = z.object({
  code: z.string().min(1).max(50),
  orderSubtotal: z.number().positive(),
})

export async function POST(request: Request) {
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

  const { code, orderSubtotal } = parsed.data
  const now = new Date()

  const [coupon] = await db
    .select()
    .from(coupons)
    .where(and(eq(coupons.code, code.toUpperCase()), eq(coupons.isActive, true)))
    .limit(1)

  if (!coupon) {
    return NextResponse.json(
      { error: "Invalid or expired coupon code", code: "INVALID_COUPON" },
      { status: 400 }
    )
  }

  if (coupon.startsAt && coupon.startsAt > now) {
    return NextResponse.json(
      { error: "This coupon is not yet active", code: "INVALID_COUPON" },
      { status: 400 }
    )
  }

  if (coupon.expiresAt && coupon.expiresAt < now) {
    return NextResponse.json(
      { error: "This coupon has expired", code: "COUPON_EXPIRED" },
      { status: 400 }
    )
  }

  if (coupon.usageLimit && coupon.usedCount && coupon.usedCount >= coupon.usageLimit) {
    return NextResponse.json(
      { error: "This coupon has reached its usage limit", code: "COUPON_EXHAUSTED" },
      { status: 400 }
    )
  }

  const minOrder = parseFloat(coupon.minOrder ?? "0")
  if (orderSubtotal < minOrder) {
    return NextResponse.json(
      {
        error: `Minimum order amount for this coupon is ৳${coupon.minOrder}`,
        code: "COUPON_MIN_AMOUNT",
      },
      { status: 400 }
    )
  }

  // Per-user limit check (only for authenticated users)
  const authUser = await getAuthUser(request).catch(() => null)
  if (authUser?.dbUser && coupon.perUserLimit) {
    const { count } = await import("drizzle-orm")
    const { couponUses } = await import("@/db/schema")
    const [{ used }] = await db
      .select({ used: count() })
      .from(couponUses)
      .where(
        and(
          eq(couponUses.couponId, coupon.id),
          eq(couponUses.userId, authUser.dbUser.id)
        )
      )
    if (Number(used) >= coupon.perUserLimit) {
      return NextResponse.json(
        { error: "You have already used this coupon", code: "COUPON_EXHAUSTED" },
        { status: 400 }
      )
    }
  }

  const discount =
    coupon.type === "percent"
      ? Math.min(
          (orderSubtotal * parseFloat(coupon.value)) / 100,
          parseFloat(coupon.maxDiscount ?? "99999")
        )
      : parseFloat(coupon.value)

  return NextResponse.json({
    data: {
      code: coupon.code,
      type: coupon.type,
      value: parseFloat(coupon.value),
      discount: Math.round(discount * 100) / 100,
      maxDiscount: coupon.maxDiscount ? parseFloat(coupon.maxDiscount) : null,
    },
  })
}
