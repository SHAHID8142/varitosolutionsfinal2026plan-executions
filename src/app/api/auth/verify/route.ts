/**
 * @file api/auth/verify/route.ts
 * @description Verify phone OTP. On success, returns Supabase session tokens
 *              and upserts the user in our `users` table.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { verifyPhoneOtp } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/db/schema"
import { verifyRatelimit, getClientIp } from "@/lib/ratelimit"

const bodySchema = z.object({
  phone: z.string().regex(/^\+8801[3-9]\d{8}$/, "Invalid Bangladesh phone number"),
  token: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only digits"),
})

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const { success } = await verifyRatelimit.limit(ip)
  if (!success) {
    return NextResponse.json(
      { error: "Too many verification attempts", code: "RATE_LIMITED" },
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

  const result = await verifyPhoneOtp(parsed.data.phone, parsed.data.token)
  if (!result.success) {
    return NextResponse.json(
      { error: result.error, code: "OTP_INVALID" },
      { status: 401 }
    )
  }

  // Upsert user in our DB
  await db
    .insert(users)
    .values({
      supabaseId: result.user.id,
      phone: parsed.data.phone,
      role: "customer",
    })
    .onConflictDoUpdate({
      target: users.supabaseId,
      set: { phone: parsed.data.phone, updatedAt: new Date() },
    })

  return NextResponse.json({
    data: {
      accessToken: result.session.access_token,
      refreshToken: result.session.refresh_token,
      expiresAt: result.session.expires_at,
      user: {
        id: result.user.id,
        phone: parsed.data.phone,
      },
    },
  })
}
