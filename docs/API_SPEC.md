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

### `[READY]` GET /api/products
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

### `[READY]` GET /api/products/[slug]
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

### `[READY]` GET /api/categories
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

### `[READY]` POST /api/orders
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

### `[READY]` GET /api/orders/[orderNumber]
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

### `[READY]` POST /api/payment/initiate
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

### `[READY]` POST /api/payment/webhook
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

### `[READY]` POST /api/auth/otp
Send OTP to phone number via Supabase.

**Request:** `{ phone: string }` (format: `+880XXXXXXXXXX`)  
**Response:** `{ data: { message: "OTP sent" } }`  
**Rate limit:** 5 requests per phone per 10 minutes  

### `[READY]` POST /api/auth/verify
Verify OTP and return session.

**Request:** `{ phone: string; otp: string }`  
**Response:** `{ data: { token: string; user: { id: string; phone: string } } }`  

---

## Public Routes — Content

### `[READY]` GET /api/banners
Get active banners for the homepage. Public, no auth.

**Query params:**
```
position   string   "hero" | "secondary" | "announcement" | omit for all
```

**Response:**
```typescript
{
  data: Banner[]
}

type Banner = {
  id: number
  title: string | null
  subtitle: string | null
  image: string           // R2 URL
  ctaText: string | null
  ctaUrl: string | null
  position: "hero" | "secondary" | "announcement"
  sortOrder: number
}
```

> Only returns banners where `is_active = true AND (starts_at IS NULL OR starts_at <= NOW()) AND (ends_at IS NULL OR ends_at > NOW())`.

---

### `[READY]` GET /api/flash-deal
Get the currently active flash deal. Public, no auth.

**Response:**
```typescript
{
  data: FlashDeal | null   // null if no active deal
}

type FlashDeal = {
  id: number
  flashPrice: number
  endsAt: string           // ISO timestamp — frontend uses for countdown
  remainingQty: number | null   // null = unlimited
  product: {
    id: number
    slug: string
    name: string
    nameBn: string | null
    image: string
    price: number           // original price (for "was ৳X" display)
  }
}
```

---

### `[READY]` POST /api/coupons/validate
Validate a coupon code and return the discount amount. Public, no auth required.

**Request:**
```typescript
{ code: string; cartTotal: number; userId?: string }
```

**Response (valid):**
```typescript
{
  data: {
    code: string
    type: "percentage" | "fixed"
    value: number
    discount: number       // Calculated discount in BDT
    finalTotal: number     // cartTotal - discount
  }
}
```

**Error cases:**
```
404 { error: "Coupon not found", code: "COUPON_NOT_FOUND" }
400 { error: "Coupon has expired", code: "COUPON_EXPIRED" }
400 { error: "Coupon is not yet active", code: "COUPON_NOT_ACTIVE" }
400 { error: "Coupon usage limit reached", code: "COUPON_EXHAUSTED" }
400 { error: "Cart total too low", code: "COUPON_MIN_ORDER", minOrder: number }
400 { error: "Already used this coupon", code: "COUPON_PER_USER_LIMIT" }
```

> Validation does NOT consume the coupon. Consumption happens in `POST /api/orders`.

---

## Admin Routes (Admin Auth Required)

All admin routes require header: `Authorization: Bearer <admin-jwt>`  
Role check reads from **database only** — never from JWT claims.  
`staff` role: general access. `super_admin` role: full access including restricted routes.

---

### Dashboard

### `[READY]` GET /api/admin/dashboard/stats
At-a-glance business summary. Both roles.

**Response:**
```typescript
{
  data: {
    today: { orders: number; revenue: number }
    thisWeek: { orders: number; revenue: number; vsLastWeek: number }  // vsLastWeek = % change
    thisMonth: { orders: number; revenue: number }
    pendingOrders: number           // status = 'pending' or 'confirmed'
    lowStockProducts: number        // stock < settings.low_stock_threshold
    recentOrders: OrderSummary[]    // last 10 orders
    topProducts: { productId: number; name: string; revenue: number }[]  // top 5 this week
    paymentBreakdown: { method: string; count: number; percentage: number }[]
  }
}
```

---

### Orders

### `[READY]` GET /api/admin/orders
List all orders with filters and pagination. Both roles.

