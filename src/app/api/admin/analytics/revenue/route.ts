/**
 * @file api/admin/analytics/revenue/route.ts
 * @description Admin: daily revenue for a date range. Used for revenue charts.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { orders } from "@/db/schema"
import { and, gte, lte, sql } from "drizzle-orm"
import { requireAdmin, isAuthError } from "@/lib/admin-auth"

const querySchema = z.object({
  from: z.string().default(() => {
    const d = new Date()
    d.setDate(d.getDate() - 29)
    return d.toISOString().split("T")[0]
  }),
  to: z.string().default(() => new Date().toISOString().split("T")[0]),
})

export async function GET(request: Request) {
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  const url = new URL(request.url)
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams))
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid parameters", code: "VALIDATION_ERROR" }, { status: 400 })
  }

  const from = new Date(parsed.data.from)
  const to = new Date(parsed.data.to)
  to.setHours(23, 59, 59, 999)

  const rows = await db
    .select({
      date: sql<string>`DATE(${orders.createdAt})`.as("date"),
      revenue: sql<string>`SUM(${orders.total})`.as("revenue"),
      orderCount: sql<number>`COUNT(*)`.as("order_count"),
    })
    .from(orders)
    .where(and(gte(orders.createdAt, from), lte(orders.createdAt, to)))
    .groupBy(sql`DATE(${orders.createdAt})`)
    .orderBy(sql`DATE(${orders.createdAt})`)

  return NextResponse.json({
    data: rows.map((r) => ({
      date: r.date,
      revenue: parseFloat(r.revenue ?? "0"),
      orderCount: Number(r.orderCount),
    })),
  })
}
