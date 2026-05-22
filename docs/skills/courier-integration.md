---
name: courier-integration
description: Integrate Steadfast, Pathao, and RedX courier APIs for Varito Solutions. Covers parcel booking, status tracking, and reconciliation. Steadfast is the primary courier.
risk: low
source: project
date_added: '2026-05-22'
---

# Courier Integration — Varito Solutions

> Three couriers supported: **Steadfast** (primary), **Pathao** (secondary), **RedX** (tertiary).
> Admin selects which courier to use per-order in `/admin/orders/[id]`.
> All bookings are stored in `courier_shipments` table.

---

## 1. Steadfast (Primary — Use This First)

**Why primary:** Best API, most reliable in Chittagong, popular with BD f-commerce sellers.

**Base URL:** `https://portal.steadfast.com.bd/api/v1`

**Auth:** API Key in header — `Api-Key: {STEADFAST_API_KEY}` + `Api-Secret: {STEADFAST_API_SECRET}`

### Book a Parcel

```
POST /api/v1/create_order
Headers: Api-Key, Api-Secret, Content-Type: application/json

Request body:
{
  "invoice": "VR-2026-00001",          // Your order number
  "recipient_name": "Customer Name",
  "recipient_phone": "01712345678",
  "recipient_address": "House 12, Road 5, Agrabad, Chattogram",
  "cod_amount": 1299,                  // Full order total for COD, 0 for prepaid
  "note": "Handle with care",          // Optional
  "weight": 0.5                        // KG, optional — defaults to 0.5
}

Response:
{
  "status": 200,
  "message": "Parcel created successfully",
  "consignment": {
    "consignment_id": "STCS00000001",
    "tracking_code": "STCS00000001",
    "invoice": "VR-2026-00001",
    "recipient_name": "Customer Name",
    "recipient_phone": "01712345678",
    "status": "In_Review",
    "cod_amount": 1299
  }
}
```

### Check Parcel Status

```
GET /api/v1/status_by_trackingcode/{tracking_code}
Headers: Api-Key, Api-Secret

Response:
{
  "status": 200,
  "delivery_status": "in_review" | "waiting_to_pick" | "picked" | "in_transit" | "delivered" | "partial_delivered" | "cancelled" | "hold" | "in_return_process" | "partial_returned" | "returned" | "damaged"
}
```

### Steadfast Status → Varito Order Status Mapping

| Steadfast Status | Varito `orders.status` | Varito `courier_shipments.status` |
|-----------------|----------------------|----------------------------------|
| in_review | processing | in_review |
| waiting_to_pick | processing | waiting_pickup |
| picked | shipped | picked |
| in_transit | shipped | in_transit |
| delivered | delivered | delivered |
| partial_delivered | delivered | partial_delivered |
| cancelled | cancelled | cancelled |
| returned | returned | returned |
| damaged | cancelled | damaged |

---

## 2. Pathao (Secondary)

**Why secondary:** Strong coverage in Dhaka + Chittagong, popular with larger sellers.

**Base URL:** `https://courier.pathao.com/aladdin/api/v1`

**Auth:** OAuth2 token flow — exchange credentials for access token (expires hourly).

### Get Access Token

```
POST /aladdin/api/v1/issue-token
Body: {
  "client_id": {PATHAO_CLIENT_ID},
  "client_secret": {PATHAO_CLIENT_SECRET},
  "username": {PATHAO_USERNAME},
  "password": {PATHAO_PASSWORD},
  "grant_type": "password"
}

Response: { "access_token": "xxx", "expires_in": 3600, "token_type": "Bearer" }
```

> Cache this token — don't request a new one for every API call.
> Store in memory (process-level) with expiry check. If expired, re-authenticate.

### Book a Parcel

```
POST /aladdin/api/v1/orders
Authorization: Bearer {access_token}
Content-Type: application/json

Request body:
{
  "store_id": 12345,                   // Your Pathao store ID (from merchant dashboard)
  "merchant_order_id": "VR-2026-00001",
  "recipient_name": "Customer Name",
  "recipient_phone": "01712345678",
  "recipient_address": "Detailed address",
  "recipient_city": 4,                 // City ID (4 = Chittagong — get full list from API)
  "recipient_zone": 367,               // Zone ID — get from GET /aladdin/api/v1/city/{city_id}/zone-list
  "recipient_area": 5678,              // Area ID — get from GET /aladdin/api/v1/zone/{zone_id}/area-list
  "delivery_type": 48,                 // 48 = normal delivery, 12 = express
  "item_type": 2,                      // 2 = parcel
  "item_quantity": 1,
  "item_weight": 0.5,
  "amount_to_collect": 1299,           // COD amount (0 for prepaid)
  "item_description": "Sanitary items"
}

Response: { "consignment_id": "CTG00000001", "order_status": "Pending" }
```

