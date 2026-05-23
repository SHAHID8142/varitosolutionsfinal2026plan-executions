/**
 * @file route.ts
 * @description GET /api/admin/auth/session
 *              Returns the currently authenticated admin's session and profile.
 *              Used by the admin frontend to check if the user is still logged in
 *              and to get their role on initial load.
 *
 * @owner    Antigravity (Inspector) — built on behalf of Claude Backend Agent
 * @updated  2026-05-24
 */

import { NextResponse } from "next/server"
import { requireAdmin, isAuthError } from "@/lib/admin-auth"
import { db } from "@/lib/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { supabaseAdmin } from "@/lib/auth"

// ─────────────────────────────────────────────
// HANDLER
// ─────────────────────────────────────────────

/**
 * GET /api/admin/auth/session
 * Headers: Authorization: Bearer <access_token>
 * Returns: { data: { admin: { id, name, role, email } } }
 */
export async function GET(request: Request): Promise<NextResponse> {
  // ── Verify admin session ──────────────────────
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  // ── Load fresh profile from DB ────────────────
  const [dbUser] = await db
    .select({
      id: users.id,
      name: users.name,
      role: users.role,
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, admin.userId))
    .limit(1)

  if (!dbUser) {
    return NextResponse.json(
      { error: "Admin profile not found", code: "USER_NOT_FOUND" },
      { status: 404 }
    )
  }

  // ── Get Supabase email if not in DB ──────────
  let email = dbUser.email
  if (!email) {
    const { data: supaUser } = await supabaseAdmin.auth.admin.getUserById(admin.supabaseId)
    email = supaUser?.user?.email ?? null
  }

  return NextResponse.json({
    data: {
      admin: {
        id: dbUser.id,
        name: dbUser.name,
        role: dbUser.role,
        email,
      },
    },
  })
}
