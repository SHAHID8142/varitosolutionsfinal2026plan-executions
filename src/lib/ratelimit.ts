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

/** Lazily initialized Redis client — only connects when rate limiting is called. */
function getRedis() {
  return Redis.fromEnv()
}

// ─────────────────────────────────────────────
// RATE LIMITERS
// ─────────────────────────────────────────────

/** 5 OTP requests per phone number per 10 minutes */
export const otpRatelimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  prefix: "rl:otp",
})

/** 10 OTP verify attempts per IP per 10 minutes */
export const verifyRatelimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(10, "10 m"),
  prefix: "rl:verify",
})

/** 20 order creation requests per IP per hour */
export const orderRatelimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(20, "1 h"),
  prefix: "rl:orders",
})

/** 10 payment initiation requests per IP per 10 minutes */
export const paymentRatelimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(10, "10 m"),
  prefix: "rl:payment",
})

/** 5 admin login attempts per IP per 15 minutes */
export const adminLoginRatelimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  prefix: "rl:admin_login",
})

/** 200 requests per admin per minute (all admin routes) */
export const adminApiRatelimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(200, "1 m"),
  prefix: "rl:admin_api",
})

/** 60 requests per IP per minute (public API) */
export const publicApiRatelimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(60, "1 m"),
  prefix: "rl:public",
})

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
