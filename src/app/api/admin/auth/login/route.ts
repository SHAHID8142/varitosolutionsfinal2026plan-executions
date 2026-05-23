/**
 * @file route.ts
 * @description POST /api/admin/auth/login
 *              Authenticates an admin user with email + password via Supabase.
 *              Returns a JWT access token on success.
 *              Rate limited: 5 attempts per minute per IP.
 *
 * @owner    Antigravity (Inspector) — built on behalf of Claude Backend Agent
 * @updated  2026-05-24
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { adminApiRatelimit, getClientIp } from "@/lib/ratelimit"
import { logAuditEvent } from "@/lib/audit"

// ─────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

// ─────────────────────────────────────────────
// HANDLER
// ─────────────────────────────────────────────

/**
 * POST /api/admin/auth/login
 * Body: { email: string, password: string }
 * Returns: { data: { accessToken, refreshToken, expiresAt, admin: { id, role } } }
 */
export async function POST(request: Request): Promise<NextResponse> {
  // ── Rate limiting ─────────────────────────────
  const ip = getClientIp(request)
  const { success } = await adminApiRatelimit.limit(`admin_login:${ip}`)
  if (!success) {
    return NextResponse.json(
      { error: "Too many login attempts. Please wait a minute and try again.", code: "RATE_LIMITED" },
      { status: 429 }
    )
  }

  // ── Parse + validate body ─────────────────────
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body", code: "BAD_REQUEST" },
      { status: 400 }
    )
  }

  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input", code: "VALIDATION_ERROR" },
      { status: 400 }
    )
  }

  const { email, password } = parsed.data

  // ── Authenticate with Supabase ────────────────
  const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  })

  if (authError || !authData.user || !authData.session) {
    // Use a generic message to avoid leaking whether email exists
    return NextResponse.json(
      { error: "Invalid email or password", code: "INVALID_CREDENTIALS" },
      { status: 401 }
    )
  }

  // ── Load user from our DB and verify admin role ───
  const [dbUser] = await db
    .select({
      id: users.id,
      role: users.role,
      isBanned: users.isBanned,
      name: users.name,
    })
    .from(users)
    .where(eq(users.supabaseId, authData.user.id))
    .limit(1)

  // User exists in Supabase but not yet in our DB — deny access
  if (!dbUser) {
    return NextResponse.json(
      { error: "Admin account not found. Contact super admin.", code: "USER_NOT_FOUND" },
      { status: 403 }
    )
  }

  // Must have admin or staff role
  if (dbUser.role !== "super_admin" && dbUser.role !== "staff") {
    return NextResponse.json(
      { error: "You do not have admin access.", code: "FORBIDDEN" },
      { status: 403 }
    )
  }

  // Banned check
  if (dbUser.isBanned) {
    return NextResponse.json(
      { error: "Your account has been suspended. Contact super admin.", code: "ACCOUNT_BANNED" },
      { status: 403 }
    )
  }

  // ── Audit log — fire and forget ───────────────
  logAuditEvent({
    adminId: dbUser.id,
    action: "admin.login",
    entityType: "session",
    entityId: dbUser.id,
    request,
  })

  // ── Return session ────────────────────────────
  return NextResponse.json({
    data: {
      accessToken: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
      expiresAt: authData.session.expires_at,
      admin: {
        id: dbUser.id,
        name: dbUser.name,
        role: dbUser.role,
        email: authData.user.email,
      },
    },
    message: "Login successful",
  })
}
