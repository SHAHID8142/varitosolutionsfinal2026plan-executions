/**
 * @file lib/validate.ts
 * @description Shared Zod schemas used across multiple route handlers.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { z } from "zod"

// ─────────────────────────────────────────────
// PHONE / CURRENCY
// ─────────────────────────────────────────────

/** Bangladesh mobile number in E.164 format (+8801XXXXXXXXX) — used for Supabase auth */
export const bdPhoneE164 = z
  .string()
  .regex(/^\+8801[3-9]\d{8}$/, "Invalid Bangladesh phone number (+8801XXXXXXXXX)")

/** Bangladesh mobile number in local format (01XXXXXXXXX) — used for shipping address */
export const bdPhoneLocal = z
  .string()
  .regex(/^01[3-9]\d{8}$/, "Invalid Bangladesh phone number (01XXXXXXXXX)")

/** Non-negative BDT amount */
export const bdtAmount = z.number().nonnegative()

/** Positive BDT price */
export const bdtPrice = z.number().positive()

// ─────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────

export const paginationParams = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(25),
})

export const dateRangeParams = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD").optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD").optional(),
})

// ─────────────────────────────────────────────
// SLUG
// ─────────────────────────────────────────────

export const slugSchema = z
  .string()
  .min(2)
  .max(220)
  .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only")

// ─────────────────────────────────────────────
// SHIPPING ADDRESS
// ─────────────────────────────────────────────

export const addressSchema = z.object({
  name: z.string().min(2).max(100),
  phone: bdPhoneLocal,
  district: z.string().min(1).max(100),
  thana: z.string().min(1).max(100),
  area: z.string().min(1).max(200),
  road: z.string().max(200).optional(),
  house: z.string().max(200).optional(),
  landmark: z.string().max(200).optional(),
})
