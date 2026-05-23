/**
 * @file route.ts
 * @description POST /api/admin/auth/logout
 *              Invalidates the admin's Supabase session server-side.
 *              The frontend should also clear its locally stored token after calling this.
 *
 * @owner    Antigravity (Inspector) — built on behalf of Claude Backend Agent
 * @updated  2026-05-24
 */

import { NextResponse } from "next/server"
import { requireAdmin, isAuthError } from "@/lib/admin-auth"
import { supabaseAdmin } from "@/lib/auth"
import { logAuditEvent } from "@/lib/audit"

// ─────────────────────────────────────────────
// HANDLER
// ─────────────────────────────────────────────

/**
 * POST /api/admin/auth/logout
 * Headers: Authorization: Bearer <access_token>
 * Returns: { message: "Logged out successfully" }
 */
export async function POST(request: Request): Promise<NextResponse> {
  // ── Verify admin session before allowing logout ──
  const admin = await requireAdmin(request)
  if (isAuthError(admin)) return admin

  // ── Invalidate the Supabase session server-side ──
  // This revokes the refresh token so the JWT cannot be renewed
  const { error } = await supabaseAdmin.auth.admin.signOut(admin.supabaseId)

  if (error) {
    // Log the error but don't block the user from logging out
    console.error("[admin/auth/logout] Supabase signOut error:", error.message)
  }

  // ── Audit log — fire and forget ───────────────
  logAuditEvent({
    adminId: admin.userId,
    action: "admin.logout",
    entityType: "session",
    entityId: admin.userId,
    request,
  })

  return NextResponse.json({ message: "Logged out successfully" })
}
