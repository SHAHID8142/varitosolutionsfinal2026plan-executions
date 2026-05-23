/**
 * @file api/flash-deal/route.ts
 * @description Public: returns the currently active flash deal, or null if none.
 *              One deal at a time — returns the one that started most recently.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { flashDeals, products, categories } from "@/db/schema"
import { and, desc, eq, isNull, lte, sql } from "drizzle-orm"

export async function GET() {
  const now = new Date()

  const [deal] = await db
    .select({
      id: flashDeals.id,
      flashPrice: flashDeals.flashPrice,
      maxQty: flashDeals.maxQty,
      soldQty: flashDeals.soldQty,
      endsAt: flashDeals.endsAt,
      startsAt: flashDeals.startsAt,
      product: {
        id: products.id,
        slug: products.slug,
        name: products.name,
        nameBn: products.nameBn,
        price: products.price,
        salePrice: products.salePrice,
        images: products.images,
        categoryName: categories.name,
      },
    })
    .from(flashDeals)
    .innerJoin(products, eq(flashDeals.productId, products.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(flashDeals.isActive, true),
        lte(flashDeals.startsAt, now),
        sql`${flashDeals.endsAt} > NOW()`,
        isNull(products.deletedAt),
        eq(products.isActive, true)
      )
    )
    .orderBy(desc(flashDeals.startsAt))
    .limit(1)

  if (!deal) {
    return NextResponse.json({ data: null })
  }

  return NextResponse.json({
    data: {
      id: deal.id,
      flashPrice: parseFloat(deal.flashPrice),
      maxQty: deal.maxQty,
      soldQty: deal.soldQty,
      endsAt: deal.endsAt.toISOString(),
      startsAt: deal.startsAt.toISOString(),
      product: {
        id: String(deal.product.id),
        slug: deal.product.slug,
        name: deal.product.name,
        nameBn: deal.product.nameBn,
        price: parseFloat(deal.product.price),
        salePrice: deal.product.salePrice ? parseFloat(deal.product.salePrice) : null,
        images: deal.product.images ?? [],
        categoryName: deal.product.categoryName,
      },
    },
  })
}
