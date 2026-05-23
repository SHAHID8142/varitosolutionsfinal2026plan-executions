/**
 * @file lib/courier.ts
 * @description Courier booking helpers for Steadfast (primary), Pathao (secondary),
 *              and RedX (tertiary). Each function returns a normalised BookingResult.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type CourierName = "steadfast" | "pathao" | "redx"

export interface CourierBookingInput {
  orderNumber: string
  recipientName: string
  recipientPhone: string
  /** Full address string e.g. "House 5, Road 2, Agrabad, Chattogram" */
  recipientAddress: string
  /** Full order total (BDT). Pass 0 for prepaid (online-paid) orders. */
  codAmount: number
  /** Weight in KG (optional, defaults vary per courier) */
  weightKg?: number
  note?: string
}

export interface BookingResult {
  courier: CourierName
  consignmentId: string
  trackingCode: string
  trackingUrl: string
  rawResponse: unknown
}

// ─────────────────────────────────────────────
// STEADFAST (PRIMARY)
// ─────────────────────────────────────────────

export async function bookSteadfast(input: CourierBookingInput): Promise<BookingResult> {
  const apiKey = process.env.STEADFAST_API_KEY
  const apiSecret = process.env.STEADFAST_API_SECRET
  if (!apiKey || !apiSecret) throw new Error("Steadfast credentials not configured")

  const body = {
    invoice: input.orderNumber,
    recipient_name: input.recipientName,
    recipient_phone: input.recipientPhone,
    recipient_address: input.recipientAddress,
    cod_amount: input.codAmount,
    note: input.note ?? "",
    weight: input.weightKg ?? 0.5,
  }

  const res = await fetch("https://portal.steadfast.com.bd/api/v1/create_order", {
    method: "POST",
    headers: {
      "Api-Key": apiKey,
      "Api-Secret": apiSecret,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  if (!res.ok || data.status !== 200) {
    throw new Error(`Steadfast error: ${data.message ?? res.statusText}`)
  }

  const consignment = data.consignment
  const trackingCode = consignment.tracking_code ?? consignment.consignment_id

  return {
    courier: "steadfast",
    consignmentId: consignment.consignment_id,
    trackingCode,
    trackingUrl: `https://steadfast.com.bd/tracking?trackingCode=${trackingCode}`,
    rawResponse: data,
  }
}

// ─────────────────────────────────────────────
// PATHAO (SECONDARY)
// ─────────────────────────────────────────────

let pathaoToken: { value: string; expiresAt: number } | null = null

async function getPathaoToken(): Promise<string> {
  if (pathaoToken && pathaoToken.expiresAt > Date.now() + 60_000) {
    return pathaoToken.value
  }

  const res = await fetch("https://courier.pathao.com/aladdin/api/v1/issue-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.PATHAO_CLIENT_ID,
      client_secret: process.env.PATHAO_CLIENT_SECRET,
      username: process.env.PATHAO_USERNAME,
      password: process.env.PATHAO_PASSWORD,
      grant_type: "password",
    }),
  })

  if (!res.ok) throw new Error(`Pathao auth failed: ${res.statusText}`)
  const data = await res.json()
  pathaoToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  }
  return pathaoToken.value
}

export async function bookPathao(input: CourierBookingInput): Promise<BookingResult> {
  const storeId = process.env.PATHAO_STORE_ID
  if (!storeId) throw new Error("Pathao store ID not configured")

  const token = await getPathaoToken()

  const body = {
    store_id: parseInt(storeId, 10),
    merchant_order_id: input.orderNumber,
    recipient_name: input.recipientName,
    recipient_phone: input.recipientPhone,
    recipient_address: input.recipientAddress,
    recipient_city: 4, // 4 = Chittagong
    recipient_zone: parseInt(process.env.PATHAO_CHITTAGONG_ZONE_ID ?? "367", 10),
    delivery_type: 48, // normal delivery
    item_type: 2, // parcel
    item_quantity: 1,
    item_weight: input.weightKg ?? 0.5,
    amount_to_collect: input.codAmount,
    item_description: "Varito Solutions Order",
  }

  const res = await fetch("https://courier.pathao.com/aladdin/api/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(`Pathao error: ${data.message ?? res.statusText}`)

  const consignmentId = data.consignment_id ?? data.data?.consignment_id

  return {
    courier: "pathao",
    consignmentId,
    trackingCode: consignmentId,
    trackingUrl: `https://merchant.pathao.com/order-tracking/${consignmentId}`,
    rawResponse: data,
  }
}

// ─────────────────────────────────────────────
// REDX (TERTIARY)
// ─────────────────────────────────────────────

export async function bookRedX(input: CourierBookingInput): Promise<BookingResult> {
  const token = process.env.REDX_API_TOKEN
  if (!token) throw new Error("RedX API token not configured")

  const body = {
    name: input.recipientName,
    phone: input.recipientPhone,
    address: input.recipientAddress,
    merchant_invoice_id: input.orderNumber,
    cash_collection_amount: input.codAmount,
    parcel_weight: Math.round((input.weightKg ?? 0.5) * 1000), // grams
    instruction: input.note ?? "",
    value: input.codAmount,
  }

  const res = await fetch("https://openapi.redx.com.bd/v1.0.0-beta/parcel", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(`RedX error: ${data.message ?? res.statusText}`)

  const trackingId = data.tracking_id

  return {
    courier: "redx",
    consignmentId: String(data.parcel_id ?? trackingId),
    trackingCode: trackingId,
    trackingUrl: `https://redx.com.bd/track-parcel/?trackingId=${trackingId}`,
    rawResponse: data,
  }
}

// ─────────────────────────────────────────────
// DISPATCHER
// ─────────────────────────────────────────────

export async function bookCourier(
  courier: CourierName,
  input: CourierBookingInput
): Promise<BookingResult> {
  switch (courier) {
    case "steadfast":
      return bookSteadfast(input)
    case "pathao":
      return bookPathao(input)
    case "redx":
      return bookRedX(input)
  }
}
