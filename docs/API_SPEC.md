# API_SPEC.md — Varito Solutions
## API Contract | Claude Agent Implements | Gemini Agent Consumes

> **CLAUDE AGENT:** Implement every route exactly as specified here. Mark `[READY]` when done.
> **GEMINI AGENT:** Only call APIs marked `[READY]`. Check this file before using any API.
> Status: `[ ]` not built | `[/]` in progress | `[READY]` complete and tested

---

## Base URL & Headers

```
Production: https://yourdomain.com/api
Local:      http://localhost:3000/api

Content-Type: application/json
Authorization: Bearer <supabase-jwt-token>   (for authenticated routes)
```

## Standard Response Format

```typescript
// Success
{ "data": T, "message"?: string }

// Error
{ "error": string, "code": string }

// Paginated
{ "data": T[], "nextCursor": string | null, "total"?: number }
```

---

## Public Routes (No Auth Required)

### `[ ]` GET /api/products
List products with pagination, filtering, and search.

**Query params:**
```
category    string   Filter by category slug
search      string   Full-text search (name + name_bn)
minPrice    number   Minimum price in BDT
maxPrice    number   Maximum price in BDT
sort        string   "price_asc" | "price_desc" | "newest" | "popular"
cursor      string   Pagination cursor (for next page)
limit       number   Items per page (default: 20, max: 50)
```

**Response:**
```typescript
{
  data: Product[]
  nextCursor: string | null
  total: number
}

type Product = {
  id: string
  slug: string
  name: string
  nameBn: string
  price: number
  salePrice: number | null
  images: string[]      // R2 URLs
  stock: number
  category: { id: string; name: string; slug: string }
  isNew: boolean        // true if created < 7 days ago
  discountPercent: number | null
}
// NOTE: Never include cost_price in this response
```

---

### `[ ]` GET /api/products/[slug]
Get single product by slug.

**Response:**
```typescript
{
  data: ProductDetail
}

type ProductDetail = {
  id: string
  slug: string
  name: string
  nameBn: string
  description: string
  descriptionBn: string
  price: number
  salePrice: number | null
  images: string[]
  stock: number
  unit: string          // e.g., "piece", "roll", "kg"
  minOrderQty: number
  category: { id: string; name: string; slug: string; parent?: {...} }
  sku: string
  isNew: boolean
  discountPercent: number | null
}
```

**Error:** `404 { error: "Product not found", code: "PRODUCT_NOT_FOUND" }`

---

### `[ ]` GET /api/categories
Get category tree.

**Response:**
```typescript
{
  data: Category[]
}

type Category = {
  id: string
  name: string
  nameBn: string
  slug: string
  image: string
  productCount: number
  children?: Category[]
}
```

---

## Order Routes

### `[ ]` POST /api/orders
Create a new order. Works for both guests and authenticated users.

**Request body:**
```typescript
{
  items: [{ productId: string; qty: number }]
  address: {
    name: string
    phone: string           // Must match: /^01[3-9]\d{8}$/
    district: string
    thana: string
    area: string
    road?: string
    house?: string
    landmark?: string
  }
  paymentMethod: "cod" | "bkash" | "nagad" | "card"
  couponCode?: string
  notes?: string
}
```

**Response:**
```typescript
{
  data: {
    orderId: string
    orderNumber: string     // e.g., "VR-2026-00001"
    total: number
    deliveryCharge: number
    codFee: number          // 40 for COD, 0 for others
    paymentRedirectUrl?: string  // Only for bkash/nagad/card
    paymentMethod: string
    status: "pending" | "pending_payment"
  }
}
```

**Server-side must:**
1. Verify all products exist and are in stock
2. Calculate price server-side (never trust client price)
3. Add ৳40 COD fee if paymentMethod === "cod"
4. For bKash/Nagad/Card: call aamarPay, return redirect URL
5. Send Brevo order confirmation email
6. Decrement stock immediately

---

### `[ ]` GET /api/orders/[orderNumber]
Get order status by order number (public, no auth — uses order number as token).

