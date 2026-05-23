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
  // ── Required from day 1 ──────────────────────────────────────
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  SUPABASE_URL: z.string().url("SUPABASE_URL must be a valid URL"),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // ── Payment (aamarPay) ────────────────────────────────────────
  AAMARPAY_STORE_ID: z.string().min(1).optional(),
  AAMARPAY_SIGNATURE_KEY: z.string().min(1).optional(),
  AAMARPAY_MODE: z.enum(["sandbox", "live"]).optional(),

  // ── Image storage (Cloudflare R2) ─────────────────────────────
  CLOUDFLARE_R2_ENDPOINT: z.string().url().optional(),
  CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().min(1).optional(),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  CLOUDFLARE_R2_BUCKET: z.string().min(1).optional(),

  // ── Email (Brevo) ─────────────────────────────────────────────
  BREVO_API_KEY: z.string().min(1).optional(),
  BREVO_SENDER_EMAIL: z.string().email().optional(),
  BREVO_SENDER_NAME: z.string().min(1).optional(),

  // ── Rate limiting (Upstash Redis) ─────────────────────────────
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),

  // ── Courier — Steadfast ───────────────────────────────────────
  STEADFAST_API_KEY: z.string().min(1).optional(),
  STEADFAST_API_SECRET: z.string().min(1).optional(),

  // ── Courier — Pathao ──────────────────────────────────────────
  PATHAO_CLIENT_ID: z.string().min(1).optional(),
  PATHAO_CLIENT_SECRET: z.string().min(1).optional(),
  PATHAO_USERNAME: z.string().min(1).optional(),
  PATHAO_PASSWORD: z.string().min(1).optional(),

  // ── Courier — RedX ────────────────────────────────────────────
  REDX_API_TOKEN: z.string().min(1).optional(),

  // ── Analytics server-side (PostHog) ──────────────────────────
  POSTHOG_PERSONAL_API_KEY: z.string().min(1).optional(),
  POSTHOG_PROJECT_ID: z.string().min(1).optional(),

  // ── App ───────────────────────────────────────────────────────
  NEXTAUTH_SECRET: z.string().min(32).optional(),
})

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
})

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

/** Validated server-only environment variables. Import this instead of process.env directly. */
function parseServerEnv() {
  const result = serverEnvSchema.safeParse(process.env)
  if (!result.success) {
    const missing = result.error.issues
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
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
})
