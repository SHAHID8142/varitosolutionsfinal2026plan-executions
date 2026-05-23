/**
 * @file api/admin/orders/route.ts
 * @description Admin order list with filters, search, and cursor pagination.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { orders } from "@/db/schema"
import { and, count, desc, eq, gte, ilike, isNull, lt, lte, or } from "drizzle-orm"
import { requireAdmin, isAuthError } from "@/lib/admin-auth"

const listQuerySchema = z.object({
  status: z
    .enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"])
    .optional(),
  paymentStatus: z.enum(["pending", "pending_cod", "paid", "failed", "refunded"]).optional(),
  paymentMethod: z.enum(["cod", "bkash", "nagad", "card"]).optional(),
  search: z.string().max(100).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(25),
})

export async function GET(request: Request) {
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  const url = new URL(request.url)
  const parsed = listQuerySchema.safeParse(Object.fromEntries(url.searchParams))
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
      { status: 400 }
    )
  }

  const { status, paymentStatus, paymentMethod, search, dateFrom, dateTo, cursor, limit } =
    parsed.data

  const conditions = []

  if (status) conditions.push(eq(orders.status, status))
  if (paymentStatus) conditions.push(eq(orders.paymentStatus, paymentStatus))
  if (paymentMethod) conditions.push(eq(orders.paymentMethod, paymentMethod))

  if (search) {
    conditions.push(
      or(
        ilike(orders.orderNumber, `%${search}%`),
        ilike(orders.customerName, `%${search}%`),
        ilike(orders.customerPhone, `%${search}%`)
      )!
    )
  }

  if (dateFrom) {
    const from = new Date(dateFrom)
    if (!isNaN(from.getTime())) conditions.push(gte(orders.createdAt, from))
  }
  if (dateTo) {
    const to = new Date(dateTo)
    if (!isNaN(to.getTime())) conditions.push(lte(orders.createdAt, to))
  }

  if (cursor) {
    const decodedId = parseInt(Buffer.from(cursor, "base64").toString("utf8"), 10)
    if (!isNaN(decodedId)) conditions.push(lt(orders.id, decodedId))
  }

  const where = conditions.length ? and(...conditions) : undefined

  const rows = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      paymentMethod: orders.paymentMethod,
      total: orders.total,
      customerName: orders.customerName,
      customerPhone: orders.customerPhone,
      addressDistrict: orders.addressDistrict,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(where)
    .orderBy(desc(orders.id))
    .limit(limit + 1)

  const hasMore = rows.length > limit
  const page = hasMore ? rows.slice(0, limit) : rows
  const nextCursor = hasMore
    ? Buffer.from(String(page[page.length - 1].id)).toString("base64")
    : null

  const [{ value: total }] = await db.select({ value: count() }).from(orders)

  return NextResponse.json({
    data: page.map((o) => ({
      id: String(o.id),
      orderNumber: o.orderNumber,
      status: o.status,
      paymentStatus: o.paymentStatus,
      paymentMethod: o.paymentMethod,
      total: parseFloat(o.total),
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      district: o.addressDistrict,
      createdAt: o.createdAt.toISOString(),
    })),
    nextCursor,
    total,
  })
}
