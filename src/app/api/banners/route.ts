/**
 * @file api/banners/route.ts
 * @description Public: list active banners, optionally filtered by position.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { banners } from "@/db/schema"
import { and, asc, eq, isNull, lte, or } from "drizzle-orm"
import { sql } from "drizzle-orm"

const querySchema = z.object({
  position: z.string().max(30).optional(),
})

export async function GET(request: Request) {
  const url = new URL(request.url)
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams))
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
      { status: 400 }
    )
  }

  const now = new Date()
  const conditions = [
    eq(banners.isActive, true),
    // Banner is either timeless (no startsAt) or has started
    or(isNull(banners.startsAt), lte(banners.startsAt, now))!,
    // Banner is either timeless (no endsAt) or has not ended
    or(isNull(banners.endsAt), sql`${banners.endsAt} > NOW()`)!,
  ]

  if (parsed.data.position) {
    conditions.push(eq(banners.position, parsed.data.position))
  }

  const rows = await db
    .select({
      id: banners.id,
      title: banners.title,
      subtitle: banners.subtitle,
      image: banners.image,
      ctaText: banners.ctaText,
      ctaUrl: banners.ctaUrl,
      position: banners.position,
      sortOrder: banners.sortOrder,
    })
    .from(banners)
    .where(and(...conditions))
    .orderBy(asc(banners.sortOrder), asc(banners.id))

  return NextResponse.json({ data: rows })
}
