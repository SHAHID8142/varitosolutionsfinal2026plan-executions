/**
 * @file api/admin/flash-deals/route.ts
 * @description Admin: list all flash deals and create new ones.
 *              Only one deal can be active at a time — overlap validation enforced.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { flashDeals, products } from "@/db/schema"
import { and, desc, eq, isNull, lte, sql } from "drizzle-orm"
import { requireAdmin, isAuthError, auditLog } from "@/lib/admin-auth"

// ─────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────

const createSchema = z.object({
  productId: z.number().int().positive(),
  flashPrice: z.number().positive(),
  maxQty: z.number().int().positive().optional().nullable(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
})

// ─────────────────────────────────────────────
// HANDLERS
// ─────────────────────────────────────────────

export async function GET(request: Request) {
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  const rows = await db
    .select({
      id: flashDeals.id,
      flashPrice: flashDeals.flashPrice,
      maxQty: flashDeals.maxQty,
      soldQty: flashDeals.soldQty,
      isActive: flashDeals.isActive,
      startsAt: flashDeals.startsAt,
      endsAt: flashDeals.endsAt,
      createdAt: flashDeals.createdAt,
      product: {
        id: products.id,
        slug: products.slug,
        name: products.name,
        price: products.price,
        images: products.images,
      },
    })
    .from(flashDeals)
    .innerJoin(products, eq(flashDeals.productId, products.id))
    .orderBy(desc(flashDeals.createdAt))

  const now = new Date()

  return NextResponse.json({
    data: rows.map((d) => ({
      id: d.id,
      flashPrice: parseFloat(d.flashPrice),
      maxQty: d.maxQty,
      soldQty: d.soldQty,
      isActive: d.isActive,
      startsAt: d.startsAt.toISOString(),
      endsAt: d.endsAt.toISOString(),
      createdAt: d.createdAt.toISOString(),
      status: !d.isActive
        ? "deactivated"
        : d.endsAt < now
          ? "expired"
          : d.startsAt > now
            ? "scheduled"
            : "active",
      product: {
        id: String(d.product.id),
        slug: d.product.slug,
        name: d.product.name,
        price: parseFloat(d.product.price),
        image: d.product.images?.[0] ?? null,
      },
    })),
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

  const { productId, flashPrice, maxQty, startsAt: startsAtStr, endsAt: endsAtStr } = parsed.data
  const startsAt = new Date(startsAtStr)
  const endsAt = new Date(endsAtStr)

  if (endsAt <= startsAt) {
    return NextResponse.json(
      { error: "End time must be after start time", code: "VALIDATION_ERROR" },
      { status: 400 }
    )
  }

  // Validate product exists and flash price < product price
  const [product] = await db
    .select({ price: products.price, isActive: products.isActive, deletedAt: products.deletedAt })
    .from(products)
    .where(eq(products.id, productId))

  if (!product || product.deletedAt || !product.isActive) {
    return NextResponse.json(
      { error: "Product not found or inactive", code: "NOT_FOUND" },
      { status: 404 }
    )
  }

  if (flashPrice >= parseFloat(product.price)) {
    return NextResponse.json(
      { error: "Flash price must be less than the regular product price", code: "VALIDATION_ERROR" },
      { status: 400 }
    )
  }

  // Check for time overlap with existing active deals
  const [overlap] = await db
    .select({ id: flashDeals.id })
    .from(flashDeals)
    .where(
      and(
        eq(flashDeals.isActive, true),
        // New deal overlaps if it starts before existing ends AND ends after existing starts
        lte(flashDeals.startsAt, endsAt),
        sql`${flashDeals.endsAt} > ${startsAt}`
      )
    )
    .limit(1)

  if (overlap) {
    return NextResponse.json(
      { error: "An active flash deal already overlaps with this time range", code: "CONFLICT" },
      { status: 409 }
    )
  }

  const [deal] = await db
    .insert(flashDeals)
    .values({
      productId,
      flashPrice: String(flashPrice),
      maxQty: maxQty ?? null,
      startsAt,
      endsAt,
      createdBy: admin.userId,
    })
    .returning({ id: flashDeals.id })

  auditLog(admin, request, "create_flash_deal", "flash_deal", String(deal.id), {
    after: { productId, flashPrice },
  })

  return NextResponse.json({ data: { id: deal.id } }, { status: 201 })
}