**Query params:**
```
status         string   OrderStatus filter
paymentStatus  string   PaymentStatus filter
paymentMethod  string   "cod" | "bkash" | "nagad" | "card"
district       string   Filter by delivery district
search         string   Order number OR customer phone OR customer name
dateFrom       string   ISO date string
dateTo         string   ISO date string
cursor         string   Pagination cursor
limit          number   Default 20, max 100
sort           string   "newest" | "oldest" | "amount_high" | "amount_low"
```

**Response:**
```typescript
{
  data: OrderSummary[]
  nextCursor: string | null
  total: number
}

type OrderSummary = {
  id: number
  orderNumber: string
  status: OrderStatus
  paymentMethod: string
  paymentStatus: PaymentStatus
  total: number
  customerName: string
  customerPhone: string
  district: string
  createdAt: string
}
```

---

### `[READY]` GET /api/admin/orders/[id]
Full order detail. Both roles.

**Response:**
```typescript
{
  data: {
    id: number
    orderNumber: string
    status: OrderStatus
    paymentMethod: string
    paymentStatus: PaymentStatus
    subtotal: number
    deliveryCharge: number
    codFee: number
    discount: number
    total: number
    customerName: string
    customerPhone: string
    address: { district: string; thana: string; area: string; road: string; house: string; landmark: string }
    items: { name: string; sku: string; image: string; qty: number; unitPrice: number; total: number }[]
    notes: string | null
    adminNotes: string | null        // staff and super_admin can see this
    aamarPayTxnId: string | null
    courier: { name: string; consignmentId: string; trackingCode: string; status: string } | null
    history: { fromStatus: string; toStatus: string; changedBy: string; note: string; createdAt: string }[]
    createdAt: string
    updatedAt: string
    customer: { id: string; name: string; phone: string; totalOrders: number; totalSpent: number } | null
  }
}
```

---

### `[READY]` PATCH /api/admin/orders/[id]/status
Update order status and optionally add a note. Both roles.

**Request:**
```typescript
{ status: OrderStatus; note?: string }
```

**Response:** `{ data: { orderNumber: string; status: OrderStatus; updatedAt: string } }`

**Side effects:** Appends row to `order_history`. Logs to `audit_log`.

---

### `[READY]` PATCH /api/admin/orders/[id]/payment
Mark a COD order as paid/collected. Both roles.

**Request:**
```typescript
{ paymentStatus: "paid" | "failed"; note?: string }
```

**Restriction:** Only applies to `paymentMethod = 'cod'` orders. Returns `400` otherwise.

---

### `[READY]` PATCH /api/admin/orders/[id]/notes
Update internal admin notes (never visible to customer). Both roles.

**Request:** `{ adminNotes: string }`

---

### `[READY]` POST /api/admin/orders/[id]/courier
Book shipment with a courier. Both roles.

**Request:**
```typescript
{
  courier: "steadfast" | "pathao" | "redx"
  note?: string
}
```

**Server-side actions:**
1. Validate order status is `confirmed` or `processing`
2. Check no existing shipment for this order in `courier_shipments`
3. Call courier API (see `docs/skills/courier-integration.md`)
4. Insert row into `courier_shipments`
5. Update `orders.courier_name`, `orders.consignment_id`, `orders.courier_status`
6. Log to `audit_log`

**Response:**
```typescript
{ data: { consignmentId: string; trackingCode: string; courier: string } }
```

**Error:** `409 { error: "Shipment already booked", code: "SHIPMENT_EXISTS" }`

---

### `[READY]` POST /api/admin/orders/[id]/refund
Initiate refund via aamarPay. **Super Admin only.**

**Request:** `{ reason: string; amount?: number }` (omit amount = full refund)

**Response:** `{ data: { refundId: string; amount: number; status: string } }`

---

### `[READY]` GET /api/admin/orders/export
Export orders as CSV. **Super Admin only.**

**Query:** `dateFrom`, `dateTo`, `status` (same as list endpoint)

**Response:** `Content-Type: text/csv` with filename `orders-{dateFrom}-{dateTo}.csv`

**CSV columns:** Order Number, Date, Customer, Phone, District, Items, Total, Payment, Status, Courier, Tracking

---

### Products

