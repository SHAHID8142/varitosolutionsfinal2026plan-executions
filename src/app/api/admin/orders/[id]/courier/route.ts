/**
 * @file api/admin/orders/[id]/courier/route.ts
 * @description Admin: book a shipment via Steadfast, Pathao, or RedX.
 *              Idempotent — blocks if courier is already booked.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { orders } from "@/db/schema"
import { eq } from "drizzle-orm"
import { requireAdmin, isAuthError, auditLog } from "@/lib/admin-auth"
import { bookCourier, type CourierName } from "@/lib/courier"

const bodySchema = z.object({
  courier: z.enum(["steadfast", "pathao", "redx"]),
  note: z.string().max(200).optional(),
  weightKg: z.number().positive().optional(),
})

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  const { id } = await params
  const orderId = parseInt(id, 10)
  if (isNaN(orderId)) {
    return NextResponse.json({ error: "Invalid order ID", code: "VALIDATION_ERROR" }, { status: 400 })
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

  const [order] = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      paymentMethod: orders.paymentMethod,
      total: orders.total,
      customerName: orders.customerName,
      customerPhone: orders.customerPhone,
      addressDistrict: orders.addressDistrict,
      addressThana: orders.addressThana,
      addressArea: orders.addressArea,
      addressRoad: orders.addressRoad,
      addressHouse: orders.addressHouse,
      consignmentId: orders.consignmentId,
    })
    .from(orders)
    .where(eq(orders.id, orderId))

  if (!order) {
    return NextResponse.json({ error: "Order not found", code: "NOT_FOUND" }, { status: 404 })
  }

  // Only confirmed or processing orders can be shipped
  if (!["confirmed", "processing"].includes(order.status)) {
    return NextResponse.json(
      { error: "Order must be confirmed or processing before booking courier", code: "INVALID_STATUS" },
      { status: 422 }
    )
  }

  // Idempotency guard
  if (order.consignmentId) {
    return NextResponse.json(
      { error: "Shipment already booked for this order", code: "SHIPMENT_EXISTS" },
      { status: 409 }
    )
  }

  const recipientAddress = [
    order.addressHouse,
    order.addressRoad,
    order.addressArea,
    order.addressThana,
    order.addressDistrict,
  ]
    .filter(Boolean)
    .join(", ")

  const codAmount = order.paymentMethod === "cod" ? parseFloat(order.total) : 0

  let result
  try {
    result = await bookCourier(parsed.data.courier as CourierName, {
      orderNumber: order.orderNumber,
      recipientName: order.customerName,
      recipientPhone: order.customerPhone,
      recipientAddress,
      codAmount,
      note: parsed.data.note,
      weightKg: parsed.data.weightKg,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Courier booking failed"
    return NextResponse.json(
      { error: message, code: "INTERNAL_ERROR" },
      { status: 502 }
    )
  }

  await db
    .update(orders)
    .set({
      courierName: result.courier,
      consignmentId: result.consignmentId,
      courierStatus: "booked",
      status: "processing",
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))

  auditLog(admin, request, "book_courier", "order", String(orderId), {
    after: { courier: result.courier, consignmentId: result.consignmentId },
  })

  return NextResponse.json({
    data: {
      courier: result.courier,
      consignmentId: result.consignmentId,
      trackingCode: result.trackingCode,
      trackingUrl: result.trackingUrl,
    },
  })
}
