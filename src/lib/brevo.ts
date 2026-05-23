/**
 * @file brevo.ts
 * @description Brevo (SendinBlue) email client using the REST API.
 *              Handles transactional emails: order confirmation and shipping updates.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-22
 */

import { serverEnv } from "@/lib/env"

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"
const FROM_EMAIL = serverEnv.BREVO_SENDER_EMAIL ?? "noreply@varitosolutions.com"
const FROM_NAME = serverEnv.BREVO_SENDER_NAME ?? "Varito Solutions"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface EmailRecipient {
  email: string
  name?: string
}

interface SendEmailParams {
  to: EmailRecipient[]
  subject: string
  htmlContent: string
  textContent?: string
}

// ─────────────────────────────────────────────
// CORE SENDER
// ─────────────────────────────────────────────

/** Sends a transactional email via Brevo REST API. Throws on failure. */
async function sendEmail(params: SendEmailParams) {
  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "api-key": serverEnv.BREVO_API_KEY as string,
    },
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: params.to,
      subject: params.subject,
      htmlContent: params.htmlContent,
      textContent: params.textContent,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Brevo API error ${response.status}: ${error}`)
  }
}

// ─────────────────────────────────────────────
// TEMPLATES
// ─────────────────────────────────────────────

interface OrderConfirmationData {
  customerName: string
  customerEmail?: string
  customerPhone: string
  orderNumber: string
  items: { name: string; qty: number; price: number }[]
  subtotal: number
  deliveryCharge: number
  codFee: number
  total: number
  paymentMethod: string
  address: { district: string; thana: string; area?: string }
}

/** Sends order confirmation email to the customer. */
export async function sendOrderConfirmationEmail(data: OrderConfirmationData) {
  if (!data.customerEmail) return

  const itemsHtml = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #f0f0f0">${item.name}</td>
          <td style="padding:8px;border-bottom:1px solid #f0f0f0;text-align:center">${item.qty}</td>
          <td style="padding:8px;border-bottom:1px solid #f0f0f0;text-align:right">৳${item.price.toLocaleString()}</td>
        </tr>`
    )
    .join("")

  const paymentLabel =
    { cod: "Cash on Delivery", bkash: "bKash", nagad: "Nagad", card: "Card" }[
      data.paymentMethod
    ] ?? data.paymentMethod

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Order Confirmation</title></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333">
  <div style="background:#059669;padding:24px;text-align:center;border-radius:8px 8px 0 0">
    <h1 style="color:#fff;margin:0;font-size:24px">Order Confirmed!</h1>
    <p style="color:#d1fae5;margin:8px 0 0">Order #${data.orderNumber}</p>
  </div>
  <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none">
    <p>Dear ${data.customerName},</p>
    <p>Thank you for your order! We have received it and will process it shortly.</p>
    <h3 style="color:#059669">Order Details</h3>
    <table width="100%" cellpadding="0" cellspacing="0">
      <thead>
        <tr style="background:#f9fafb">
          <th style="padding:8px;text-align:left">Item</th>
          <th style="padding:8px;text-align:center">Qty</th>
          <th style="padding:8px;text-align:right">Price</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <div style="margin-top:16px;border-top:2px solid #059669;padding-top:16px">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span>Subtotal:</span><span>৳${data.subtotal.toLocaleString()}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span>Delivery:</span><span>৳${data.deliveryCharge.toLocaleString()}</span>
      </div>
      ${data.codFee > 0 ? `<div style="display:flex;justify-content:space-between;margin-bottom:8px"><span>COD Fee:</span><span>৳${data.codFee.toLocaleString()}</span></div>` : ""}
      <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:18px;margin-top:8px">
        <span>Total:</span><span style="color:#059669">৳${data.total.toLocaleString()}</span>
      </div>
    </div>
    <div style="margin-top:16px;padding:16px;background:#f9fafb;border-radius:8px">
      <p style="margin:0 0 8px;font-weight:bold">Delivery Address</p>
      <p style="margin:0;color:#6b7280">${data.address.district}, ${data.address.thana}${data.address.area ? `, ${data.address.area}` : ""}</p>
      <p style="margin:8px 0 0"><strong>Payment:</strong> ${paymentLabel}</p>
    </div>
    <p style="margin-top:24px;color:#6b7280;font-size:14px">
      Estimated delivery: 3-5 business days.<br>
      For support: WhatsApp us or call our customer service.
    </p>
  </div>
  <div style="text-align:center;padding:16px;color:#9ca3af;font-size:12px">
    Varito Solutions — Chattogram, Bangladesh
  </div>
</body>
</html>`

  await sendEmail({
    to: [{ email: data.customerEmail, name: data.customerName }],
    subject: `Order Confirmed: #${data.orderNumber} — Varito Solutions`,
    htmlContent: html,
  })
}

interface ShippingUpdateData {
  customerName: string
  customerEmail: string
  orderNumber: string
  status: string
  courierName?: string
  consignmentId?: string
}

/** Sends a shipping status update email to the customer. */
export async function sendShippingUpdateEmail(data: ShippingUpdateData) {
  const statusMessages: Record<string, string> = {
    confirmed: "Your order has been confirmed and is being prepared.",
    processing: "Your order is being packed and will be handed to courier soon.",
    shipped: "Your order is on its way!",
    delivered: "Your order has been delivered. Thank you for shopping with us!",
    cancelled: "Your order has been cancelled. If you have questions, please contact us.",
  }

  const message = statusMessages[data.status] ?? `Your order status has been updated to: ${data.status}`

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333">
  <div style="background:#059669;padding:24px;text-align:center;border-radius:8px 8px 0 0">
    <h1 style="color:#fff;margin:0;font-size:24px">Order Update</h1>
    <p style="color:#d1fae5;margin:8px 0 0">Order #${data.orderNumber}</p>
  </div>
  <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none">
    <p>Dear ${data.customerName},</p>
    <p>${message}</p>
    ${data.courierName ? `<p><strong>Courier:</strong> ${data.courierName}</p>` : ""}
    ${data.consignmentId ? `<p><strong>Tracking ID:</strong> ${data.consignmentId}</p>` : ""}
    <p style="color:#6b7280;font-size:14px">Questions? Contact us via WhatsApp.</p>
  </div>
  <div style="text-align:center;padding:16px;color:#9ca3af;font-size:12px">
    Varito Solutions — Chattogram, Bangladesh
  </div>
</body>
</html>`

  await sendEmail({
    to: [{ email: data.customerEmail, name: data.customerName }],
    subject: `Order Update: #${data.orderNumber} — ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}`,
    htmlContent: html,
  })
}
