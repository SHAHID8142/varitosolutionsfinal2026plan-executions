/**
 * @file api/admin/analytics/products/route.ts
 * @description Admin: top-selling products by quantity and revenue.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orderItems } from "@/db/schema"
import { desc, sql, sum } from "drizzle-orm"
import { requireAdmin, isAuthError } from "@/lib/admin-auth"

export async function GET(request: Request) {
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  const topProducts = await db
    .select({
      productId: orderItems.productId,
      name: orderItems.productName,
      totalQty: sql<number>`SUM(${orderItems.qty})`.as("total_qty"),
      totalRevenue: sum(orderItems.total).as("total_revenue"),
    })
    .from(orderItems)
    .groupBy(orderItems.productId, orderItems.productName)
    .orderBy(desc(sql`SUM(${orderItems.qty})`))
    .limit(20)

  return NextResponse.json({
    data: topProducts.map((p) => ({
      productId: String(p.productId),
      name: p.name,
      totalQty: Number(p.totalQty),
      totalRevenue: parseFloat(String(p.totalRevenue ?? 0)),
    })),
  })
}
