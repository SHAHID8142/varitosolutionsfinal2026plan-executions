/**
 * @file api/admin/dashboard/route.ts
 * @description Admin dashboard stats: today's orders, revenue, pending count,
 *              low stock alerts, and recent orders for at-a-glance overview.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders, products, orderItems } from "@/db/schema"
import { and, eq, gte, lt, lte, isNull, count, sum, desc } from "drizzle-orm"
import { requireAdmin, isAuthError } from "@/lib/admin-auth"

// ─────────────────────────────────────────────
// HANDLER
// ─────────────────────────────────────────────

export async function GET(request: Request) {
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(todayStart)
  weekStart.setDate(weekStart.getDate() - 7)
  const lastWeekStart = new Date(weekStart)
  lastWeekStart.setDate(lastWeekStart.getDate() - 7)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  // Parallel queries for performance
  const [
    todayOrders,
    thisWeekOrders,
    lastWeekOrders,
    thisMonthRevenue,
    pendingOrders,
    lowStockProducts,
    recentOrders,
  ] = await Promise.all([
    // Today orders + revenue
    db
      .select({ count: count(), revenue: sum(orders.total) })
      .from(orders)
      .where(and(gte(orders.createdAt, todayStart), isNull(orders.deletedAt))),

    // This week
    db
      .select({ count: count(), revenue: sum(orders.total) })
      .from(orders)
      .where(
        and(
          gte(orders.createdAt, weekStart),
          lt(orders.createdAt, now),
          isNull(orders.deletedAt)
        )
      ),

    // Last week (for % change)
    db
      .select({ count: count(), revenue: sum(orders.total) })
      .from(orders)
      .where(
        and(
          gte(orders.createdAt, lastWeekStart),
          lt(orders.createdAt, weekStart),
          isNull(orders.deletedAt)
        )
      ),

    // This month revenue
    db
      .select({ revenue: sum(orders.total) })
      .from(orders)
      .where(and(gte(orders.createdAt, monthStart), isNull(orders.deletedAt))),

    // Pending orders
    db
      .select({ count: count() })
      .from(orders)
      .where(and(eq(orders.status, "pending"), isNull(orders.deletedAt))),

    // Low stock (< 10 units)
    db
      .select({ id: products.id, name: products.name, stock: products.stock, slug: products.slug })
      .from(products)
      .where(and(lte(products.stock, 10), isNull(products.deletedAt), eq(products.isActive, true)))
      .orderBy(products.stock)
      .limit(10),

    // Recent 10 orders
    db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        status: orders.status,
        paymentStatus: orders.paymentStatus,
        total: orders.total,
        shippingName: orders.shippingName,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .where(isNull(orders.deletedAt))
      .orderBy(desc(orders.createdAt))
      .limit(10),
  ])

  const thisWeekRevenue = parseFloat(String(thisWeekOrders[0].revenue ?? 0))
  const lastWeekRevenue = parseFloat(String(lastWeekOrders[0].revenue ?? 0))
  const weekChangePercent =
    lastWeekRevenue === 0
      ? 100
      : Math.round(((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100)

  return NextResponse.json({
    data: {
      today: {
        orders: Number(todayOrders[0].count),
        revenue: parseFloat(String(todayOrders[0].revenue ?? 0)),
      },
      thisWeek: {
        orders: Number(thisWeekOrders[0].count),
        revenue: thisWeekRevenue,
        changePercent: weekChangePercent,
      },
      thisMonth: {
        revenue: parseFloat(String(thisMonthRevenue[0].revenue ?? 0)),
      },
      pendingOrders: Number(pendingOrders[0].count),
      lowStockAlerts: lowStockProducts.map((p) => ({
        id: String(p.id),
        name: p.name,
        stock: p.stock,
        slug: p.slug,
      })),
      recentOrders: recentOrders.map((o) => ({
        id: String(o.id),
        orderNumber: o.orderNumber,
        status: o.status,
        paymentStatus: o.paymentStatus,
        total: parseFloat(o.total),
        customerName: o.shippingName,
        createdAt: o.createdAt?.toISOString(),
      })),
    },
  })
}
