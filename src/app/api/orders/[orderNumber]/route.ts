/**
 * @file api/orders/[orderNumber]/route.ts
 * @description Public order status lookup by order number.
 *              No auth required — order number acts as the access token.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders, orderItems } from "@/db/schema"
import { eq } from "drizzle-orm"
import { publicApiRatelimit, getClientIp } from "@/lib/ratelimit"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const ip = getClientIp(request)
  const { success } = await publicApiRatelimit.limit(ip)
  if (!success) {
    return NextResponse.json({ error: "Too many requests", code: "RATE_LIMITED" }, { status: 429 })
  }

  const { orderNumber } = await params

  const [order] = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      total: orders.total,
      customerName: orders.customerName,
      addressDistrict: orders.addressDistrict,
      addressThana: orders.addressThana,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1)

  if (!order) {
    return NextResponse.json({ error: "Order not found", code: "NOT_FOUND" }, { status: 404 })
  }

  const items = await db
    .select({
      productName: orderItems.productName,
      qty: orderItems.qty,
      unitPrice: orderItems.unitPrice,
    })
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id))

  const estimatedDelivery = new Date(order.createdAt)
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5)

  return NextResponse.json({
    data: {
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      items: items.map((i) => ({
        name: i.productName,
        qty: i.qty,
        price: parseFloat(i.unitPrice),
      })),
      total: parseFloat(order.total),
      address: {
        name: order.customerName,
        district: order.addressDistrict,
        thana: order.addressThana,
      },
      createdAt: order.createdAt.toISOString(),
      estimatedDelivery: estimatedDelivery.toISOString().split("T")[0],
    },
  })
}
