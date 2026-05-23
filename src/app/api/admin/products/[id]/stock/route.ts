/**
 * @file api/admin/products/[id]/stock/route.ts
 * @description Admin: adjust product stock with reason logging.
 *              Logged to inventory_log for audit trail.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { products, inventoryLog } from "@/db/schema"
import { and, eq, isNull, sql } from "drizzle-orm"
import { requireAdmin, isAuthError, auditLog } from "@/lib/admin-auth"

const bodySchema = z.object({
  adjustment: z.number().int(), // positive = add, negative = remove
  reason: z.string().max(200),
  type: z.enum(["purchase", "return", "correction", "damage", "sale", "other"]).default("correction"),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  const { id } = await params
  const productId = parseInt(id, 10)
  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product ID", code: "INVALID_ID" }, { status: 400 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body", code: "INVALID_BODY" }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
      { status: 400 }
    )
  }

  const { adjustment, reason, type } = parsed.data

  const [product] = await db
    .select({ id: products.id, stock: products.stock, name: products.name })
    .from(products)
    .where(and(eq(products.id, productId), isNull(products.deletedAt)))
    .limit(1)

  if (!product) {
    return NextResponse.json({ error: "Product not found", code: "NOT_FOUND" }, { status: 404 })
  }

  const newStock = product.stock + adjustment
  if (newStock < 0) {
    return NextResponse.json(
      { error: `Adjustment would result in negative stock (current: ${product.stock})`, code: "NEGATIVE_STOCK" },
      { status: 400 }
    )
  }

  await db
    .update(products)
    .set({ stock: sql`${products.stock} + ${adjustment}`, updatedAt: new Date() })
    .where(eq(products.id, productId))

  await db.insert(inventoryLog).values({
    productId,
    type,
    quantity: Math.abs(adjustment),
    before: product.stock,
    after: newStock,
    reason,
    changedBy: admin.userId,
  })

  auditLog(admin, request, "adjust_stock", "product", id, {
    name: product.name,
    adjustment,
    type,
    reason,
    previousStock: product.stock,
    newStock,
  })

  return NextResponse.json({ data: { message: "Stock adjusted", newStock } })
}