### `[READY]` GET /api/admin/products
List all products including `cost_price`. Both roles.

**Query params:** `category`, `search`, `stockStatus` (`in_stock|low|out`), `isActive`, `isDeleted`, `cursor`, `limit`, `sort`

**Response:** Same as public `GET /api/products` **plus** `costPrice`, `marginPercent`, `totalOrders`, `deletedAt`

> `marginPercent` = `((price - costPrice) / price) * 100`. Only include for `super_admin`.

---

### `[READY]` POST /api/admin/products
Create product. Both roles.

**Request:**
```typescript
{
  name: string               // required
  nameBn?: string
  slug: string               // required, auto-generated suggestion is OK
  description: string        // required
  descriptionBn?: string
  categoryId: number         // required
  price: number              // required, > 0
  salePrice?: number         // must be < price if provided
  costPrice: number          // required (Super Admin can see margin; staff cannot)
  stock: number              // required, >= 0
  unit: "piece" | "roll" | "kg" | "meter" | "pack"  // default: piece
  minOrderQty: number        // default: 1
  sku: string                // required, unique
  images: string[]           // required, min 1, max 10 — R2 URLs (upload first)
  isFeatured?: boolean       // default: false
}
```

**Response:** `{ data: { id: number; slug: string; createdAt: string } }`

---

### `[READY]` GET /api/admin/products/[id]
Get single product with all fields. Both roles.

---

### `[READY]` PATCH /api/admin/products/[id]
Partial update. Only send fields that changed. Both roles.

**Restricted fields (Super Admin only):** `costPrice`, `isFeatured`
**Forbidden fields (use dedicated routes):** `stock` (use `/stock`), `deletedAt` (use DELETE/restore)

---

### `[READY]` DELETE /api/admin/products/[id]
Soft delete (sets `deleted_at`). **Super Admin only.**

---

### `[READY]` PATCH /api/admin/products/[id]/restore
Restore soft-deleted product. **Super Admin only.**

---

### `[READY]` PATCH /api/admin/products/[id]/stock
Quick stock adjustment. Both roles. Appends to `inventory_log`.

**Request:**
```typescript
{
  type: "manual_add" | "manual_subtract" | "correction"
  quantity: number     // Always positive — type determines direction
  reason: string       // Required
}
```

**Response:** `{ data: { productId: number; before: number; after: number } }`

---

### Upload

### `[READY]` POST /api/admin/upload
Upload image to Cloudflare R2. Both roles.

**Request:** `multipart/form-data` with `file` field  
**Processing:** Server-side `sharp` compression → WebP, max 1200px wide, quality 85  
**Response:** `{ data: { url: string; key: string } }`  
**Restrictions:** Max 5MB input, JPEG/PNG/WebP only. Output is always WebP.

---

### Categories

### `[READY]` GET /api/admin/categories
Full category tree including inactive and product counts. Both roles.

**Response:**
```typescript
{
  data: AdminCategory[]
}

type AdminCategory = {
  id: number
  name: string; nameBn: string | null; slug: string
  image: string | null
  sortOrder: number
  isActive: boolean
  isFeatured: boolean
  productCount: number
  children: AdminCategory[]
}
```

### `[READY]` POST /api/admin/categories
Create category. Both roles.

**Request:** `{ name: string; nameBn?: string; slug: string; parentId?: number; image?: string; sortOrder?: number; isFeatured?: boolean }`

### `[READY]` PATCH /api/admin/categories/[id]
Update category. Both roles. Partial update.

### `[READY]` DELETE /api/admin/categories/[id]
Deactivate category (`is_active = false`). **Does not delete if it has products.** Returns `409` if products exist.

### `[READY]` PATCH /api/admin/categories/reorder
Bulk update `sort_order`. Both roles.

**Request:** `{ items: { id: number; sortOrder: number }[] }`

---

### Customers

### `[READY]` GET /api/admin/customers
List customers. Both roles.

**Query:** `search` (phone or name), `status` (`active|banned`), `dateFrom`, `dateTo`, `cursor`, `limit`

**Response:**
```typescript
{
  data: {
    id: string; phone: string; name: string | null
    orderCount: number; totalSpent: number
    lastOrderAt: string | null
    isBanned: boolean; createdAt: string
  }[]
  nextCursor: string | null; total: number
}
```