> Pathao requires city/zone/area IDs — not free-text. You must call their reference APIs
> to get the correct IDs for Chittagong. Fetch these once and cache them.

---

## 3. RedX (Tertiary)

**Why tertiary:** Simpler API, good for rural coverage.

**Base URL:** `https://openapi.redx.com.bd/v1.0.0-beta`

**Auth:** Bearer token in header — `Authorization: Bearer {REDX_API_TOKEN}`

### Book a Parcel

```
POST /parcel
Authorization: Bearer {REDX_API_TOKEN}
Content-Type: application/json

Request body:
{
  "name": "Customer Name",
  "phone": "01712345678",
  "address": "Full delivery address, Chittagong",
  "merchant_invoice_id": "VR-2026-00001",
  "cash_collection_amount": 1299,       // 0 for prepaid
  "parcel_weight": 500,                 // grams
  "instruction": "Handle with care",    // Optional
  "value": 1299                         // Declared parcel value for insurance
}

Response:
{
  "tracking_id": "RXXXXXXXXXXX",
  "parcel_id": 123456
}
```

---

## 4. Implementation in `POST /api/admin/orders/[id]/courier`

```typescript
// Pseudocode — Claude implements the real version

async function bookCourier(orderId: number, courier: 'steadfast' | 'pathao' | 'redx') {
  const order = await db.query.orders.findFirst({ where: eq(orders.id, orderId) })

  // Guard: only confirmed/processing orders can be shipped
  if (!['confirmed', 'processing'].includes(order.status)) {
    return { error: 'Order must be confirmed before booking courier', code: 'INVALID_STATUS' }
  }

  // Guard: idempotency — one shipment per order
  const existing = await db.query.courierShipments.findFirst({
    where: eq(courierShipments.orderId, orderId)
  })
  if (existing) {
    return { error: 'Shipment already booked', code: 'SHIPMENT_EXISTS' }
  }

  // Call the chosen courier
  let result
  if (courier === 'steadfast') result = await bookSteadfast(order)
  else if (courier === 'pathao') result = await bookPathao(order)
  else result = await bookRedX(order)

  // Insert courier_shipments row
  await db.insert(courierShipments).values({
    orderId, courier,
    consignmentId: result.consignmentId,
    trackingCode: result.trackingCode,
    status: 'booked',
    bookedBy: adminId,
    rawResponse: result.rawResponse,
  })

  // Update the order
  await db.update(orders).set({
    courierName: courier,
    consignmentId: result.consignmentId,
    courierStatus: 'booked',
    status: 'processing',  // or 'shipped' depending on when pickup happens
  }).where(eq(orders.id, orderId))

  // Audit log
  await logAuditEvent(adminId, 'order.courier_booked', 'order', String(orderId), {
    after: { courier, consignmentId: result.consignmentId }
  }, request)
}
```

---

## 5. COD Amount Logic

| Payment Method | `cod_amount` / `amount_to_collect` |
|----------------|-------------------------------------|
| COD | `order.total` (full amount including COD fee) |
| bKash/Nagad/Card | `0` (already paid online) |

Never send COD amount for pre-paid orders — courier agents will attempt to collect and confuse the customer.

---

## 6. Tracking for Customers

Public order tracking (`GET /api/orders/[orderNumber]`) should include:
```typescript
courier: {
  name: "Steadfast",
  trackingCode: "STCS00000001",
  trackingUrl: "https://steadfast.com.bd/tracking?trackingCode=STCS00000001"
}
```

**Tracking URLs:**
- Steadfast: `https://steadfast.com.bd/tracking?trackingCode={code}`
- Pathao: `https://merchant.pathao.com/order-tracking/{consignment_id}`
- RedX: `https://redx.com.bd/track-parcel/?trackingId={tracking_id}`

---

## 7. Environment Variables Needed

```bash
STEADFAST_API_KEY=xxx
STEADFAST_API_SECRET=xxx
PATHAO_CLIENT_ID=xxx
PATHAO_CLIENT_SECRET=xxx
PATHAO_USERNAME=your@email.com
PATHAO_PASSWORD=yourpassword
REDX_API_TOKEN=xxx
```

See `docs/ENV_VARS.md` for where to get each key.

---

## 8. Do Not Implement Webhooks From Couriers (Yet)

Steadfast and Pathao offer webhook callbacks for status updates. **Skip this for launch.**
Instead, the admin manually syncs status by checking the order in the courier's dashboard
and updating it in the admin panel via `PATCH /api/admin/orders/[id]/status`.

Add webhook callbacks in Phase 5 after volume justifies automation.
