/**
 * @file env.ts
 * @description Validates all required server-side environment variables at startup.
 *              Throws immediately on missing vars so misconfigured deploys fail fast.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-22
 */

import { z } from "zod"

// ─────────────────────────────────────────────
// SCHEMAS
// ─────────────────────────────────────────────

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  SUPABASE_URL: z.string().url("SUPABASE_URL must be a valid URL"),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  CLOUDFLARE_R2_ENDPOINT: z.string().url("CLOUDFLARE_R2_ENDPOINT must be a valid URL"),
  CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().min(1),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().min(1),
  CLOUDFLARE_R2_BUCKET: z.string().min(1),
  AAMARPAY_STORE_ID: z.string().min(1),
  AAMARPAY_SIGNATURE_KEY: z.string().min(1),
  AAMARPAY_MODE: z.enum(["sandbox", "live"]),
  BREVO_API_KEY: z.string().min(1),
})

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
})

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

/** Validated server-only environment variables. Import this instead of process.env directly. */
function parseServerEnv() {
  const result = serverEnvSchema.safeParse(process.env)
  if (!result.success) {
    const missing = result.error.errors
      .map((e) => `  • ${e.path.join(".")}: ${e.message}`)
      .join("\n")
    throw new Error(`Missing or invalid server environment variables:\n${missing}`)
  }
  return result.data
}

export const serverEnv = parseServerEnv()

/** Validated public environment variables (safe to expose on client). */
export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
})
