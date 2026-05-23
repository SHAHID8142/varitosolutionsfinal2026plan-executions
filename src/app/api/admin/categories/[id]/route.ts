/**
 * @file api/admin/categories/[id]/route.ts
 * @description Admin: update or soft-delete a category.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { categories } from "@/db/schema"
import { eq } from "drizzle-orm"
import { requireAdmin, isAuthError, auditLog } from "@/lib/admin-auth"

// ─────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────

const updateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  nameBn: z.string().max(100).optional().nullable(),
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  parentId: z.number().int().positive().optional().nullable(),
  image: z.string().url().optional().nullable(),
  sortOrder: z.number().int().min(0).optional(),
})

// ─────────────────────────────────────────────
// HANDLERS
// ─────────────────────────────────────────────

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  const { id } = await params
  const categoryId = parseInt(id, 10)
  if (isNaN(categoryId)) {
    return NextResponse.json({ error: "Invalid category ID", code: "INVALID_ID" }, { status: 400 })
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

  const updateData: Record<string, unknown> = { updatedAt: new Date() }
  const data = parsed.data
  if (data.name !== undefined) updateData.name = data.name
  if (data.nameBn !== undefined) updateData.nameBn = data.nameBn
  if (data.slug !== undefined) updateData.slug = data.slug
  if (data.parentId !== undefined) updateData.parentId = data.parentId
  if (data.image !== undefined) updateData.image = data.image
  if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder

  const [updated] = await db
    .update(categories)
    .set(updateData)
    .where(eq(categories.id, categoryId))
    .returning({ id: categories.id })

  if (!updated) {
    return NextResponse.json({ error: "Category not found", code: "NOT_FOUND" }, { status: 404 })
  }

  auditLog(admin, request, "update_category", "category", id, data)

  return NextResponse.json({ data: { message: "Category updated" } })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request, { role: "super_admin" })
  if (isAuthError(admin)) return admin

  const { id } = await params
  const categoryId = parseInt(id, 10)
  if (isNaN(categoryId)) {
    return NextResponse.json({ error: "Invalid category ID", code: "INVALID_ID" }, { status: 400 })
  }

  // Categories have no deletedAt — hard delete (products keep their categoryId as null)
  const [deleted] = await db
    .delete(categories)
    .where(eq(categories.id, categoryId))
    .returning({ id: categories.id, name: categories.name })

  if (!deleted) {
    return NextResponse.json({ error: "Category not found", code: "NOT_FOUND" }, { status: 404 })
  }

  auditLog(admin, request, "delete_category", "category", id, { name: deleted.name })

  return NextResponse.json({ data: { message: "Category deleted" } })
}
