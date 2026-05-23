/**
 * @file api/admin/orders/[id]/status/route.ts
 * @description Admin: update order status and append history entry.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { orders, orderHistory } from "@/db/schema"
import { eq } from "drizzle-orm"
import { requireAdmin, isAuthError, auditLog } from "@/lib/admin-auth"

const bodySchema = z.object({
  status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]),
  note: z.string().max(500).optional(),
  trackingNumber: z.string().max(100).optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  const { id } = await params
  const orderId = parseInt(id, 10)
  if (isNaN(orderId)) {
    return NextResponse.json({ error: "Invalid order ID", code: "INVALID_ID" }, { status: 400 })
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
    .select({ id: orders.id, status: orders.status, orderNumber: orders.orderNumber })
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1)

  if (!order) {
    return NextResponse.json({ error: "Order not found", code: "NOT_FOUND" }, { status: 404 })
  }

  const updateData: Record<string, unknown> = {
    status: parsed.data.status,
    updatedAt: new Date(),
  }
  if (parsed.data.trackingNumber) {
    updateData.consignmentId = parsed.data.trackingNumber
  }

  await db.update(orders).set(updateData).where(eq(orders.id, orderId))

  await db.insert(orderHistory).values({
    orderId,
    fromStatus: order.status,
    toStatus: parsed.data.status,
    note: parsed.data.note ?? `Status updated to ${parsed.data.status}`,
    changedBy: admin.userId,
  })

  auditLog(admin, request, "update_order_status", "order", String(orderId), {
    fromStatus: order.status,
    toStatus: parsed.data.status,
    orderNumber: order.orderNumber,
  })

  return NextResponse.json({ data: { message: "Order status updated" } })
}
