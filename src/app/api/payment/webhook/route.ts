/**
 * @file api/payment/webhook/route.ts
 * @description aamarPay payment webhook. MUST verify signature before processing.
 *              Always returns 200 — aamarPay retries on non-200.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders, orderHistory } from "@/db/schema"
import { eq } from "drizzle-orm"
import { verifyAamarPaySignature } from "@/lib/aamarpay"
import { sendOrderConfirmationEmail } from "@/lib/brevo"
import type { AamarPayWebhookPayload } from "@/lib/aamarpay"

export async function POST(request: Request) {
  let payload: AamarPayWebhookPayload
  const contentType = request.headers.get("content-type") ?? ""

  try {
    if (contentType.includes("application/json")) {
      payload = await request.json()
    } else {
      const formData = await request.formData()
      payload = Object.fromEntries(formData.entries()) as unknown as AamarPayWebhookPayload
    }
  } catch {
    return new NextResponse("OK", { status: 200 })
  }

  const signatureValid = verifyAamarPaySignature(payload)
  if (!signatureValid) {
    console.error("[webhook] aamarPay signature verification failed", {
      orderId: payload.mer_txnid,
    })
    return new NextResponse("OK", { status: 200 })
  }

  const orderId = parseInt(payload.mer_txnid, 10)
  if (isNaN(orderId)) {
    return new NextResponse("OK", { status: 200 })
  }

  const [order] = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      paymentStatus: orders.paymentStatus,
      total: orders.total,
      customerName: orders.customerName,
      customerPhone: orders.customerPhone,
    })
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1)

  if (!order) {
    return new NextResponse("OK", { status: 200 })
  }

  if (order.paymentStatus === "paid" || order.paymentStatus === "refunded") {
    return new NextResponse("OK", { status: 200 })
  }

  const isPaid = payload.pay_status === "Successful"
  const newPaymentStatus = isPaid ? "paid" : "failed"
  const newOrderStatus = isPaid ? "confirmed" : "cancelled"

  await db
    .update(orders)
    .set({
      paymentStatus: newPaymentStatus,
      status: newOrderStatus,
      aamarpayTxnId: payload.pg_txnid ?? null,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))

  await db.insert(orderHistory).values({
    orderId: order.id,
    toStatus: newOrderStatus,
    note: isPaid
      ? `Payment confirmed. Transaction: ${payload.pg_txnid}`
      : `Payment failed. Reason: ${payload.pay_status}`,
  })

  if (isPaid) {
    sendOrderConfirmationEmail({
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      orderNumber: order.orderNumber,
      items: [],
      subtotal: parseFloat(order.total),
      deliveryCharge: 0,
      codFee: 0,
      total: parseFloat(order.total),
      paymentMethod: "online",
      address: { district: "", thana: "" },
    }).catch(() => {})
  }

  return new NextResponse("OK", { status: 200 })
}
