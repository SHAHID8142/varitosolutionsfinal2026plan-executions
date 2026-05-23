/**
 * @file api/auth/otp/route.ts
 * @description Send phone OTP via Supabase. Rate limited to 5 per phone per 10 minutes.
 *              Bangladesh phone format: +880XXXXXXXXXX
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { sendPhoneOtp } from "@/lib/auth"
import { otpRatelimit, getClientIp } from "@/lib/ratelimit"

// ─────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────

const bodySchema = z.object({
  phone: z
    .string()
    .regex(/^\+8801[3-9]\d{8}$/, "Invalid Bangladesh phone number (+8801XXXXXXXXX format)"),
})

// ─────────────────────────────────────────────
// HANDLER
// ─────────────────────────────────────────────

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const { success: ipOk } = await otpRatelimit.limit(ip)
  if (!ipOk) {
    return NextResponse.json(
      { error: "Too many OTP requests. Please wait before trying again.", code: "RATE_LIMITED" },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body", code: "INVALID_BODY" }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
      { status: 400 }
    )
  }

  // Also rate limit per phone number
  const { success: phoneOk } = await otpRatelimit.limit(`phone:${parsed.data.phone}`)
  if (!phoneOk) {
    return NextResponse.json(
      { error: "Too many OTP requests for this phone number.", code: "RATE_LIMITED" },
      { status: 429 }
    )
  }

  const result = await sendPhoneOtp(parsed.data.phone)
  if (!result.success) {
    return NextResponse.json(
      { error: result.error ?? "Failed to send OTP", code: "OTP_SEND_FAILED" },
      { status: 500 }
    )
  }

  return NextResponse.json({ data: { message: "OTP sent successfully" } })
}
