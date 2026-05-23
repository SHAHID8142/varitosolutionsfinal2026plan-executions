/**
 * @file lib/errors.ts
 * @description Standard JSON error response helpers. All API routes use these
 *              to return consistent { error, code } envelopes.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"

// ─────────────────────────────────────────────
// TYPED ERROR CODES
// ─────────────────────────────────────────────

export type ErrorCode =
  | "VALIDATION_ERROR"
  | "INVALID_BODY"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "PRODUCT_UNAVAILABLE"
  | "INSUFFICIENT_STOCK"
  | "MIN_QTY_VIOLATION"
  | "INVALID_COUPON"
  | "COUPON_EXPIRED"
  | "COUPON_EXHAUSTED"
  | "COUPON_MIN_AMOUNT"
  | "PAYMENT_INIT_FAILED"
  | "INVALID_STATUS"
  | "SHIPMENT_EXISTS"
  | "INTERNAL_ERROR"

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

export function badRequest(error: string, code: ErrorCode = "VALIDATION_ERROR") {
  return NextResponse.json({ error, code }, { status: 400 })
}

export function unauthorized(error = "Authentication required") {
  return NextResponse.json({ error, code: "UNAUTHORIZED" }, { status: 401 })
}

export function forbidden(error = "Insufficient permissions") {
  return NextResponse.json({ error, code: "FORBIDDEN" }, { status: 403 })
}

export function notFound(error = "Resource not found") {
  return NextResponse.json({ error, code: "NOT_FOUND" }, { status: 404 })
}

export function conflict(error: string) {
  return NextResponse.json({ error, code: "CONFLICT" }, { status: 409 })
}

export function rateLimited(error = "Too many requests") {
  return NextResponse.json({ error, code: "RATE_LIMITED" }, { status: 429 })
}

export function internalError(error = "Internal server error") {
  return NextResponse.json({ error, code: "INTERNAL_ERROR" }, { status: 500 })
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status })
}

export function created<T>(data: T) {
  return NextResponse.json({ data }, { status: 201 })
}
