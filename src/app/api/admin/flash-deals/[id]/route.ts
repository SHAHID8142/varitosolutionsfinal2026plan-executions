/**
 * @file api/admin/flash-deals/[id]/route.ts
 * @description Admin: get, update, or deactivate a single flash deal.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-24
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { flashDeals, products } from "@/db/schema"
import { and, eq, ne, lte, sql } from "drizzle-orm"
import { requireAdmin, isAuthError, auditLog } from "@/lib/admin-auth"

// ─────────────────────────────────────────────
// GET /api/admin/flash-deals/[id]
// ─────────────────────────────────────────────

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  const { id } = await params
  const dealId = parseInt(id, 10)
  if (isNaN(dealId)) {
    return NextResponse.json({ error: "Invalid deal ID", code: "INVALID_ID" }, { status: 400 })
  }

  const [deal] = await db
    .select({
      id: flashDeals.id,
      productId: flashDeals.productId,
      flashPrice: flashDeals.flashPrice,
      maxQty: flashDeals.maxQty,
      soldQty: flashDeals.soldQty,
      isActive: flashDeals.isActive,
      startsAt: flashDeals.startsAt,
      endsAt: flashDeals.endsAt,
      createdAt: flashDeals.createdAt,
      product: {
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        images: products.images,
      },
    })
    .from(flashDeals)
    .innerJoin(products, eq(flashDeals.productId, products.id))
    .where(eq(flashDeals.id, dealId))
    .limit(1)

  if (!deal) {
    return NextResponse.json({ error: "Flash deal not found", code: "NOT_FOUND" }, { status: 404 })
  }

  return NextResponse.json({
    data: {
      id: deal.id,
      productId: String(deal.productId),
      flashPrice: String(parseFloat(deal.flashPrice)),
      maxQty: deal.maxQty ? String(deal.maxQty) : "",
      soldQty: deal.soldQty,
      isActive: deal.isActive,
      startsAt: deal.startsAt.toISOString().slice(0, 16),
      endsAt: deal.endsAt.toISOString().slice(0, 16),
      createdAt: deal.createdAt.toISOString(),
      product: {
        id: String(deal.product.id),
        name: deal.product.name,
        slug: deal.product.slug,
        price: parseFloat(deal.product.price),
        images: deal.product.images ?? [],
      },
    },
  })
}

const updateSchema = z.object({
  flashPrice: z.number().positive().optional(),
  maxQty: z.number().int().positive().optional().nullable(),
  isActive: z.boolean().optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  const { id } = await params
  const dealId = parseInt(id, 10)
  if (isNaN(dealId)) {
    return NextResponse.json({ error: "Invalid deal ID", code: "VALIDATION_ERROR" }, { status: 400 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body", code: "INVALID_BODY" }, { status: 400 })
  }

  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
      { status: 400 }
    )
  }

  const [deal] = await db
    .select({ id: flashDeals.id, productId: flashDeals.productId })
    .from(flashDeals)
    .where(eq(flashDeals.id, dealId))

  if (!deal) {
    return NextResponse.json({ error: "Flash deal not found", code: "NOT_FOUND" }, { status: 404 })
  }

  const updates = parsed.data

  if (updates.flashPrice !== undefined) {
    const [product] = await db
      .select({ price: products.price })
      .from(products)
      .where(eq(products.id, deal.productId))
    if (product && updates.flashPrice >= parseFloat(product.price)) {
      return NextResponse.json(
        { error: "Flash price must be less than the regular product price", code: "VALIDATION_ERROR" },
        { status: 400 }
      )
    }
  }

  const startsAt = updates.startsAt ? new Date(updates.startsAt) : undefined
  const endsAt = updates.endsAt ? new Date(updates.endsAt) : undefined

  if (startsAt && endsAt && endsAt <= startsAt) {
    return NextResponse.json(
      { error: "End time must be after start time", code: "VALIDATION_ERROR" },
      { status: 400 }
    )
  }

  // Overlap check when updating times
  if ((startsAt || endsAt) && updates.isActive !== false) {
    const [overlap] = await db
      .select({ id: flashDeals.id })
      .from(flashDeals)
      .where(
        and(
          eq(flashDeals.isActive, true),
          ne(flashDeals.id, dealId),
          lte(flashDeals.startsAt, endsAt ?? sql`NOW()`),
          sql`${flashDeals.endsAt} > ${startsAt ?? sql`NOW()`}`
        )
      )
      .limit(1)

    if (overlap) {
      return NextResponse.json(
        { error: "Another active flash deal overlaps with this time range", code: "CONFLICT" },
        { status: 409 }
      )
    }
  }

  await db
    .update(flashDeals)
    .set({
      ...(updates.flashPrice !== undefined && { flashPrice: String(updates.flashPrice) }),
      ...(updates.maxQty !== undefined && { maxQty: updates.maxQty }),
      ...(updates.isActive !== undefined && { isActive: updates.isActive }),
      ...(startsAt && { startsAt }),
      ...(endsAt && { endsAt }),
      updatedAt: new Date(),
    })
    .where(eq(flashDeals.id, dealId))

  auditLog(admin, request, "update_flash_deal", "flash_deal", String(dealId), { after: updates })

  return NextResponse.json({ data: { success: true } })
}