### `[READY]` GET /api/admin/customers/[id]
Customer detail + full order history. Both roles.

**Response:** Customer profile + `orders: OrderSummary[]` + `addresses: Address[]`

### `[READY]` PATCH /api/admin/customers/[id]/ban
Ban customer. **Super Admin only.**

**Request:** `{ reason: string }`

**Side effects:** Sets `is_banned = true`, `banned_at`, `ban_reason`, `banned_by`. Logs to `audit_log`.

### `[READY]` PATCH /api/admin/customers/[id]/unban
Unban customer. **Super Admin only.**

**Side effects:** Sets `is_banned = false`, clears `ban_reason`. Logs to `audit_log`.

---

### Analytics

All analytics routes: Both roles. All query `dateFrom`/`dateTo` or a `period` param.

### `[READY]` GET /api/admin/analytics/revenue
See `docs/ANALYTICS.md §4` for full response shape.

### `[READY]` GET /api/admin/analytics/orders
See `docs/ANALYTICS.md §4` for full response shape.

### `[READY]` GET /api/admin/analytics/products
**Query:** `period` = `7d` | `30d` | `90d`. See `docs/ANALYTICS.md §4`.

### `[READY]` GET /api/admin/analytics/customers
See `docs/ANALYTICS.md §4` for full response shape.

### `[READY]` GET /api/admin/analytics/inventory
Includes `totalStockValue` (cost_price × stock). **Super Admin only for this field**.

---

### Banners & Content

### `[READY]` GET /api/admin/banners
All banners including inactive. Both roles.

### `[READY]` POST /api/admin/banners
Create banner. Both roles.

**Request:**
```typescript
{
  title?: string; subtitle?: string
  image: string              // R2 URL (upload first)
  ctaText?: string; ctaUrl?: string
  position: "hero" | "secondary" | "announcement"
  sortOrder?: number; isActive?: boolean
  startsAt?: string; endsAt?: string   // ISO timestamps
}
```

### `[READY]` PATCH /api/admin/banners/[id]
Update banner. Both roles. Partial update.

### `[READY]` DELETE /api/admin/banners/[id]
Hard delete banner. Both roles.

### `[READY]` PATCH /api/admin/banners/reorder
Bulk sort_order update. Both roles.

**Request:** `{ items: { id: number; sortOrder: number }[] }`

---

### Flash Deals

### `[READY]` GET /api/admin/flash-deals
List all flash deals (including past). Both roles.

### `[READY]` POST /api/admin/flash-deals
Create flash deal. Both roles.

**Request:**
```typescript
{
  productId: number
  flashPrice: number    // must be < product.price (validated server-side)
  startsAt: string      // ISO timestamp
  endsAt: string        // ISO timestamp, must be > startsAt
  maxQty?: number       // null = unlimited
}
```

**Validation:** Only one deal can be active (overlapping time range returns `409`).

### `[READY]` PATCH /api/admin/flash-deals/[id]
Update deal. Both roles. Can deactivate early by setting `isActive = false`.

---

### Coupons (Super Admin only)

### `[READY]` GET /api/admin/coupons
List coupons with `usedCount` and usage percentage. **Super Admin only.**

### `[READY]` POST /api/admin/coupons
Create coupon. **Super Admin only.**

**Request:**
```typescript
{
  code: string               // Uppercase, unique
  type: "percentage" | "fixed"
  value: number
  minOrder?: number
  maxDiscount?: number       // percentage type only
  usageLimit?: number
  perUserLimit?: number
  startsAt?: string
  expiresAt?: string
}
```

### `[READY]` PATCH /api/admin/coupons/[id]
Update coupon (cannot change `used_count`). **Super Admin only.**

### `[READY]` DELETE /api/admin/coupons/[id]
Deactivate coupon (`is_active = false`). Does not delete. **Super Admin only.**

---

### Inventory

### `[READY]` GET /api/admin/inventory
Stock levels for all products. Both roles.

**Query:** `search`, `stockStatus` (`in_stock|low|out`), `category`, `cursor`, `limit`

### `[READY]` POST /api/admin/inventory/adjust
Manual stock adjustment. Appends to `inventory_log`. Both roles.

