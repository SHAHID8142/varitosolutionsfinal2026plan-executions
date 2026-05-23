/**
 * @file api/admin/products/route.ts
 * @description Admin: list all products (including inactive/deleted) and create new products.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { products, categories } from "@/db/schema"
import { and, asc, count, desc, eq, ilike, isNull, lt, or } from "drizzle-orm"
import { requireAdmin, isAuthError, auditLog } from "@/lib/admin-auth"

// ─────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────

const listQuerySchema = z.object({
  search: z.string().max(100).optional(),
  categoryId: z.coerce.number().int().optional(),
  status: z.enum(["active", "inactive", "all"]).default("all"),
  sort: z.enum(["newest", "oldest", "name_asc", "stock_asc"]).default("newest"),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(25),
})

const createSchema = z.object({
  name: z.string().min(2).max(200),
  nameBn: z.string().max(200).optional(),
  slug: z
    .string()
    .min(2)
    .max(220)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().max(5000).optional(),
  descriptionBn: z.string().max(5000).optional(),
  price: z.number().positive(),
  salePrice: z.number().positive().optional().nullable(),
  costPrice: z.number().positive().optional(),
  stock: z.number().int().min(0).default(0),
  unit: z.string().max(50).default("piece"),
  minOrderQty: z.number().int().min(1).default(1),
  sku: z.string().max(100).optional(),
  categoryId: z.number().int().positive(),
  images: z.array(z.string().url()).max(10).default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
})

// ─────────────────────────────────────────────
// HANDLERS
// ─────────────────────────────────────────────

export async function GET(request: Request) {
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  const url = new URL(request.url)
  const parsed = listQuerySchema.safeParse(Object.fromEntries(url.searchParams))
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
      { status: 400 }
    )
  }

  const { search, categoryId, status, sort, cursor, limit } = parsed.data
  const conditions = []

  // Admin can see deleted (soft-deleted) — filter by status
  if (status === "active") {
    conditions.push(isNull(products.deletedAt), eq(products.isActive, true))
  } else if (status === "inactive") {
    conditions.push(isNull(products.deletedAt), eq(products.isActive, false))
  }
  // "all" shows everything including soft-deleted

  if (search) {
    conditions.push(
      or(ilike(products.name, `%${search}%`), ilike(products.sku, `%${search}%`))!
    )
  }
  if (categoryId) conditions.push(eq(products.categoryId, categoryId))

  if (cursor) {
    const decodedId = parseInt(Buffer.from(cursor, "base64").toString("utf8"), 10)
    if (!isNaN(decodedId)) conditions.push(lt(products.id, decodedId))
  }

  const orderBy =
    sort === "name_asc"
      ? asc(products.name)
      : sort === "stock_asc"
        ? asc(products.stock)
        : sort === "oldest"
          ? asc(products.id)
          : desc(products.id)

  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      price: products.price,
      salePrice: products.salePrice,
      costPrice: products.costPrice,
      stock: products.stock,
      isActive: products.isActive,
      isFeatured: products.isFeatured,
      images: products.images,
      categoryId: products.categoryId,
      categoryName: categories.name,
      deletedAt: products.deletedAt,
      createdAt: products.createdAt,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(orderBy)
    .limit(limit + 1)

  const hasMore = rows.length > limit
  const page = hasMore ? rows.slice(0, limit) : rows
  const nextCursor = hasMore
    ? Buffer.from(String(page[page.length - 1].id)).toString("base64")
    : null

  const [{ value: total }] = await db.select({ value: count() }).from(products)

  return NextResponse.json({
    data: page.map((p) => ({
      id: String(p.id),
      slug: p.slug,
      name: p.name,
      price: parseFloat(p.price),
      salePrice: p.salePrice ? parseFloat(p.salePrice) : null,
      costPrice: p.costPrice ? parseFloat(p.costPrice) : null,
      stock: p.stock,
      isActive: p.isActive,
      isFeatured: p.isFeatured,
      images: p.images ?? [],
      category: { id: String(p.categoryId ?? ""), name: p.categoryName ?? "" },
      isDeleted: !!p.deletedAt,
      createdAt: p.createdAt?.toISOString(),
    })),
    nextCursor,
    total,
  })
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body", code: "INVALID_BODY" }, { status: 400 })
  }

  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
      { status: 400 }
    )
  }

  const data = parsed.data

  const [product] = await db
    .insert(products)
    .values({
      name: data.name,
      nameBn: data.nameBn ?? null,
      slug: data.slug,
      description: data.description ?? null,
      descriptionBn: data.descriptionBn ?? null,
      price: String(data.price),
      salePrice: data.salePrice ? String(data.salePrice) : null,
      costPrice: data.costPrice ? String(data.costPrice) : null,
      stock: data.stock,
      unit: data.unit,
      minOrderQty: data.minOrderQty,
      sku: data.sku ?? null,
      categoryId: data.categoryId,
      images: data.images,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
    })
    .returning({ id: products.id, slug: products.slug })

  auditLog(admin, request, "create_product", "product", String(product.id), { name: data.name })

  return NextResponse.json({ data: { id: String(product.id), slug: product.slug } }, { status: 201 })
}
