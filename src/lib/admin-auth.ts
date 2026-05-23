/**
 * @file admin-auth.ts
 * @description Admin authentication and RBAC helpers for API route handlers.
 *              Role is always read from the database — never from the JWT payload.
 *              Call requireAdmin() at the top of every admin route handler.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { adminApiRatelimit, getClientIp } from "@/lib/ratelimit"
import { logAuditEvent } from "@/lib/audit"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface AdminContext {
  userId: string    // UUID — matches users.id in DB
  supabaseId: string
  role: "super_admin" | "staff"
}

type RequireAdminOptions = {
  role?: "super_admin" | "staff"
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/**
 * Verifies the request has a valid admin session.
 * Returns the admin context on success, or a NextResponse error on failure.
 * Role is read from our database — never from the JWT.
 */
export async function requireAdmin(
  request: Request,
  options: RequireAdminOptions = {}
): Promise<AdminContext | NextResponse> {
  const ip = getClientIp(request)

  const { success } = await adminApiRatelimit.limit(ip)
  if (!success) {
    return NextResponse.json({ error: "Too many requests", code: "RATE_LIMITED" }, { status: 429 })
  }

  const authUser = await getAuthUser(request).catch(() => null)

  if (!authUser || !authUser.dbUser) {
    return NextResponse.json(
      { error: "Authentication required", code: "UNAUTHENTICATED" },
      { status: 401 }
    )
  }

  const { dbUser } = authUser

  if (dbUser.role !== "super_admin" && dbUser.role !== "staff") {
    return NextResponse.json(
      { error: "Admin access required", code: "FORBIDDEN" },
      { status: 403 }
    )
  }

  const requiredRole = options.role ?? "staff"
  if (requiredRole === "super_admin" && dbUser.role !== "super_admin") {
    return NextResponse.json(
      { error: "Super admin access required", code: "FORBIDDEN" },
      { status: 403 }
    )
  }

  return {
    userId: dbUser.id,
    supabaseId: authUser.supabaseId,
    role: dbUser.role as "super_admin" | "staff",
  }
}

/** Type guard to check if requireAdmin returned an error response */
export function isAuthError(result: AdminContext | NextResponse): result is NextResponse {
  return result instanceof NextResponse
}

/** Logs an admin action to the audit_log table. Non-blocking. */
export function auditLog(
  admin: AdminContext,
  request: Request,
  action: string,
  entityType: string,
  entityId: string,
  changes?: Record<string, unknown>
) {
  logAuditEvent({
    adminId: admin.userId,
    action,
    entityType,
    entityId,
    changes: changes ? { after: changes } : undefined,
    request,
  })
}
