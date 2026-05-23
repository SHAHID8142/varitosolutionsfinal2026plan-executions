/**
 * @file api/admin/banners/reorder/route.ts
 * @description Admin: bulk update sort_order for banners.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { banners } from "@/db/schema"
import { eq } from "drizzle-orm"
import { requireAdmin, isAuthError } from "@/lib/admin-auth"

const bodySchema = z.object({
  order: z
    .array(z.object({ id: z.number().int().positive(), sortOrder: z.number().int().min(0) }))
    .min(1)
    .max(100),
})

export async function PATCH(request: Request) {
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

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

  await Promise.all(
    parsed.data.order.map(({ id, sortOrder }) =>
      db.update(banners).set({ sortOrder, updatedAt: new Date() }).where(eq(banners.id, id))
    )
  )

  return NextResponse.json({ data: { updated: parsed.data.order.length } })
}
