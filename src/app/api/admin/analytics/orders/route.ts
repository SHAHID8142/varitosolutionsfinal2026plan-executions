/**
 * @file api/admin/analytics/orders/route.ts
 * @description Admin: order breakdown by status and payment method.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders } from "@/db/schema"
import { count, isNull, sql } from "drizzle-orm"
import { requireAdmin, isAuthError } from "@/lib/admin-auth"

export async function GET(request: Request) {
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  const [byStatus, byPaymentMethod] = await Promise.all([
    db
      .select({
        status: orders.status,
        count: count(),
      })
      .from(orders)
      .where(isNull(orders.deletedAt))
      .groupBy(orders.status),

    db
      .select({
        method: orders.paymentMethod,
        count: count(),
        revenue: sql<string>`SUM(${orders.total})`,
      })
      .from(orders)
      .where(isNull(orders.deletedAt))
      .groupBy(orders.paymentMethod),
  ])

  return NextResponse.json({
    data: {
      byStatus: byStatus.map((r) => ({ status: r.status, count: Number(r.count) })),
      byPaymentMethod: byPaymentMethod.map((r) => ({
        method: r.method,
        count: Number(r.count),
        revenue: parseFloat(r.revenue ?? "0"),
      })),
    },
  })
}
