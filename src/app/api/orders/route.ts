/**
 * @file api/orders/route.ts
 * @description Create a new order. Works for guests and authenticated users.
 *              Prices are always calculated server-side — never trust client.
 *              COD fee: ৳40. Decrements stock on order creation.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { products, orders, orderItems, coupons, couponUses, orderHistory } from "@/db/schema"
import { and, eq, inArray, isNull, sql } from "drizzle-orm"
import { getAuthUser } from "@/lib/auth"
import { initiateAamarPayPayment } from "@/lib/aamarpay"
import { sendOrderConfirmationEmail } from "@/lib/brevo"
import { orderRatelimit, getClientIp } from "@/lib/ratelimit"

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const COD_FEE = 40
const DELIVERY_CHARGE = 80

// ─────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────

const addressSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^01[3-9]\d{8}$/, "Invalid Bangladesh phone number (01XXXXXXXXX)"),
  district: z.string().min(1).max(100),
  thana: z.string().min(1).max(100),
  area: z.string().min(1).max(200),
  road: z.string().max(200).optional(),
  house: z.string().max(200).optional(),
  landmark: z.string().max(200).optional(),
})

const bodySchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.coerce.number().int().positive(),
        qty: z.number().int().min(1).max(999),
      })
    )
    .min(1)
    .max(50),
  address: addressSchema,
  paymentMethod: z.enum(["cod", "bkash", "nagad", "card"]),
  couponCode: z.string().max(50).optional(),
  notes: z.string().max(500).optional(),
})

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const [{ value }] = await db.execute<{ value: number }>(
    sql`SELECT nextval('order_number_seq') AS value`
  )
  return `VR-${year}-${String(value).padStart(5, "0")}`
}

// ─────────────────────────────────────────────
// HANDLER
// ─────────────────────────────────────────────

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const { success } = await orderRatelimit.limit(ip)
  if (!success) {
    return NextResponse.json({ error: "Too many requests", code: "RATE_LIMITED" }, { status: 429 })
  }

  const authUser = await getAuthUser(request).catch(() => null)

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

  const { items, address, paymentMethod, couponCode, notes } = parsed.data
  const productIds = items.map((i) => i.productId)

  const productRows = await db
    .select({
      id: products.id,
      name: products.name,
      sku: products.sku,
      price: products.price,
      salePrice: products.salePrice,
      stock: products.stock,
      minOrderQty: products.minOrderQty,
      images: products.images,
    })
    .from(products)
    .where(
      and(inArray(products.id, productIds), isNull(products.deletedAt), eq(products.isActive, true))
    )

  if (productRows.length !== productIds.length) {
    return NextResponse.json(
      { error: "One or more products are unavailable", code: "PRODUCT_UNAVAILABLE" },
      { status: 400 }
    )
  }

  const productMap = new Map(productRows.map((p) => [p.id, p]))

  for (const item of items) {
    const product = productMap.get(item.productId)!
    if (product.stock < item.qty) {
      return NextResponse.json(
        {
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
          code: "INSUFFICIENT_STOCK",
        },
        { status: 400 }
      )
    }
    if (item.qty < product.minOrderQty) {
      return NextResponse.json(
        {
          error: `Minimum order quantity for ${product.name} is ${product.minOrderQty}`,
          code: "MIN_QTY_VIOLATION",
        },
        { status: 400 }
      )
    }
  }

  // Server-side price calculation
  const lineItems = items.map((item) => {
    const p = productMap.get(item.productId)!
    const unitPrice = p.salePrice ? parseFloat(p.salePrice) : parseFloat(p.price)
    return {
      productId: item.productId,
      name: p.name,
      sku: p.sku,
      qty: item.qty,
      unitPrice,
      subtotal: unitPrice * item.qty,
      image: p.images?.[0] ?? null,
    }
  })

  const subtotal = lineItems.reduce((sum, l) => sum + l.subtotal, 0)
  const codFee = paymentMethod === "cod" ? COD_FEE : 0
  let discount = 0
  let couponId: number | undefined

  if (couponCode) {
    const now = new Date()
    const [coupon] = await db
      .select()
      .from(coupons)
      .where(
        and(
          eq(coupons.code, couponCode.toUpperCase()),
          eq(coupons.isActive, true)
        )
      )
      .limit(1)

    if (!coupon) {
      return NextResponse.json(
        { error: "Invalid or expired coupon code", code: "INVALID_COUPON" },
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
    if (subtotal < minOrder) {
      return NextResponse.json(
        {
          error: `Minimum order amount for this coupon is ৳${coupon.minOrder}`,
          code: "COUPON_MIN_AMOUNT",
        },
        { status: 400 }
      )
    }

    discount =
      coupon.type === "percent"
        ? Math.min(
            (subtotal * parseFloat(coupon.value)) / 100,
            parseFloat(coupon.maxDiscount ?? "99999")
          )
        : parseFloat(coupon.value)

    couponId = coupon.id
  }

  const total = Math.max(0, subtotal - discount) + DELIVERY_CHARGE + codFee
  const orderNumber = await generateOrderNumber()

  const [order] = await db
    .insert(orders)
    .values({
      orderNumber,
      userId: authUser?.dbUser?.id ?? null,
      status: "pending",
      paymentStatus: paymentMethod === "cod" ? "pending_cod" : "pending",
      paymentMethod,
      subtotal: String(subtotal),
      deliveryCharge: String(DELIVERY_CHARGE),
      codFee: String(codFee),
      discount: String(discount),
      total: String(total),
      customerName: address.name,
      customerPhone: address.phone,
      addressDistrict: address.district,
      addressThana: address.thana,
      addressArea: address.area,
      addressRoad: address.road ?? null,
      addressHouse: address.house ?? null,
      addressLandmark: address.landmark ?? null,
      notes: notes ?? null,
    })
    .returning()

  await db.insert(orderItems).values(
    lineItems.map((l) => ({
      orderId: order.id,
      productId: l.productId,
      productName: l.name,
      productSku: l.sku,
      productImage: l.image,
      unitPrice: String(l.unitPrice),
      qty: l.qty,
      total: String(l.subtotal),
    }))
  )

  await db.insert(orderHistory).values({
    orderId: order.id,
    toStatus: "pending",
    note: "Order placed",
  })

  await Promise.all(
    items.map((item) =>
      db
        .update(products)
        .set({ stock: sql`${products.stock} - ${item.qty}`, updatedAt: new Date() })
        .where(eq(products.id, item.productId))
    )
  )

  if (couponId) {
    await db.insert(couponUses).values({
      couponId,
      orderId: order.id,
      userId: authUser?.dbUser?.id ?? null,
      discount: String(discount),
    })
    await db
      .update(coupons)
      .set({ usedCount: sql`${coupons.usedCount} + 1` })
      .where(eq(coupons.id, couponId))
  }

  let paymentRedirectUrl: string | undefined
  if (paymentMethod !== "cod") {
    try {
      paymentRedirectUrl = await initiateAamarPayPayment({
        orderId: String(order.id),
        orderNumber: order.orderNumber,
        amount: total,
        customerName: address.name,
        customerPhone: address.phone,
        customerEmail: `${address.phone}@varito.com.bd`,
      })
    } catch {
      return NextResponse.json(
        { error: "Failed to initiate payment. Please try again.", code: "PAYMENT_INIT_FAILED" },
        { status: 502 }
      )
    }
  }

  sendOrderConfirmationEmail({
    to: `${address.phone}@varito.com.bd`,
    customerName: address.name,
    orderNumber: order.orderNumber,
    items: lineItems.map((l) => ({ name: l.name, qty: l.qty, price: l.unitPrice })),
    total,
    deliveryCharge: DELIVERY_CHARGE,
    paymentMethod,
  }).catch(() => {})

  return NextResponse.json(
    {
      data: {
        orderId: String(order.id),
        orderNumber: order.orderNumber,
        total,
        deliveryCharge: DELIVERY_CHARGE,
        codFee,
        discount,
        paymentMethod,
        status: order.status,
        ...(paymentRedirectUrl ? { paymentRedirectUrl } : {}),
      },
    },
    { status: 201 }
  )
}
