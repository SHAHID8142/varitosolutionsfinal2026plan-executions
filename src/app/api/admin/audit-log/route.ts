/**
 * @file api/admin/audit-log/route.ts
 * @description Admin (super_admin): paginated audit log for all admin actions.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { auditLog, users } from "@/db/schema"
import { and, desc, eq, gte, lt, lte } from "drizzle-orm"
import { requireAdmin, isAuthError } from "@/lib/admin-auth"

const querySchema = z.object({
  adminId: z.string().uuid().optional(),
  action: z.string().max(100).optional(),
  entityType: z.string().max(50).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
})

export async function GET(request: Request) {
  const admin = await requireAdmin(request, { role: "super_admin" })
  if (isAuthError(admin)) return admin

  const url = new URL(request.url)
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams))
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid parameters", code: "VALIDATION_ERROR" }, { status: 400 })
  }

  const { adminId, action, entityType, dateFrom, dateTo, cursor, limit } = parsed.data
  const conditions = []

  if (adminId) conditions.push(eq(auditLog.adminId, adminId))
  if (action) conditions.push(eq(auditLog.action, action))
  if (entityType) conditions.push(eq(auditLog.entityType, entityType))
  if (dateFrom) {
    const from = new Date(dateFrom)
    if (!isNaN(from.getTime())) conditions.push(gte(auditLog.createdAt, from))
  }
  if (dateTo) {
    const to = new Date(dateTo)
    if (!isNaN(to.getTime())) conditions.push(lte(auditLog.createdAt, to))
  }
  if (cursor) {
    const decodedId = parseInt(Buffer.from(cursor, "base64").toString("utf8"), 10)
    if (!isNaN(decodedId)) conditions.push(lt(auditLog.id, decodedId))
  }

  const rows = await db
    .select({
      id: auditLog.id,
      action: auditLog.action,
      entityType: auditLog.entityType,
      entityId: auditLog.entityId,
      changes: auditLog.changes,
      ipAddress: auditLog.ipAddress,
      adminName: users.name,
      adminPhone: users.phone,
      createdAt: auditLog.createdAt,
    })
    .from(auditLog)
    .leftJoin(users, eq(auditLog.adminId, users.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(auditLog.id))
    .limit(limit + 1)

  const hasMore = rows.length > limit
  const page = hasMore ? rows.slice(0, limit) : rows
  const nextCursor = hasMore
    ? Buffer.from(String(page[page.length - 1].id)).toString("base64")
    : null

  return NextResponse.json({
    data: page.map((r) => ({
      id: String(r.id),
      action: r.action,
      entityType: r.entityType,
      entityId: r.entityId,
      changes: r.changes,
      ipAddress: r.ipAddress,
      admin: { name: r.adminName ?? "Unknown", phone: r.adminPhone ?? "" },
      createdAt: r.createdAt.toISOString(),
    })),
    nextCursor,
  })
}
