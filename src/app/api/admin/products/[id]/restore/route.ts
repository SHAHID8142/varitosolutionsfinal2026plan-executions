/**
 * @file api/admin/products/[id]/restore/route.ts
 * @description Admin (super_admin): restore a soft-deleted product.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { products } from "@/db/schema"
import { and, eq, isNotNull } from "drizzle-orm"
import { requireAdmin, isAuthError, auditLog } from "@/lib/admin-auth"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request, { role: "super_admin" })
  if (isAuthError(admin)) return admin

  const { id } = await params
  const productId = parseInt(id, 10)
  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product ID", code: "INVALID_ID" }, { status: 400 })
  }

  const [restored] = await db
    .update(products)
    .set({ deletedAt: null, isActive: true, updatedAt: new Date() })
    .where(and(eq(products.id, productId), isNotNull(products.deletedAt)))
    .returning({ id: products.id, name: products.name })

  if (!restored) {
    return NextResponse.json(
      { error: "Product not found or not deleted", code: "NOT_FOUND" },
      { status: 404 }
    )
  }

  auditLog(admin, request, "restore_product", "product", id, { name: restored.name })

  return NextResponse.json({ data: { message: "Product restored" } })
}
