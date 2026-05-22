---
name: aamarpay-integration
description: Integrate aamarPay payment gateway for Varito Solutions. Covers initiation, webhook verification, idempotency, COD flow, and sandbox testing. aamarPay is the ONLY payment provider used in this project.
risk: low
source: project
date_added: '2026-05-22'
---

# aamarPay Integration — Varito Solutions

> aamarPay is the chosen payment gateway for this project.
> It processes bKash, Nagad, Rocket, and credit/debit cards under one API.
> Sandbox URL:    `https://sandbox.aamarpay.com`
> Production URL: `https://secure.aamarpay.com`

---

## 1. How aamarPay Works (Flow)

```
Customer clicks "Pay with bKash"
        ↓
POST /api/payment/initiate  ← Claude builds this
        ↓
Server calls aamarPay → gets a redirect URL
        ↓
Customer redirected to aamarPay-hosted page (they enter bKash PIN)
        ↓
aamarPay calls POST /api/payment/webhook  ← Claude builds this
        ↓
Claude verifies signature, updates order, sends Brevo email
        ↓
Customer redirected back to /order/[id] (success or failure)
```

COD orders skip this entire flow — order is created immediately with `payment_status = 'pending_cod'`.

---

## 2. Payment Initiation (POST /api/payment/initiate)

### Request to aamarPay

```typescript
// POST to: https://sandbox.aamarpay.com/jsonpay.php (sandbox)
//          https://secure.aamarpay.com/jsonpay.php (production)

const payload = {
  store_id: process.env.AAMARPAY_STORE_ID,
  tran_id: order.orderNumber,        // Your unique transaction ID
  success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback?status=success`,
  fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback?status=fail`,
  cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback?status=cancel`,
  amount: order.total.toString(),
  currency: 'BDT',
  signature_key: process.env.AAMARPAY_SIGNATURE_KEY,
  desc: `Order ${order.orderNumber} — Varito Solutions`,
  cus_name: order.customerName,
  cus_email: order.customerEmail ?? 'noreply@varitosolutions.com',
  cus_add1: order.addressDistrict,
  cus_city: order.addressDistrict,
  cus_country: 'Bangladesh',
  cus_phone: order.customerPhone,
  type: 'json',                      // Always 'json' for API integration
}
```

### aamarPay Response

```typescript
// Success:
{ payment_url: "https://sandbox.aamarpay.com/paynow.php?track=xxx" }

// Error:
{ error: "Invalid store_id" }
```

Return the `payment_url` to the client as `redirectUrl`.

---

## 3. Webhook Handler (POST /api/payment/webhook)

aamarPay sends a POST to your webhook URL after payment completes (success or failure).

### Signature Verification (Critical — never skip)

```typescript
import crypto from 'crypto'

