/**
 * @file ratelimit.ts
 * @description Upstash Redis rate limiters for all sensitive API endpoints.
 *              Uses sliding window algorithm per the security spec.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-22
 */

import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// ─────────────────────────────────────────────
// CLIENT
// ─────────────────────────────────────────────

const upstashConfigured =
  process.env.UPSTASH_REDIS_REST_URL?.startsWith("https://") &&
  !process.env.UPSTASH_REDIS_REST_URL.includes("replace") &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN

/** Returns a no-op limiter when Upstash is not yet configured (dev / staging). */
function makeRatelimit(tokens: number, window: string, prefix: string): Ratelimit {
  if (!upstashConfigured) {
    // Always allow — safe for dev; real limits kick in once Upstash is wired
    return {
      limit: async () => ({ success: true, limit: tokens, remaining: tokens, reset: 0, pending: Promise.resolve() }),
    } as unknown as Ratelimit
  }
  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(tokens, window as Parameters<typeof Ratelimit.slidingWindow>[1]),
    prefix,
  })
}

// ─────────────────────────────────────────────
// RATE LIMITERS
// ─────────────────────────────────────────────

/** 5 OTP requests per phone number per 10 minutes */
export const otpRatelimit = makeRatelimit(5, "10 m", "rl:otp")

/** 10 OTP verify attempts per IP per 10 minutes */
export const verifyRatelimit = makeRatelimit(10, "10 m", "rl:verify")

/** 20 order creation requests per IP per hour */
export const orderRatelimit = makeRatelimit(20, "1 h", "rl:orders")

/** 10 payment initiation requests per IP per 10 minutes */
export const paymentRatelimit = makeRatelimit(10, "10 m", "rl:payment")

/** 5 admin login attempts per IP per 15 minutes */
export const adminLoginRatelimit = makeRatelimit(5, "15 m", "rl:admin_login")

/** 200 requests per admin per minute (all admin routes) */
export const adminApiRatelimit = makeRatelimit(200, "1 m", "rl:admin_api")

/** 60 requests per IP per minute (public API) */
export const publicApiRatelimit = makeRatelimit(60, "1 m", "rl:public")

// ─────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────

/** Extracts the client IP from a request for use as rate limit key. */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "127.0.0.1"
  )
}
