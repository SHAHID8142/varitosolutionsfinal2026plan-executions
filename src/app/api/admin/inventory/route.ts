/**
 * @file api/admin/inventory/route.ts
 * @description Admin: inventory overview — all products with current stock levels.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { products, categories } from "@/db/schema"
import { and, asc, desc, eq, isNull, lte, sql } from "drizzle-orm"
import { requireAdmin, isAuthError } from "@/lib/admin-auth"

// ─────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────

const querySchema = z.object({
  filter: z.enum(["all", "low", "out"]).default("all"),
  sort: z.enum(["stock_asc", "stock_desc", "name_asc"]).default("stock_asc"),
  limit: z.coerce.number().min(1).max(200).default(50),
})

// ─────────────────────────────────────────────
// HANDLER
// ─────────────────────────────────────────────

export async function GET(request: Request) {
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  const url = new URL(request.url)
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams))
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid parameters", code: "VALIDATION_ERROR" }, { status: 400 })
  }

  const { filter, sort, limit } = parsed.data
  const conditions = [isNull(products.deletedAt)]

  if (filter === "low") {
    conditions.push(sql`${products.stock} > 0 AND ${products.stock} <= 10`)
  } else if (filter === "out") {
    conditions.push(lte(products.stock, 0))
  }

  const orderBy =
    sort === "name_asc"
      ? asc(products.name)
      : sort === "stock_desc"
        ? desc(products.stock)
        : asc(products.stock)

  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      sku: products.sku,
      stock: products.stock,
      isActive: products.isActive,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(orderBy)
    .limit(limit)

  return NextResponse.json({
    data: rows.map((p) => ({
      id: String(p.id),
      name: p.name,
      sku: p.sku,
      stock: p.stock,
      isActive: p.isActive,
      category: p.categoryName ?? "",
      stockStatus: p.stock === 0 ? "out" : p.stock <= 10 ? "low" : "ok",
    })),
  })
}
