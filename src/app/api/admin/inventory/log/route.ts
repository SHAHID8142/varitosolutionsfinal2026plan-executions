/**
 * @file api/admin/inventory/log/route.ts
 * @description Admin: paginated inventory adjustment log.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { inventoryLog, products, users } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import { requireAdmin, isAuthError } from "@/lib/admin-auth"

const querySchema = z.object({
  productId: z.coerce.number().int().optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
})

export async function GET(request: Request) {
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  const url = new URL(request.url)
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams))
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid parameters", code: "VALIDATION_ERROR" }, { status: 400 })
  }

  const baseQuery = db
    .select({
      id: inventoryLog.id,
      type: inventoryLog.type,
      quantity: inventoryLog.quantity,
      before: inventoryLog.before,
      after: inventoryLog.after,
      reason: inventoryLog.reason,
      productName: products.name,
      adminName: users.name,
      createdAt: inventoryLog.createdAt,
    })
    .from(inventoryLog)
    .leftJoin(products, eq(inventoryLog.productId, products.id))
    .leftJoin(users, eq(inventoryLog.changedBy, users.id))
    .orderBy(desc(inventoryLog.createdAt))
    .limit(parsed.data.limit)

  const rows = parsed.data.productId
    ? await baseQuery.where(eq(inventoryLog.productId, parsed.data.productId))
    : await baseQuery

  return NextResponse.json({
    data: rows.map((r) => ({
      id: String(r.id),
      type: r.type,
      quantity: r.quantity,
      before: r.before,
      after: r.after,
      reason: r.reason,
      productName: r.productName ?? "",
      adminName: r.adminName ?? "System",
      createdAt: r.createdAt.toISOString(),
    })),
  })
}
