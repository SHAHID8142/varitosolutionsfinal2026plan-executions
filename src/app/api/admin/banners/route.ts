/**
 * @file api/admin/banners/route.ts
 * @description Admin: list and create hero banners.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { banners } from "@/db/schema"
import { asc } from "drizzle-orm"
import { requireAdmin, isAuthError, auditLog } from "@/lib/admin-auth"

const createSchema = z.object({
  title: z.string().min(2).max(200),
  subtitle: z.string().max(300).optional(),
  image: z.string().url(),
  ctaText: z.string().max(50).optional(),
  ctaUrl: z.string().url().optional().nullable(),
  position: z.enum(["hero", "banner", "sidebar", "popup"]).default("hero"),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
})

export async function GET(request: Request) {
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  const rows = await db
    .select()
    .from(banners)
    .orderBy(asc(banners.sortOrder))

  return NextResponse.json({
    data: rows.map((b) => ({
      id: String(b.id),
      title: b.title,
      subtitle: b.subtitle,
      image: b.image,
      ctaText: b.ctaText,
      ctaUrl: b.ctaUrl,
      position: b.position,
      sortOrder: b.sortOrder,
      isActive: b.isActive,
      createdAt: b.createdAt.toISOString(),
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

  const data = parsed.data
  const [banner] = await db
    .insert(banners)
    .values({
      title: data.title,
      subtitle: data.subtitle ?? null,
      image: data.image,
      ctaText: data.ctaText ?? null,
      ctaUrl: data.ctaUrl ?? null,
      position: data.position,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
      createdBy: admin.userId,
    })
    .returning({ id: banners.id })

  auditLog(admin, request, "create_banner", "banner", String(banner.id), { title: data.title })

  return NextResponse.json({ data: { id: String(banner.id) } }, { status: 201 })
}
