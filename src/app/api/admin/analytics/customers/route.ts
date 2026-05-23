/**
 * @file api/admin/analytics/customers/route.ts
 * @description Admin: customer growth (new registrations by day).
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { users } from "@/db/schema"
import { and, eq, gte, lte, sql, count } from "drizzle-orm"
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
      date: sql<string>`DATE(${users.createdAt})`.as("date"),
      newCustomers: count(),
    })
    .from(users)
    .where(and(eq(users.role, "customer"), gte(users.createdAt, from), lte(users.createdAt, to)))
    .groupBy(sql`DATE(${users.createdAt})`)
    .orderBy(sql`DATE(${users.createdAt})`)

  return NextResponse.json({
    data: rows.map((r) => ({ date: r.date, newCustomers: Number(r.newCustomers) })),
  })
}
