/**
 * @file api/admin/orders/[id]/route.ts
 * @description Admin: get single order details with items and history.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders, orderItems, orderHistory } from "@/db/schema"
import { and, desc, eq } from "drizzle-orm"
import { requireAdmin, isAuthError } from "@/lib/admin-auth"

export async function GET(
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

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1)

  if (!order) {
    return NextResponse.json({ error: "Order not found", code: "NOT_FOUND" }, { status: 404 })
  }

  const [items, history] = await Promise.all([
    db.select().from(orderItems).where(eq(orderItems.orderId, orderId)),
    db
      .select()
      .from(orderHistory)
      .where(eq(orderHistory.orderId, orderId))
      .orderBy(desc(orderHistory.createdAt)),
  ])

  return NextResponse.json({
    data: {
      id: String(order.id),
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      aamarpayTxnId: order.aamarpayTxnId,
      subtotal: parseFloat(order.subtotal),
      deliveryCharge: parseFloat(order.deliveryCharge),
      codFee: parseFloat(order.codFee),
      discount: parseFloat(order.discount),
      total: parseFloat(order.total),
      notes: order.notes,
      adminNotes: order.adminNotes,
      shippingAddress: {
        name: order.customerName,
        phone: order.customerPhone,
        district: order.addressDistrict,
        thana: order.addressThana,
        area: order.addressArea,
        road: order.addressRoad,
        house: order.addressHouse,
        landmark: order.addressLandmark,
      },
      items: items.map((i) => ({
        id: String(i.id),
        productId: String(i.productId),
        name: i.productName,
        qty: i.qty,
        unitPrice: parseFloat(i.unitPrice),
        total: parseFloat(i.total),
      })),
      history: history.map((h) => ({
        fromStatus: h.fromStatus,
        toStatus: h.toStatus,
        note: h.note,
        createdAt: h.createdAt.toISOString(),
      })),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    },
  })
}
