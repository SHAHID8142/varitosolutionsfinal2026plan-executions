/**
 * @file api/admin/analytics/inventory/route.ts
 * @description Admin: inventory health — stock levels, low/out-of-stock counts.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { products } from "@/db/schema"
import { and, count, eq, isNull, lte, sql, sum } from "drizzle-orm"
import { requireAdmin, isAuthError } from "@/lib/admin-auth"

export async function GET(request: Request) {
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  const [totals, lowStock, outOfStock] = await Promise.all([
    db
      .select({ count: count(), totalStock: sum(products.stock) })
      .from(products)
      .where(and(isNull(products.deletedAt), eq(products.isActive, true))),

    db
      .select({ count: count() })
      .from(products)
      .where(
        and(
          isNull(products.deletedAt),
          eq(products.isActive, true),
          sql`${products.stock} > 0 AND ${products.stock} <= 10`
        )
      ),

    db
      .select({ count: count() })
      .from(products)
      .where(
        and(isNull(products.deletedAt), eq(products.isActive, true), lte(products.stock, 0))
      ),
  ])

  return NextResponse.json({
    data: {
      totalProducts: Number(totals[0].count),
      totalStock: Number(totals[0].totalStock ?? 0),
      lowStockCount: Number(lowStock[0].count),
      outOfStockCount: Number(outOfStock[0].count),
    },
  })
}
