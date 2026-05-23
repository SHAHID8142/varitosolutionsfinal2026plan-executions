/**
 * @file aamarpay.ts
 * @description aamarPay payment gateway client.
 *              Handles payment initiation and webhook signature verification.
 *              NEVER trust a payment without verifying the webhook signature.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-22
 */

import crypto from "crypto"
import { serverEnv } from "@/lib/env"

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const AAMARPAY_URLS = {
  sandbox: "https://sandbox.aamarpay.com/jsonpost.php",
  live: "https://aamarpay.com/jsonpost.php",
} as const

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface AamarPayInitiateParams {
  orderId: string
  amount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  successUrl?: string
  failUrl?: string
  cancelUrl?: string
}

export interface AamarPayWebhookPayload {
  mer_txnid: string
  pg_txnid: string
  amount: string
  pay_status: string
  hash: string
  [key: string]: string
}

// ─────────────────────────────────────────────
// INITIATE PAYMENT
// ─────────────────────────────────────────────

/** Initiates an aamarPay payment session. Returns the redirect URL. */
export async function initiateAamarPayPayment(
  params: AamarPayInitiateParams
): Promise<string> {
  const payload = {
    store_id: serverEnv.AAMARPAY_STORE_ID,
    signature_key: serverEnv.AAMARPAY_SIGNATURE_KEY,
    tran_id: params.orderId,
    amount: params.amount.toFixed(2),
    currency: "BDT",
    cus_name: params.customerName,
    cus_email: params.customerEmail || "customer@example.com",
    cus_phone: params.customerPhone,
    cus_add1: "Bangladesh",
    cus_city: "Chattogram",
    cus_country: "Bangladesh",
    success_url: params.successUrl ?? `${process.env.NEXT_PUBLIC_APP_URL}/orders/success`,
    fail_url: params.failUrl ?? `${process.env.NEXT_PUBLIC_APP_URL}/orders/failed`,
    cancel_url: params.cancelUrl ?? `${process.env.NEXT_PUBLIC_APP_URL}/orders/cancelled`,
    desc: `Order #${params.orderId} — Varito Solutions`,
    type: "json",
  }

  const url = AAMARPAY_URLS[serverEnv.AAMARPAY_MODE || "sandbox"]
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`aamarPay initiation failed: ${response.status}`)
  }

  const data = (await response.json()) as { payment_url?: string; result?: string }

  if (!data.payment_url) {
    throw new Error(`aamarPay did not return a payment URL: ${JSON.stringify(data)}`)
  }

  return data.payment_url
}

// ─────────────────────────────────────────────
// WEBHOOK VERIFICATION
// ─────────────────────────────────────────────

/**
 * Verifies the aamarPay webhook signature using timing-safe comparison.
 * MUST be called before processing any webhook payload.
 */
export function verifyAamarPaySignature(payload: AamarPayWebhookPayload): boolean {
  const { hash, ...dataWithoutHash } = payload

  const dataString = Object.keys(dataWithoutHash)
    .sort()
    .map((key) => dataWithoutHash[key])
    .join("")

  const expectedHash = crypto
    .createHash("sha256")
    .update(dataString + serverEnv.AAMARPAY_SIGNATURE_KEY)
    .digest("hex")

  try {
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expectedHash))
  } catch {
    // Buffers of different lengths — definitely not equal
    return false
  }
}
