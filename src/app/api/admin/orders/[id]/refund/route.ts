/**
 * @file api/admin/orders/[id]/refund/route.ts
 * @description Admin (super_admin only): mark order as refunded.
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
  reason: z.string().min(5).max(500),
  amount: z.number().positive().optional(),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request, { role: "super_admin" })
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
    .select({ id: orders.id, orderNumber: orders.orderNumber, paymentStatus: orders.paymentStatus, status: orders.status })
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1)

  if (!order) {
    return NextResponse.json({ error: "Order not found", code: "NOT_FOUND" }, { status: 404 })
  }

  if (order.paymentStatus === "refunded") {
    return NextResponse.json(
      { error: "Order is already refunded", code: "ALREADY_REFUNDED" },
      { status: 400 }
    )
  }

  await db
    .update(orders)
    .set({ paymentStatus: "refunded", status: "cancelled", updatedAt: new Date() })
    .where(eq(orders.id, orderId))

  await db.insert(orderHistory).values({
    orderId,
    fromStatus: order.status,
    toStatus: "cancelled",
    note: `Refunded. Reason: ${parsed.data.reason}`,
    changedBy: admin.userId,
  })

  auditLog(admin, request, "refund_order", "order", String(orderId), {
    reason: parsed.data.reason,
    amount: parsed.data.amount,
    orderNumber: order.orderNumber,
  })

  return NextResponse.json({ data: { message: "Order marked as refunded" } })
}
