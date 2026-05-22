/**
 * @file auth.ts
 * @description Supabase Auth helpers for customer and admin authentication.
 *              Uses the Service Role key for server-side operations.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-22
 */

import { createClient } from "@supabase/supabase-js"
import { serverEnv } from "@/lib/env"

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
// HELPERS
// ─────────────────────────────────────────────

/** Extracts and verifies the Bearer JWT from a request's Authorization header. */
export async function getAuthUser(request: Request) {
  const authHeader = request.headers.get("Authorization")
  if (!authHeader?.startsWith("Bearer ")) return null

  const token = authHeader.slice(7)
  const { data, error } = await supabaseAnon.auth.getUser(token)
  if (error || !data.user) return null
  return data.user
}

/** Sends a phone OTP via Supabase Auth. Phone must be in E.164 format (+880...). */
export async function sendPhoneOtp(phone: string) {
  const { error } = await supabaseAdmin.auth.signInWithOtp({
    phone,
  })
  if (error) throw error
}

/** Verifies a phone OTP token. Returns the Supabase session on success. */
export async function verifyPhoneOtp(phone: string, token: string) {
  const { data, error } = await supabaseAnon.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  })
  if (error) throw error
  return data
}