**Response:**
```typescript
{
  data: {
    orderNumber: string
    status: OrderStatus
    paymentStatus: PaymentStatus
    items: [{ name: string; qty: number; price: number; image: string }]
    total: number
    address: { name: string; district: string; thana: string }
    createdAt: string
    estimatedDelivery?: string
  }
}

type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
type PaymentStatus = "pending" | "pending_cod" | "paid" | "failed" | "refunded"
```

---

## Payment Routes

### `[ ]` POST /api/payment/initiate
Start aamarPay payment session.

**Request:**
```typescript
{ orderId: string; method: "bkash" | "nagad" | "card" }
```

**Response:**
```typescript
{ data: { redirectUrl: string } }
```

---

### `[ ]` POST /api/payment/webhook
aamarPay webhook. **MUST verify signature before processing.**

**Internal — aamarPay calls this directly.**

**Logic:**
1. Verify `AAMARPAY_SIGNATURE_KEY` hash
2. If payment confirmed → update order `payment_status = "paid"`
3. If payment failed → update order `payment_status = "failed"`
4. Send Brevo confirmation email on success
5. Return `200 OK` to aamarPay immediately (within 10 seconds)

---

## Auth Routes

### `[ ]` POST /api/auth/otp
Send OTP to phone number via Supabase.

**Request:** `{ phone: string }` (format: `+880XXXXXXXXXX`)  
**Response:** `{ data: { message: "OTP sent" } }`  
**Rate limit:** 5 requests per phone per 10 minutes  

### `[ ]` POST /api/auth/verify
Verify OTP and return session.

**Request:** `{ phone: string; otp: string }`  
**Response:** `{ data: { token: string; user: { id: string; phone: string } } }`  

---

## Admin Routes (Admin Auth Required)

All admin routes require header: `Authorization: Bearer <admin-jwt>`  
Admin check: user must have `role = "admin"` in database.

### `[ ]` GET /api/admin/orders
List all orders with filters.

**Query:** `status`, `paymentStatus`, `cursor`, `limit`, `dateFrom`, `dateTo`

### `[ ]` PATCH /api/admin/orders/[id]
Update order status.

**Request:** `{ status: OrderStatus; note?: string }`

### `[ ]` GET /api/admin/products
List all products (includes cost_price, stock levels).

### `[ ]` POST /api/admin/products
Create product.

**Request:**
```typescript
{
  name: string; nameBn: string; slug: string
  description: string; descriptionBn?: string
  categoryId: string
  price: number; salePrice?: number; costPrice: number
  stock: number; unit: string; minOrderQty: number
  images: string[]    // R2 URLs (already uploaded)
  sku: string
}
```

### `[ ]` PATCH /api/admin/products/[id]
Update product. (Partial update — only send changed fields)

### `[ ]` DELETE /api/admin/products/[id]
Soft delete (sets `deleted_at`, does not remove from DB).

### `[ ]` POST /api/admin/upload
Upload image to Cloudflare R2.

**Request:** `multipart/form-data` with `file` field  
**Response:** `{ data: { url: string; key: string } }`  
**Restrictions:** Max 5MB, JPEG/PNG/WebP only  

---

## Error Codes Reference

| Code | HTTP | Description |
|------|------|-------------|
| `PRODUCT_NOT_FOUND` | 404 | Product doesn't exist or is deleted |
| `OUT_OF_STOCK` | 400 | One or more items not in stock |
| `INVALID_PHONE` | 400 | Phone number format invalid |
| `INVALID_AMOUNT` | 400 | Order total mismatch (price change) |
| `PAYMENT_FAILED` | 402 | Payment gateway returned failure |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT token |
| `FORBIDDEN` | 403 | Authenticated but not admin |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Data Types (Shared — `src/types/`)

```typescript
// src/types/order.ts
export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
export type PaymentStatus = "pending" | "pending_cod" | "paid" | "failed" | "refunded"
export type PaymentMethod = "cod" | "bkash" | "nagad" | "card"

// src/types/product.ts  
export interface Product { ... }       // See GET /api/products response
export interface ProductDetail { ... } // See GET /api/products/[slug] response

// src/types/category.ts
export interface Category { ... }      // See GET /api/categories response
```

---

*Claude agent: Mark each route [READY] when implemented and tested.*
*Gemini agent: Only use [READY] routes in UI components.*