**Request:** `{ productId: number; type: "manual_add"|"manual_subtract"|"correction"; quantity: number; reason: string }`

> This calls the same logic as `PATCH /api/admin/products/[id]/stock` — use either.

### `[READY]` GET /api/admin/inventory/log
Full stock adjustment history. Both roles.

**Query:** `productId`, `type`, `dateFrom`, `dateTo`, `cursor`, `limit`

### `[READY]` GET /api/admin/inventory/export
CSV export. **Super Admin only.**

---

### Settings (Super Admin only)

### `[READY]` GET /api/admin/settings
Returns all settings as a typed key-value object. **Super Admin only.**

**Response:**
```typescript
{
  data: {
    deliveryCharge: number        // default: 60
    freeDeliveryThreshold: number // default: 0 (disabled)
    codFee: number                // default: 40
    lowStockThreshold: number     // default: 10
    deliveryDaysMin: number       // default: 3
    deliveryDaysMax: number       // default: 5
    storeName: string
    storePhone: string
    storeWhatsapp: string
    storeAddress: string
    storeEmail: string
    paymentCodEnabled: boolean
    paymentBkashEnabled: boolean
    paymentNagadEnabled: boolean
    paymentCardEnabled: boolean
    aamarpayMode: "sandbox" | "live"
    maintenanceMode: boolean
    maintenanceMessage: string
    notificationEmail: string
  }
}
```

### `[READY]` PATCH /api/admin/settings
Partial update. Only send changed keys. **Super Admin only.**

**Side effects:** Before/after logged to `audit_log` for every changed key.

---

### Admin Users (Super Admin only)

### `[READY]` GET /api/admin/users
List all admin users (role != 'customer'). **Super Admin only.**

**Response:**
```typescript
{
  data: {
    id: string; phone: string; name: string | null
    role: "staff" | "super_admin"
    isActive: boolean; lastLoginAt: string | null; createdAt: string
  }[]
}
```

### `[READY]` POST /api/admin/users
Create admin account. **Super Admin only.**

**Request:** `{ phone: string; name: string; role: "staff" | "super_admin" }`

**Side effects:** Creates Supabase Auth user, creates row in `users` table with role. Logs to `audit_log`.

### `[READY]` PATCH /api/admin/users/[id]
Update role or deactivate. **Super Admin only.**

**Request:** `{ role?: "staff" | "super_admin"; isActive?: boolean }`

**Restriction:** Cannot deactivate yourself. Returns `403` if `id === currentAdminId`.

---

### Audit Log (Super Admin only)

### `[READY]` GET /api/admin/audit-log
Paginated audit entries. **Super Admin only.**

**Query:** `adminId`, `action`, `entityType`, `entityId`, `dateFrom`, `dateTo`, `cursor`, `limit`

**Response:**
```typescript
{
  data: {
    id: number
    admin: { id: string; name: string; phone: string }
    action: string; entityType: string; entityId: string
    changes: { before?: object; after?: object }
    ipAddress: string; userAgent: string; createdAt: string
  }[]
  nextCursor: string | null; total: number
}
```

---

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
| `FORBIDDEN` | 403 | Authenticated but insufficient role |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
| `VALIDATION_ERROR` | 400 | Zod schema validation failed — includes `details` field |
| `COUPON_NOT_FOUND` | 404 | Coupon code does not exist |
| `COUPON_EXPIRED` | 400 | Coupon past expiry date |
| `COUPON_NOT_ACTIVE` | 400 | Coupon not yet started |
| `COUPON_EXHAUSTED` | 400 | Usage limit reached |
| `COUPON_MIN_ORDER` | 400 | Cart total below minimum order for coupon |
| `COUPON_PER_USER_LIMIT` | 400 | User has already used this coupon max times |
| `SHIPMENT_EXISTS` | 409 | Order already has an active courier booking |
| `CATEGORY_HAS_PRODUCTS` | 409 | Cannot delete category that has products |
| `FLASH_DEAL_CONFLICT` | 409 | Another deal is active in the same time window |
| `INVALID_FLASH_PRICE` | 400 | Flash price must be less than regular price |
| `CANNOT_SELF_DEACTIVATE` | 403 | Admin cannot deactivate their own account |

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
