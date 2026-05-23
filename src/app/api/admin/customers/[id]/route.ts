/**
 * @file api/admin/customers/[id]/route.ts
 * @description Admin: get single customer with order history.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, orders } from "@/db/schema"
import { count, desc, eq, sum } from "drizzle-orm"
import { requireAdmin, isAuthError } from "@/lib/admin-auth"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  const { id } = await params

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1)

  if (!user || user.role !== "customer") {
    return NextResponse.json({ error: "Customer not found", code: "NOT_FOUND" }, { status: 404 })
  }

  const [stats] = await db
    .select({ orderCount: count(), totalSpent: sum(orders.total) })
    .from(orders)
    .where(eq(orders.userId, id))

  const recentOrders = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      total: orders.total,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.userId, id))
    .orderBy(desc(orders.createdAt))
    .limit(10)

  return NextResponse.json({
    data: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      isBanned: user.isBanned,
      banReason: user.banReason,
      createdAt: user.createdAt.toISOString(),
      stats: {
        orderCount: Number(stats.orderCount),
        totalSpent: parseFloat(String(stats.totalSpent ?? 0)),
      },
      recentOrders: recentOrders.map((o) => ({
        id: String(o.id),
        orderNumber: o.orderNumber,
        status: o.status,
        total: parseFloat(o.total),
        createdAt: o.createdAt.toISOString(),
      })),
    },
  })
}
