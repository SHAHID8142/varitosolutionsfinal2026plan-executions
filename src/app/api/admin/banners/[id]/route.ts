/**
 * @file api/admin/banners/[id]/route.ts
 * @description Admin: update or delete a banner.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { banners } from "@/db/schema"
import { eq } from "drizzle-orm"
import { requireAdmin, isAuthError, auditLog } from "@/lib/admin-auth"

const updateSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  subtitle: z.string().max(300).optional().nullable(),
  image: z.string().url().optional(),
  ctaText: z.string().max(50).optional().nullable(),
  ctaUrl: z.string().url().optional().nullable(),
  position: z.enum(["hero", "banner", "sidebar", "popup"]).optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  const { id } = await params
  const bannerId = parseInt(id, 10)
  if (isNaN(bannerId)) {
    return NextResponse.json({ error: "Invalid banner ID", code: "INVALID_ID" }, { status: 400 })
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

  const [updated] = await db
    .update(banners)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(banners.id, bannerId))
    .returning({ id: banners.id })

  if (!updated) {
    return NextResponse.json({ error: "Banner not found", code: "NOT_FOUND" }, { status: 404 })
  }

  auditLog(admin, request, "update_banner", "banner", id, parsed.data)

  return NextResponse.json({ data: { message: "Banner updated" } })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  const { id } = await params
  const bannerId = parseInt(id, 10)
  if (isNaN(bannerId)) {
    return NextResponse.json({ error: "Invalid banner ID", code: "INVALID_ID" }, { status: 400 })
  }

  // Hard delete banners — they don't have deletedAt
  const [deleted] = await db
    .delete(banners)
    .where(eq(banners.id, bannerId))
    .returning({ id: banners.id })

  if (!deleted) {
    return NextResponse.json({ error: "Banner not found", code: "NOT_FOUND" }, { status: 404 })
  }

  auditLog(admin, request, "delete_banner", "banner", id, {})

  return NextResponse.json({ data: { message: "Banner deleted" } })
}
