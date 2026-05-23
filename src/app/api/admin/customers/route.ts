/**
 * @file api/admin/customers/route.ts
 * @description Admin: list customers with search and pagination.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { users } from "@/db/schema"
import { and, count, desc, eq, ilike, or } from "drizzle-orm"
import { requireAdmin, isAuthError } from "@/lib/admin-auth"

const querySchema = z.object({
  search: z.string().max(100).optional(),
  status: z.enum(["active", "banned", "all"]).default("all"),
  limit: z.coerce.number().min(1).max(100).default(25),
  cursor: z.string().optional(),
})

export async function GET(request: Request) {
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  const url = new URL(request.url)
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams))
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
      { status: 400 }
    )
  }

  const { search, status, limit } = parsed.data
  const conditions = [eq(users.role, "customer")]

  if (status === "banned") conditions.push(eq(users.isBanned, true))
  if (status === "active") conditions.push(eq(users.isBanned, false))

  if (search) {
    conditions.push(
      or(ilike(users.phone, `%${search}%`), ilike(users.name, `%${search}%`))!
    )
  }

  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      phone: users.phone,
      email: users.email,
      isBanned: users.isBanned,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(and(...conditions))
    .orderBy(desc(users.createdAt))
    .limit(limit)

  const [{ value: total }] = await db
    .select({ value: count() })
    .from(users)
    .where(eq(users.role, "customer"))

  return NextResponse.json({
    data: rows.map((u) => ({
      id: u.id,
      name: u.name,
      phone: u.phone,
      email: u.email,
      isBanned: u.isBanned,
      createdAt: u.createdAt.toISOString(),
    })),
    total,
  })
}
