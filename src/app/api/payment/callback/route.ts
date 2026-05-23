/**
 * @file api/payment/callback/route.ts
 * @description aamarPay redirect callback — user lands here after payment success/fail/cancel.
 *              Redirects to the order tracking page. Order status is authoritative
 *              only from the webhook, not from this URL.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const orderId = url.searchParams.get("order_id") ?? url.searchParams.get("mer_txnid")
  const status = url.searchParams.get("pay_status") ?? url.searchParams.get("status")

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ""

  if (!orderId) {
    return NextResponse.redirect(`${appUrl}/`)
  }

  // Resolve numeric ID to order number for the public tracking URL
  const numericId = parseInt(orderId, 10)
  if (isNaN(numericId)) {
    return NextResponse.redirect(`${appUrl}/`)
  }

  const [order] = await db
    .select({ orderNumber: orders.orderNumber })
    .from(orders)
    .where(eq(orders.id, numericId))
    .limit(1)

  if (!order) {
    return NextResponse.redirect(`${appUrl}/`)
  }

  // Always redirect to order tracking — the webhook has already updated status.
  const redirectUrl = new URL(`/order/${order.orderNumber}`, appUrl)

  if (status === "Failed" || status === "Cancelled") {
    redirectUrl.searchParams.set("payment", "failed")
  } else if (status === "Successful") {
    redirectUrl.searchParams.set("payment", "success")
  }

  return NextResponse.redirect(redirectUrl.toString())
}
