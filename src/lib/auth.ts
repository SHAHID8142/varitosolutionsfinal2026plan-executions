/**
 * @file auth.ts
 * @description Supabase Auth helpers for customer and admin authentication.
 *              Uses the Service Role key for server-side operations.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { createClient } from "@supabase/supabase-js"
import { serverEnv } from "@/lib/env"
import { db } from "@/lib/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

// ─────────────────────────────────────────────
// CLIENTS
// ─────────────────────────────────────────────

/** Service-role Supabase client — server-side only, never expose to client. */
export const supabaseAdmin = createClient(
  serverEnv.SUPABASE_URL,
  serverEnv.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

/** Anon Supabase client — used for verifying JWTs from incoming requests. */
export const supabaseAnon = createClient(
  serverEnv.SUPABASE_URL,
  serverEnv.SUPABASE_ANON_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface AuthUser {
  supabaseId: string
  dbUser: {
    id: string       // UUID
    phone: string
    name: string | null
    role: string
    isBanned: boolean
  } | null
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/**
 * Extracts and verifies the Bearer JWT from a request, then loads the DB user.
 * Returns null if the token is missing or invalid.
 */
export async function getAuthUser(request: Request): Promise<AuthUser | null> {
  const authHeader = request.headers.get("Authorization")
  if (!authHeader?.startsWith("Bearer ")) return null

  const token = authHeader.slice(7)
  const { data, error } = await supabaseAnon.auth.getUser(token)
  if (error || !data.user) return null

  const [dbUser] = await db
    .select({
      id: users.id,
      phone: users.phone,
      name: users.name,
      role: users.role,
      isBanned: users.isBanned,
    })
    .from(users)
    .where(eq(users.supabaseId, data.user.id))
    .limit(1)

  return {
    supabaseId: data.user.id,
    dbUser: dbUser ?? null,
  }
}

/** Sends a phone OTP via Supabase Auth. Phone must be in E.164 format (+880...). */
export async function sendPhoneOtp(
  phone: string
): Promise<{ success: true } | { success: false; error: string }> {
  const { error } = await supabaseAdmin.auth.signInWithOtp({ phone })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

/** Verifies a phone OTP token. Returns the Supabase session on success. */
export async function verifyPhoneOtp(
  phone: string,
  token: string
): Promise<
  | { success: true; user: { id: string }; session: { access_token: string; refresh_token: string; expires_at?: number } }
  | { success: false; error: string }
> {
  const { data, error } = await supabaseAnon.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  })
  if (error || !data.user || !data.session) {
    return { success: false, error: error?.message ?? "Verification failed" }
  }
  return {
    success: true,
    user: { id: data.user.id },
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    },
  }
}
