/**
 * @file api/admin/categories/route.ts
 * @description Admin: list all categories and create new categories.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { categories } from "@/db/schema"
import { asc } from "drizzle-orm"
import { requireAdmin, isAuthError, auditLog } from "@/lib/admin-auth"

// ─────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────

const createSchema = z.object({
  name: z.string().min(2).max(100),
  nameBn: z.string().max(100).optional(),
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  parentId: z.number().int().positive().optional().nullable(),
  image: z.string().url().optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
})

// ─────────────────────────────────────────────
// HANDLERS
// ─────────────────────────────────────────────

export async function GET(request: Request) {
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  const rows = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.name))

  return NextResponse.json({
    data: rows.map((c) => ({
      id: String(c.id),
      name: c.name,
      nameBn: c.nameBn,
      slug: c.slug,
      parentId: c.parentId ? String(c.parentId) : null,
      image: c.image,
      sortOrder: c.sortOrder,
      createdAt: c.createdAt?.toISOString(),
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

  const [category] = await db
    .insert(categories)
    .values({
      name: data.name,
      nameBn: data.nameBn ?? null,
      slug: data.slug,
      parentId: data.parentId ?? null,
      image: data.image ?? null,
      sortOrder: data.sortOrder,
    })
    .returning({ id: categories.id, slug: categories.slug })

  auditLog(admin, request, "create_category", "category", String(category.id), {
    name: data.name,
  })

  return NextResponse.json({ data: { id: String(category.id), slug: category.slug } }, { status: 201 })
}
