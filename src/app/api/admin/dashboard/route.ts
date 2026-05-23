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
import { orders, products } from "@/db/schema"
import { and, count, desc, eq, gte, isNull, lt, lte, sum } from "drizzle-orm"
import { requireAdmin, isAuthError } from "@/lib/admin-auth"

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

  const [
    todayStats,
    thisWeekStats,
    lastWeekStats,
    monthStats,
    pendingStats,
    lowStockProducts,
    recentOrders,
  ] = await Promise.all([
    db
      .select({ count: count(), revenue: sum(orders.total) })
      .from(orders)
      .where(gte(orders.createdAt, todayStart)),

    db
      .select({ count: count(), revenue: sum(orders.total) })
      .from(orders)
      .where(and(gte(orders.createdAt, weekStart), lt(orders.createdAt, now))),

    db
      .select({ count: count(), revenue: sum(orders.total) })
      .from(orders)
      .where(and(gte(orders.createdAt, lastWeekStart), lt(orders.createdAt, weekStart))),

    db
      .select({ revenue: sum(orders.total) })
      .from(orders)
      .where(gte(orders.createdAt, monthStart)),

    db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, "pending")),

    db
      .select({ id: products.id, name: products.name, stock: products.stock, slug: products.slug })
      .from(products)
      .where(and(isNull(products.deletedAt), eq(products.isActive, true), lte(products.stock, 10)))
      .orderBy(products.stock)
      .limit(10),

    db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        status: orders.status,
        paymentStatus: orders.paymentStatus,
        total: orders.total,
        customerName: orders.customerName,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(10),
  ])

  const thisWeekRevenue = parseFloat(String(thisWeekStats[0].revenue ?? 0))
  const lastWeekRevenue = parseFloat(String(lastWeekStats[0].revenue ?? 0))
  const weekChangePercent =
    lastWeekRevenue === 0
      ? 100
      : Math.round(((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100)

  return NextResponse.json({
    data: {
      today: {
        orders: Number(todayStats[0].count),
        revenue: parseFloat(String(todayStats[0].revenue ?? 0)),
      },
      thisWeek: {
        orders: Number(thisWeekStats[0].count),
        revenue: thisWeekRevenue,
        changePercent: weekChangePercent,
      },
      thisMonth: {
        revenue: parseFloat(String(monthStats[0].revenue ?? 0)),
      },
      pendingOrders: Number(pendingStats[0].count),
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
        customerName: o.customerName,
        createdAt: o.createdAt.toISOString(),
      })),
    },
  })
}
