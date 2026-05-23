/**
 * @file api/admin/products/[id]/route.ts
 * @description Admin: get, update, or soft-delete a product by ID.
 *              DELETE is super_admin only.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { products } from "@/db/schema"
import { eq } from "drizzle-orm"
import { requireAdmin, isAuthError, auditLog } from "@/lib/admin-auth"

// ─────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────

const updateSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  nameBn: z.string().max(200).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  descriptionBn: z.string().max(5000).optional().nullable(),
  price: z.number().positive().optional(),
  salePrice: z.number().positive().optional().nullable(),
  costPrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0).optional(),
  unit: z.string().max(50).optional(),
  minOrderQty: z.number().int().min(1).optional(),
  sku: z.string().max(100).optional().nullable(),
  categoryId: z.number().int().positive().optional(),
  images: z.array(z.string().url()).max(10).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
})

// ─────────────────────────────────────────────
// HANDLERS
// ─────────────────────────────────────────────

export async function GET(
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

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .limit(1)

  if (!product) {
    return NextResponse.json({ error: "Product not found", code: "NOT_FOUND" }, { status: 404 })
  }

  return NextResponse.json({
    data: {
      ...product,
      id: String(product.id),
      price: parseFloat(product.price),
      salePrice: product.salePrice ? parseFloat(product.salePrice) : null,
      costPrice: product.costPrice ? parseFloat(product.costPrice) : null,
      images: product.images ?? [],
    },
  })
}

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

  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
      { status: 400 }
    )
  }

  const data = parsed.data
  const updateData: Record<string, unknown> = { updatedAt: new Date() }

  if (data.name !== undefined) updateData.name = data.name
  if (data.nameBn !== undefined) updateData.nameBn = data.nameBn
  if (data.description !== undefined) updateData.description = data.description
  if (data.descriptionBn !== undefined) updateData.descriptionBn = data.descriptionBn
  if (data.price !== undefined) updateData.price = String(data.price)
  if (data.salePrice !== undefined) updateData.salePrice = data.salePrice ? String(data.salePrice) : null
  if (data.costPrice !== undefined) updateData.costPrice = data.costPrice ? String(data.costPrice) : null
  if (data.stock !== undefined) updateData.stock = data.stock
  if (data.unit !== undefined) updateData.unit = data.unit
  if (data.minOrderQty !== undefined) updateData.minOrderQty = data.minOrderQty
  if (data.sku !== undefined) updateData.sku = data.sku
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId
  if (data.images !== undefined) updateData.images = data.images
  if (data.isActive !== undefined) updateData.isActive = data.isActive
  if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured

  const [updated] = await db
    .update(products)
    .set(updateData)
    .where(eq(products.id, productId))
    .returning({ id: products.id })

  if (!updated) {
    return NextResponse.json({ error: "Product not found", code: "NOT_FOUND" }, { status: 404 })
  }

  auditLog(admin, request, "update_product", "product", id, data)

  return NextResponse.json({ data: { message: "Product updated" } })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Delete is super_admin only
  const admin = await requireAdmin(request, { role: "super_admin" })
  if (isAuthError(admin)) return admin

  const { id } = await params
  const productId = parseInt(id, 10)
  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product ID", code: "INVALID_ID" }, { status: 400 })
  }

  // Soft delete — never hard delete
  const [deleted] = await db
    .update(products)
    .set({ deletedAt: new Date(), isActive: false, updatedAt: new Date() })
    .where(eq(products.id, productId))
    .returning({ id: products.id, name: products.name })

  if (!deleted) {
    return NextResponse.json({ error: "Product not found", code: "NOT_FOUND" }, { status: 404 })
  }

  auditLog(admin, request, "delete_product", "product", id, { name: deleted.name })

  return NextResponse.json({ data: { message: "Product deleted" } })
}
