/**
 * @file api/products/[slug]/route.ts
 * @description Public single-product API. Returns full product detail by slug.
 *              Never exposes cost_price in the response.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { products, categories } from "@/db/schema"
import { and, eq, isNull } from "drizzle-orm"
import { publicApiRatelimit, getClientIp } from "@/lib/ratelimit"

// ─────────────────────────────────────────────
// HANDLER
// ─────────────────────────────────────────────

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const ip = getClientIp(request)
  const { success } = await publicApiRatelimit.limit(ip)
  if (!success) {
    return NextResponse.json({ error: "Too many requests", code: "RATE_LIMITED" }, { status: 429 })
  }

  const { slug } = await params

  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      nameBn: products.nameBn,
      description: products.description,
      descriptionBn: products.descriptionBn,
      price: products.price,
      salePrice: products.salePrice,
      images: products.images,
      stock: products.stock,
      unit: products.unit,
      minOrderQty: products.minOrderQty,
      sku: products.sku,
      isActive: products.isActive,
      categoryId: products.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
      categoryNameBn: categories.nameBn,
      categoryParentId: categories.parentId,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.slug, slug), isNull(products.deletedAt), eq(products.isActive, true)))
    .limit(1)

  if (rows.length === 0) {
    return NextResponse.json({ error: "Product not found", code: "NOT_FOUND" }, { status: 404 })
  }

  const row = rows[0]
  const price = parseFloat(row.price)
  const salePrice = row.salePrice ? parseFloat(row.salePrice) : null
  const discountPercent =
    salePrice !== null ? Math.round(((price - salePrice) / price) * 100) : null

  const data = {
    id: String(row.id),
    slug: row.slug,
    name: row.name,
    nameBn: row.nameBn ?? "",
    description: row.description ?? "",
    descriptionBn: row.descriptionBn ?? "",
    price,
    salePrice,
    discountPercent,
    images: row.images ?? [],
    stock: row.stock,
    unit: row.unit,
    minOrderQty: row.minOrderQty,
    sku: row.sku ?? "",
    category: {
      id: String(row.categoryId ?? ""),
      name: row.categoryName ?? "",
      slug: row.categorySlug ?? "",
    },
  }

  return NextResponse.json({ data })
}
