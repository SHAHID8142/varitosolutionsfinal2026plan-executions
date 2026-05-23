/**
 * @file api/payment/initiate/route.ts
 * @description Initiate aamarPay payment session for an existing order.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { orders } from "@/db/schema"
import { eq } from "drizzle-orm"
import { initiateAamarPayPayment } from "@/lib/aamarpay"
import { paymentRatelimit, getClientIp } from "@/lib/ratelimit"

const bodySchema = z.object({
  orderId: z.string().min(1),
  method: z.enum(["bkash", "nagad", "card"]),
})

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const { success } = await paymentRatelimit.limit(ip)
  if (!success) {
    return NextResponse.json({ error: "Too many requests", code: "RATE_LIMITED" }, { status: 429 })
  }

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

  const orderId = parseInt(parsed.data.orderId, 10)
  if (isNaN(orderId)) {
    return NextResponse.json({ error: "Invalid order ID", code: "INVALID_ID" }, { status: 400 })
  }

  const [order] = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      total: orders.total,
      paymentStatus: orders.paymentStatus,
      customerName: orders.customerName,
      customerPhone: orders.customerPhone,
    })
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1)

  if (!order) {
    return NextResponse.json({ error: "Order not found", code: "NOT_FOUND" }, { status: 404 })
  }

  if (order.paymentStatus === "paid") {
    return NextResponse.json(
      { error: "Order is already paid", code: "ALREADY_PAID" },
      { status: 400 }
    )
  }

  try {
    const redirectUrl = await initiateAamarPayPayment({
      orderId: String(order.id),
      amount: parseFloat(order.total),
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: `${order.customerPhone}@varito.com.bd`,
    })

    return NextResponse.json({ data: { redirectUrl } })
  } catch {
    return NextResponse.json(
      { error: "Failed to initiate payment", code: "PAYMENT_INIT_FAILED" },
      { status: 502 }
    )
  }
}