function verifyAamarPaySignature(payload: Record<string, string>, secretKey: string): boolean {
  const { hash, ...dataWithoutHash } = payload

  // Sort keys alphabetically, concatenate values with no separator
  const dataString = Object.keys(dataWithoutHash)
    .sort()
    .map(key => dataWithoutHash[key])
    .join('')

  const expectedHash = crypto
    .createHash('sha256')
    .update(dataString + secretKey)
    .digest('hex')

  // Timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(hash, 'hex'),
    Buffer.from(expectedHash, 'hex')
  )
}
```

### Webhook Payload Fields

```typescript
type AamarPayWebhook = {
  pg_txnid: string          // aamarPay's transaction ID
  mer_txnid: string         // Your tran_id (= order.orderNumber)
  risk_level: string        // "0" = low risk, ignore for now
  bank_txn: string          // Bank/bKash/Nagad transaction reference
  amount: string            // Amount charged as string
  store_amount: string      // Amount after aamarPay fees
  pay_status: string        // "Successful" | "Failed" | "Cancelled"
  status_code: string       // "2" = success, others = failure
  status_title: string      // Human-readable status
  pay_time: string          // Timestamp of payment
  currency: string          // "BDT"
  hash: string              // Signature to verify
}
```

### Full Webhook Handler Logic

```typescript
export async function POST(request: Request) {
  // 1. Return 200 fast — aamarPay retries if it doesn't get a response within 10 seconds
  //    Do NOT make this async/await heavy before responding
  const payload = await request.formData()  // aamarPay sends form data, not JSON
  const data = Object.fromEntries(payload.entries()) as AamarPayWebhook

  // 2. Verify signature immediately
  if (!verifyAamarPaySignature(data, process.env.AAMARPAY_SIGNATURE_KEY!)) {
    await logAuditEvent('webhook.signature_failed', { ip: getIP(request) })
    return Response.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // 3. Idempotency check — webhooks retry, don't process twice
  const order = await db.query.orders.findFirst({
    where: eq(orders.orderNumber, data.mer_txnid)
  })

  if (!order) return Response.json({ error: 'Order not found' }, { status: 404 })

  if (order.paymentStatus === 'paid') {
    return Response.json({ status: 'already_processed' })  // 200 to stop retries
  }

  // 4. Process based on status
  if (data.pay_status === 'Successful' && data.status_code === '2') {
    await db.update(orders).set({
      paymentStatus: 'paid',
      aamarPayTxnId: data.pg_txnid,
      aamarPayPaymentId: data.bank_txn,
      updatedAt: new Date(),
    }).where(eq(orders.id, order.id))

    // Send Brevo confirmation email (fire and forget — don't await)
    sendOrderConfirmationEmail(order).catch(console.error)

  } else {
    await db.update(orders).set({
      paymentStatus: 'failed',
      aamarPayTxnId: data.pg_txnid,
      updatedAt: new Date(),
    }).where(eq(orders.id, order.id))
  }

  return Response.json({ status: 'processed' })
}
```

> aamarPay sends webhook data as `application/x-www-form-urlencoded`, not JSON.
> Use `request.formData()` not `request.json()`.

---

## 4. COD Flow (No Gateway Involved)

```typescript
// In POST /api/orders when paymentMethod === 'cod':

// 1. Create order immediately
// 2. Set payment_status = 'pending_cod'
// 3. Do NOT call aamarPay at all
// 4. Return order confirmation to customer
// 5. Admin manually marks as paid via PATCH /api/admin/orders/[id]/payment
//    when delivery agent collects cash
```

COD surcharge: Always add ৳40 to the order total. This is non-negotiable — customers pay ৳40 extra for the convenience of COD.

---

## 5. Environment Variables

```bash
AAMARPAY_STORE_ID=your-store-id        # Get from aamarPay merchant dashboard
AAMARPAY_SIGNATURE_KEY=your-key        # Secret key for signature verification
AAMARPAY_MODE=sandbox                  # 'sandbox' | 'live'
```

Switch endpoint based on mode:
```typescript
const AAMARPAY_BASE = process.env.AAMARPAY_MODE === 'live'
  ? 'https://secure.aamarpay.com'
  : 'https://sandbox.aamarpay.com'
```

---

## 6. Sandbox Testing

Test payment methods in sandbox:
- **bKash test number:** 01611111111 (OTP: 123456)
- **Nagad test number:** 01511111111 (OTP: 123456)
- **Test card:** 4111111111111111 (any future expiry, any CVV)

Always test these scenarios:
1. Successful payment → `pay_status: 'Successful'`
2. Failed payment → `pay_status: 'Failed'`
3. User cancels → `pay_status: 'Cancelled'`
4. Duplicate webhook (replay the same webhook twice) → second call must be no-op

---

## 7. Critical Rules

- **Never** call `request.json()` on the webhook — it's form data
- **Never** process a webhook without verifying the signature
- **Never** trust the `amount` in the webhook — verify against DB order total
- **Always** return `200` to stop aamarPay retries, even on errors you handle
- **Always** use `timingSafeEqual` for signature comparison — prevents timing attacks
- **Always** check idempotency before updating payment status

---

## 8. Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Signature mismatch | Wrong key or payload modified | Re-check AAMARPAY_SIGNATURE_KEY, log the raw payload |
| Webhook not received | Callback URL not publicly accessible | Use ngrok in dev, ensure prod URL is correct |
| Double charge | No idempotency check | Check `paymentStatus === 'paid'` before updating |
| Form data parsed as JSON | Using `request.json()` | Switch to `request.formData()` |
