/**
 * @file api/admin/settings/route.ts
 * @description Admin (super_admin): get and update store settings key-value store.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { settings } from "@/db/schema"
import { requireAdmin, isAuthError, auditLog } from "@/lib/admin-auth"

// ─────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────

const updateSchema = z.object({
  updates: z.record(z.string(), z.unknown()),
})

// ─────────────────────────────────────────────
// HANDLERS
// ─────────────────────────────────────────────

export async function GET(request: Request) {
  const admin = await requireAdmin(request, { role: "super_admin" })
  if (isAuthError(admin)) return admin

  const rows = await db.select().from(settings)

  const result: Record<string, unknown> = {}
  for (const row of rows) {
    result[row.key] = row.value
  }

  return NextResponse.json({ data: result })
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin(request, { role: "super_admin" })
  if (isAuthError(admin)) return admin

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

  const { updates } = parsed.data

  // Upsert each key individually
  await Promise.all(
    Object.entries(updates).map(([key, value]) =>
      db
        .insert(settings)
        .values({ key, value: JSON.stringify(value) })
        .onConflictDoUpdate({
          target: settings.key,
          set: { value: JSON.stringify(value), updatedAt: new Date() },
        })
    )
  )

  auditLog(admin, request, "update_settings", "settings", "global", { keys: Object.keys(updates) })

  return NextResponse.json({ data: { message: "Settings updated" } })
}
