/**
 * @file api/admin/orders/[id]/notes/route.ts
 * @description Admin: update internal admin notes on an order.
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

const bodySchema = z.object({
  adminNotes: z.string().max(2000),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

  const [order] = await db.select({ id: orders.id }).from(orders).where(eq(orders.id, orderId))
  if (!order) {
    return NextResponse.json({ error: "Order not found", code: "NOT_FOUND" }, { status: 404 })
  }

  await db
    .update(orders)
    .set({ adminNotes: parsed.data.adminNotes, updatedAt: new Date() })
    .where(eq(orders.id, orderId))

  auditLog(admin, request, "update_order_notes", "order", String(orderId))

  return NextResponse.json({ data: { success: true } })
}
