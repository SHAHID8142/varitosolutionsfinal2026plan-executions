/**
 * @file api/products/route.ts
 * @description Public product listing API. Supports pagination, filtering, and search.
 *              Never exposes cost_price. Uses cursor-based pagination for performance.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { products, categories } from "@/db/schema"
import { and, eq, gte, lte, ilike, or, lt, gt, desc, asc, isNull, count } from "drizzle-orm"
import { z } from "zod"
import { publicApiRatelimit, getClientIp } from "@/lib/ratelimit"

// ─────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────

const querySchema = z.object({
  category: z.string().optional(),
  search: z.string().max(100).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sort: z.enum(["price_asc", "price_desc", "newest", "popular"]).optional().default("newest"),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).optional().default(20),
})

// ─────────────────────────────────────────────
// HANDLER
// ─────────────────────────────────────────────

export async function GET(request: Request) {
  // Rate limit
  const ip = getClientIp(request)
  const { success } = await publicApiRatelimit.limit(ip)
  if (!success) {
    return NextResponse.json({ error: "Too many requests", code: "RATE_LIMITED" }, { status: 429 })
  }

  // Parse + validate query params
  const url = new URL(request.url)
  const rawParams = Object.fromEntries(url.searchParams.entries())
  const parsed = querySchema.safeParse(rawParams)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", code: "VALIDATION_ERROR" },
      { status: 400 }
    )
  }

  const { category, search, minPrice, maxPrice, sort, cursor, limit } = parsed.data

  // Build where conditions
  const conditions = [
    isNull(products.deletedAt),
    eq(products.isActive, true),
  ]

  if (search) {
    conditions.push(
      or(
        ilike(products.name, `%${search}%`),
        ilike(products.nameBn, `%${search}%`)
      )!
    )
  }

  if (minPrice !== undefined) {
    conditions.push(gte(products.salePrice ?? products.price, String(minPrice)))
  }

  if (maxPrice !== undefined) {
    conditions.push(lte(products.salePrice ?? products.price, String(maxPrice)))
  }

  // Category filter — join on slug
  let categoryId: number | undefined
  if (category) {
    const cat = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, category))
      .limit(1)
    if (cat.length === 0) {
      return NextResponse.json({ data: [], nextCursor: null, total: 0 })
    }
    categoryId = cat[0].id
    conditions.push(eq(products.categoryId, categoryId))
  }

  // Cursor-based pagination
  if (cursor) {
    // cursor = base64(id)
    const decodedId = parseInt(Buffer.from(cursor, "base64").toString("utf8"), 10)
    if (!isNaN(decodedId)) {
      if (sort === "price_asc") {
        conditions.push(gt(products.id, decodedId))
      } else {
        conditions.push(lt(products.id, decodedId))
      }
    }
  }

  // Order by
  const orderBy =
    sort === "price_asc"
      ? asc(products.price)
      : sort === "price_desc"
        ? desc(products.price)
        : desc(products.id) // newest + popular fallback

  const where = and(...conditions)

  // Fetch page + one extra to detect next page
  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      nameBn: products.nameBn,
      price: products.price,
      salePrice: products.salePrice,
      images: products.images,
      stock: products.stock,
      createdAt: products.createdAt,
      categoryId: products.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(where)
    .orderBy(orderBy)
    .limit(limit + 1)

  const hasMore = rows.length > limit
  const page = hasMore ? rows.slice(0, limit) : rows

  const nextCursor = hasMore
    ? Buffer.from(String(page[page.length - 1].id)).toString("base64")
    : null

  // Total count (no cursor filter for accurate total)
  const totalConditions = [isNull(products.deletedAt), eq(products.isActive, true)]
  if (categoryId !== undefined) totalConditions.push(eq(products.categoryId, categoryId))
  if (search) {
    totalConditions.push(
      or(ilike(products.name, `%${search}%`), ilike(products.nameBn, `%${search}%`))!
    )
  }
  const [{ value: total }] = await db
    .select({ value: count() })
    .from(products)
    .where(and(...totalConditions))

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const data = page.map((row) => {
    const price = parseFloat(row.price)
    const salePrice = row.salePrice ? parseFloat(row.salePrice) : null
    const discountPercent =
      salePrice !== null ? Math.round(((price - salePrice) / price) * 100) : null

    return {
      id: String(row.id),
      slug: row.slug,
      name: row.name,
      nameBn: row.nameBn ?? "",
      price,
      salePrice,
      images: row.images ?? [],
      stock: row.stock,
      category: {
        id: String(row.categoryId ?? ""),
        name: row.categoryName ?? "",
        slug: row.categorySlug ?? "",
      },
      isNew: row.createdAt ? row.createdAt > sevenDaysAgo : false,
      discountPercent,
    }
  })

  return NextResponse.json({ data, nextCursor, total })
}
