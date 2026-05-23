# QA.md — Varito Solutions Comprehensive Quality Assurance
## Full QA Session — Claude Backend Agent (Sole Conductor)

> **Claude runs this entire session alone.**
> **Read every section. Run every command. Do not self-certify without executing the check.**
> **Fix every ❌ found in the same session — do not defer critical issues.**
> **Scope: 212 source files, 52 API routes, 45 pages, 77 components, full security surface.**

---

## How to Run This Session

### Order of Operations

```
1. §1  → Build health (must be clean before anything else)
2. §2  → Database schema integrity
3. §3  → Every API route: auth, validation, response shape
4. §4  → Security audit (hardest section — don't rush it)
5. §5  → Payment and courier flows
6. §6  → Email integration
7. §7  → Frontend pages: real API wiring vs mock data
8. §8  → Admin panel: real API wiring vs mock data
9. §9  → Design system compliance (grep-based, no visual check needed)
10. §10 → Mobile layout (visual check at 375px in browser)
11. §11 → Accessibility (structural checks only)
12. §12 → Bangladesh-specific correctness
13. §13 → End-to-end flows (against seeded DB)
14. §14 → Analytics events
15. §15 → Final launch checklist
16. §16 → Sign-off
```

### Report Format for Each Section

```
## §N — [Section Name]
Status: ✅ PASS | ❌ FAIL | ⚠️ PARTIAL

Issues found and fixed:
1. [file:line] — what was wrong → what was changed

Issues found, still open (with reason):
1. [file:line] — what is wrong → blocked by: [reason]

Verified clean:
- ✓ item
- ✓ item
```

### Start Commands (Run These First)

```bash
npx tsc --noEmit 2>&1
npm run lint 2>&1
npm run build 2>&1
grep -rn "console\.log" src/app/api src/lib --include="*.ts"
grep -rn ": any" src/app/api src/lib --include="*.ts"
grep -rn "MOCK_\|mockData\|\bconst MOCK" src/app --include="*.tsx" --include="*.ts"
```
All must be clean before proceeding.

---

## §1 — Build Health

### 1.1 TypeScript
```bash
npx tsc --noEmit 2>&1
```
- [ ] Exit code 0
- [ ] No suppressions hiding real errors (`@ts-ignore`, `@ts-expect-error`)
- [ ] No `as any` casts in route handlers or lib files

### 1.2 ESLint
```bash
npm run lint 2>&1
```
- [ ] Exit code 0, zero warnings
- [ ] No unused imports in any API route file
- [ ] No `console.log` anywhere in `src/app/api/` or `src/lib/`

### 1.3 Production Build
```bash
npm run build 2>&1
```
- [ ] Completes without errors
- [ ] No missing `key` props warnings converted to errors
- [ ] No dynamic server usage in statically rendered routes
- [ ] Check: any page using `cookies()` or `headers()` is correctly marked dynamic

### 1.4 Package Scripts
```bash
cat package.json | python3 -c "import json,sys; s=json.load(sys.stdin)['scripts']; [print(k,':',v) for k,v in s.items()]"
```
- [ ] `db:generate` → `drizzle-kit generate`
- [ ] `db:migrate` → `drizzle-kit migrate`
- [ ] `db:studio` → `drizzle-kit studio`
- [ ] `type-check` → `tsc --noEmit`

### 1.5 Environment Variable Validation
```bash
cat src/lib/env.ts
```
- [ ] Every required env var is validated at startup (Zod or manual throw)
- [ ] Missing var throws with a clear message (not silent undefined)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` present and validated
- [ ] No `NEXT_PUBLIC_*` variable exposes a secret key

---

## §2 — Database Schema

### 2.1 Table Inventory
```bash
grep "^export const" src/db/schema.ts
```
Required exports — verify all present:
- [ ] `categories` — `parentId` self-ref FK, `sortOrder`, `isActive`, `isFeatured`
- [ ] `products` — `costPrice`, `totalOrders`, `deletedAt`, `sku` unique
- [ ] `users` — UUID `id`, `supabaseId`, `role`, `isBanned` boolean, `banReason` text
- [ ] `addresses`
- [ ] `orders` — `customerName`, `customerPhone`, `addressDistrict`, `addressThana`, `addressArea`, `addressRoad`, `addressHouse`, `addressLandmark`
- [ ] `orderItems` — `productName`, `productSku`, `productImage`, `unitPrice`, `total` (NOT `subtotal`)
- [ ] `orderHistory` — `toStatus`, `fromStatus`, `changedBy` UUID
- [ ] `productReviews`
- [ ] `banners` — `ctaUrl`, `position`, `startsAt`, `endsAt`
- [ ] `coupons` — `type`, `value`, `minOrder`, `maxDiscount`, `usageLimit`, `perUserLimit`
- [ ] `couponUses` — `discount` field
- [ ] `settings`
- [ ] `inventoryLog` — `type`, `quantity`, `before`, `after`, `changedBy` UUID
- [ ] `auditLog` — `adminId` UUID, `changes` jsonb
- [ ] `flashDeals` — `flashPrice`, `maxQty`, `soldQty`, `startsAt`, `endsAt`

### 2.2 Type Consistency Checks
```bash
grep -n "changedBy\|adminId\|createdBy\|updatedBy" src/db/schema.ts
```
- [ ] All UUID FK columns reference `users.id` (which is UUID, not serial)
- [ ] `inventoryLog.changedBy` → UUID (matches `admin.userId` from `requireAdmin`)
- [ ] `auditLog.adminId` → UUID
- [ ] `flashDeals.createdBy` → UUID
- [ ] `orderHistory.changedBy` → UUID

### 2.3 Public Route Field Safety
```bash
# costPrice must NOT appear in these select() calls
grep -n "costPrice" \
  src/app/api/products/route.ts \
  "src/app/api/products/[slug]/route.ts" \
  src/app/api/orders/route.ts
```
- [ ] Zero matches in all public route files

```bash
# categories has NO deletedAt — must not filter on it
grep -n "deletedAt" src/app/api/categories/route.ts
```
- [ ] Zero matches

```bash
# orders has NO deletedAt either
grep -n "orders.deletedAt\|isNull(orders.deletedAt)" src/app/api/admin/orders/route.ts
```
- [ ] Zero matches

### 2.4 Seed File
```bash
cat src/db/seed.ts | grep -E "insert|INSERT|categories|super_admin|settings"
```
- [ ] Seeds ≥5 categories with valid slugs
- [ ] Seeds ≥10 products with `costPrice`, `sku`
- [ ] Seeds 1 `super_admin` user
- [ ] Seeds default settings keys
- [ ] No real API credentials hardcoded (check for any `sk_live`, API keys)

---

## §3 — API Route Audit

### 3.1 Coverage Check
```bash
find src/app/api -name "route.ts" | sort
```
Expected routes — verify all 52 files exist:

**Public (14):**
- [ ] `GET /api/products`
- [ ] `GET /api/products/[slug]`
- [ ] `GET /api/categories`
- [ ] `GET /api/banners`
- [ ] `GET /api/flash-deal`
- [ ] `POST /api/coupons/validate`
- [ ] `POST /api/orders`
- [ ] `GET /api/orders/[orderNumber]`
- [ ] `POST /api/payment/initiate`
- [ ] `POST /api/payment/webhook`
- [ ] `GET /api/payment/callback`
- [ ] `POST /api/auth/otp`
- [ ] `POST /api/auth/verify`

**Admin (39+):**
- [ ] `GET /api/admin/dashboard`
- [ ] `GET /api/admin/orders`
- [ ] `GET /api/admin/orders/[id]`
- [ ] `PATCH /api/admin/orders/[id]/status`
- [ ] `PATCH /api/admin/orders/[id]/payment`
- [ ] `PATCH /api/admin/orders/[id]/notes`
- [ ] `POST /api/admin/orders/[id]/courier`
- [ ] `POST /api/admin/orders/[id]/refund`
- [ ] `GET /api/admin/orders/export`
- [ ] `GET /api/admin/products`
- [ ] `POST /api/admin/products`
- [ ] `GET /api/admin/products/[id]`
- [ ] `PATCH /api/admin/products/[id]`
- [ ] `DELETE /api/admin/products/[id]`
- [ ] `PATCH /api/admin/products/[id]/restore`
- [ ] `PATCH /api/admin/products/[id]/stock`
- [ ] `POST /api/admin/upload`
- [ ] `GET /api/admin/categories`
- [ ] `POST /api/admin/categories`
- [ ] `PATCH /api/admin/categories/[id]`
- [ ] `DELETE /api/admin/categories/[id]`
- [ ] `PATCH /api/admin/categories/reorder`
- [ ] `GET /api/admin/customers`
- [ ] `GET /api/admin/customers/[id]`
- [ ] `PATCH /api/admin/customers/[id]/ban`
- [ ] `PATCH /api/admin/customers/[id]/unban`
- [ ] `GET /api/admin/analytics/revenue`
- [ ] `GET /api/admin/analytics/orders`
- [ ] `GET /api/admin/analytics/products`
- [ ] `GET /api/admin/analytics/customers`
- [ ] `GET /api/admin/analytics/inventory`
- [ ] `GET /api/admin/banners`
- [ ] `POST /api/admin/banners`
- [ ] `PATCH /api/admin/banners/[id]`
- [ ] `DELETE /api/admin/banners/[id]`
- [ ] `PATCH /api/admin/banners/reorder`
- [ ] `GET /api/admin/flash-deals`
- [ ] `POST /api/admin/flash-deals`
- [ ] `PATCH /api/admin/flash-deals/[id]`
- [ ] `GET /api/admin/coupons`
- [ ] `POST /api/admin/coupons`
- [ ] `PATCH /api/admin/coupons/[id]`
- [ ] `DELETE /api/admin/coupons/[id]`
- [ ] `GET /api/admin/inventory`
- [ ] `POST /api/admin/inventory/adjust`
- [ ] `GET /api/admin/inventory/log`
- [ ] `GET /api/admin/inventory/export`
- [ ] `GET /api/admin/settings`
- [ ] `PATCH /api/admin/settings`
- [ ] `GET /api/admin/users`
- [ ] `POST /api/admin/users`
- [ ] `PATCH /api/admin/users/[id]`
- [ ] `GET /api/admin/audit-log`

### 3.2 Admin Auth Gate — Every Route Must Have It
```bash
grep -rL "requireAdmin" src/app/api/admin --include="route.ts"
```
- [ ] Output is empty (zero unprotected admin routes)

```bash
grep -rL "isAuthError" src/app/api/admin --include="route.ts"
```
- [ ] Output is empty (zero routes missing the auth error check)

### 3.3 Zod Validation — Every Route Must Validate Input
```bash
grep -rL "safeParse\|z\.object" src/app/api --include="route.ts" | grep -v "callback"
```
- [ ] Only routes with no body/query input are allowed to be absent (GET with no params)

### 3.4 Public Route Deep Checks

#### `GET /api/products`
```bash
cat src/app/api/products/route.ts
```
- [ ] `costPrice` not in `.select()` call
- [ ] `isNull(products.deletedAt)` and `eq(products.isActive, true)` in WHERE
- [ ] `sort=popular` maps to `desc(products.totalOrders)`
- [ ] Cursor decoded with `Buffer.from(cursor, "base64").toString("utf8")`
- [ ] Response: `{ data: [], nextCursor: string|null, total: number }`

#### `POST /api/orders`
```bash
cat src/app/api/orders/route.ts
```
- [ ] `orderRatelimit.limit(ip)` called before any business logic
- [ ] Price calculation is 100% server-side (no client prices used)
- [ ] `COD_FEE = 40` and `DELIVERY_CHARGE = 80` defined as constants
- [ ] `orderItems` insert uses `total` not `subtotal` for row field
- [ ] `orderHistory` insert uses `toStatus` not `status`
- [ ] `orderHistory.note = "Order placed"` on creation
- [ ] `couponUses` insert includes `discount` field
- [ ] Stock decrement uses `sql\`${products.stock} - ${item.qty}\``
- [ ] `sendOrderConfirmationEmail` called with `.catch(() => {})` (fire and forget)
- [ ] Response: `{ data: { orderId, orderNumber, total, paymentMethod, status, paymentRedirectUrl? } }`

#### `POST /api/payment/webhook`
```bash
cat src/app/api/payment/webhook/route.ts
```
- [ ] `verifyAamarPaySignature()` called at the very top, before any DB write
- [ ] Idempotency: exits early if `order.paymentStatus === "paid"` already
- [ ] Updates `aamarpayTxnId` (lowercase `a` — matches schema field name)
- [ ] Returns `200 OK` in ALL cases including errors (aamarPay requires this)

#### `GET /api/banners`
```bash
cat src/app/api/banners/route.ts
```
- [ ] Time window: `startsAt <= NOW()` OR `startsAt IS NULL`
- [ ] Time window: `endsAt > NOW()` OR `endsAt IS NULL`
- [ ] `isActive = true` filter present
- [ ] `position` query param filter optional

#### `POST /api/coupons/validate`
```bash
cat src/app/api/coupons/validate/route.ts
```
- [ ] `startsAt` checked (coupon may not be active yet)
- [ ] `expiresAt` checked
- [ ] `usageLimit` vs `usedCount` checked
- [ ] `perUserLimit` checked for authenticated users only
- [ ] No DB write in this route (validate only, don't consume)
- [ ] Returns `{ data: { code, type, value, discount, maxDiscount } }`

### 3.5 Admin Route Deep Checks

#### `POST /api/admin/orders/[id]/courier`
```bash
cat "src/app/api/admin/orders/[id]/courier/route.ts"
```
- [ ] Status guard: only `["confirmed", "processing"]` allowed
- [ ] Idempotency: blocks if `order.consignmentId` already set
- [ ] `codAmount = 0` for `paymentMethod !== "cod"`
- [ ] `codAmount = parseFloat(order.total)` for COD
- [ ] Address assembled correctly: house, road, area, thana, district joined
- [ ] Updates `orders.courierName`, `orders.consignmentId`, `orders.courierStatus`
- [ ] Audit logged with `{ after: { courier, consignmentId } }`

#### `POST /api/admin/flash-deals`
```bash
cat src/app/api/admin/flash-deals/route.ts
```
- [ ] `flashPrice < product.price` validated
- [ ] `endsAt > startsAt` validated
- [ ] Overlap query: existing active deals that intersect the new time window blocked
- [ ] `createdBy: admin.userId` set

#### `DELETE /api/admin/products/[id]`
```bash
cat "src/app/api/admin/products/[id]/route.ts" | grep -A 10 "DELETE"
```
- [ ] Requires `super_admin` role: `requireAdmin(request, { role: "super_admin" })`
- [ ] Sets `deletedAt = new Date()` — NOT `db.delete()`
- [ ] Returns 404 if `deletedAt` already set

#### `PATCH /api/admin/products/[id]/stock`
```bash
cat "src/app/api/admin/products/[id]/stock/route.ts"
```
- [ ] Reads current stock before update
- [ ] Creates `inventoryLog` row with `before`, `after`, `quantity`, `type`, `reason`
- [ ] `changedBy: admin.userId` (UUID string)

#### `PATCH /api/admin/users/[id]`
```bash
cat "src/app/api/admin/users/[id]/route.ts"
```
- [ ] Self-deactivation blocked: compares `admin.userId !== id` (UUID string comparison)
- [ ] Requires `super_admin` role

#### `GET /api/admin/analytics/inventory`
```bash
cat src/app/api/admin/analytics/inventory/route.ts
```
- [ ] `totalStockValue` (sum of stock × costPrice) returned ONLY for `super_admin`
- [ ] For `staff` role: `totalStockValue` omitted or set to `null`

---

## §4 — Security Audit

### 4.1 Secret Exposure Check
```bash
grep -rn "SERVICE_ROLE\|AAMARPAY_SIGNATURE\|STEADFAST_API_SECRET\|BREVO_API_KEY\|REDX_API_TOKEN" \
  src/app --include="*.tsx" --include="*.ts"
```
- [ ] Zero matches — these must only appear in `src/lib/*.ts` server files

```bash
grep -rn "NEXT_PUBLIC" src/lib --include="*.ts"
```
- [ ] Only `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_POSTHOG_*` — nothing else

### 4.2 costPrice Exposure
```bash
grep -rn "costPrice" \
  src/app/api/products/route.ts \
  "src/app/api/products/[slug]/route.ts" \
  "src/app/api/orders/[orderNumber]/route.ts" \
  src/app/api/orders/route.ts \
  src/app/api/banners/route.ts \
  src/app/api/flash-deal/route.ts
```
- [ ] Zero matches in all public routes

### 4.3 SQL Injection
```bash
grep -rn "db\.execute\|sql\`" src/app/api src/lib --include="*.ts"
```
For each match found:
- [ ] No user input directly concatenated into SQL string
- [ ] All user values passed as Drizzle parameterized values

### 4.4 Rate Limiting
```bash
grep -rn "Ratelimit\|ratelimit\|limit(" src/lib/ratelimit.ts
grep -rn "ratelimit\|orderRatelimit\|otpRatelimit" src/app/api/auth src/app/api/orders
```
- [ ] `POST /api/auth/otp` has rate limit on IP + phone (dual key)
- [ ] `POST /api/auth/verify` has rate limit on IP
- [ ] `POST /api/orders` has rate limit on IP
- [ ] Rate limited response: `{ error: "Too many requests", code: "RATE_LIMITED" }` with status 429

### 4.5 Input Validation
```bash
grep -rL "safeParse" src/app/api --include="route.ts"
```
- [ ] Every route with a body or non-trivial query params has `safeParse()`
- [ ] On `!parsed.success`: returns 400 with first error message

### 4.6 RBAC Matrix
```bash
grep -rn 'requireAdmin(request, { role: "super_admin" })' src/app/api/admin --include="route.ts"
```
Verify these routes use super_admin-only gate:
- [ ] `DELETE /api/admin/products/[id]`
- [ ] `PATCH /api/admin/products/[id]/restore`
- [ ] `POST /api/admin/orders/[id]/refund`
- [ ] `GET /api/admin/orders/export`
- [ ] `GET /api/admin/coupons`
- [ ] `POST /api/admin/coupons`
- [ ] `PATCH /api/admin/coupons/[id]`
- [ ] `DELETE /api/admin/coupons/[id]`
- [ ] `PATCH /api/admin/customers/[id]/ban`
- [ ] `PATCH /api/admin/customers/[id]/unban`
- [ ] `GET /api/admin/settings`
- [ ] `PATCH /api/admin/settings`
- [ ] `GET /api/admin/users`
- [ ] `POST /api/admin/users`
- [ ] `PATCH /api/admin/users/[id]`
- [ ] `GET /api/admin/audit-log`
- [ ] `GET /api/admin/inventory/export`

### 4.7 HTTP Security Headers
```bash
grep -A 60 "headers()" next.config.ts 2>/dev/null || grep -A 60 "headers:" next.config.ts
```
- [ ] `Strict-Transport-Security` with `max-age` set
- [ ] `X-Frame-Options: DENY`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy` restricting camera, microphone, geolocation

### 4.8 No Console Logs with Sensitive Data
```bash
grep -rn "console\." src/app/api src/lib --include="*.ts"
```
- [ ] Zero console statements in production API routes
- [ ] Zero console statements in lib files

### 4.9 Middleware Admin Protection
```bash
cat src/middleware.ts
```
- [ ] `/admin` pages redirect to `/admin/login?next=[pathname]` when no token
- [ ] Token verified via Supabase `auth.getUser()` — not just presence check
- [ ] API routes (`/api/admin/*`) excluded from middleware (they handle own auth)

---

## §5 — Payment & Courier

### 5.1 aamarPay Library
```bash
cat src/lib/aamarpay.ts
```
- [ ] `initiateAamarPayPayment` params do NOT include `orderNumber` (not in aamarPay API)
- [ ] `successUrl`, `failUrl`, `cancelUrl` default from `NEXT_PUBLIC_APP_URL` env
- [ ] Sandbox URL used when `AAMARPAY_MODE !== "live"`
- [ ] `verifyAamarPaySignature(payload, key)` implemented using MD5 or SHA-256 per aamarPay docs

### 5.2 Webhook Flow
```bash
cat src/app/api/payment/webhook/route.ts
```
Step-by-step verification:
1. [ ] Body parsed
2. [ ] `verifyAamarPaySignature()` called — returns early if invalid
3. [ ] Order looked up by `mer_txnid` (order ID) or transaction ID
4. [ ] Idempotency check: `if (order.paymentStatus === "paid") return 200`
5. [ ] `orders.paymentStatus` updated to `"paid"`
6. [ ] `orders.aamarpayTxnId` updated (camelCase: `aamarpayTxnId`)
7. [ ] `orderHistory` row inserted: `toStatus: "confirmed"` or `note: "Payment confirmed"`
8. [ ] Returns `NextResponse.json({ received: true })` with status 200

### 5.3 Payment Callback
```bash
cat src/app/api/payment/callback/route.ts
```
- [ ] Reads `order_id` or `mer_txnid` from query string
- [ ] Resolves to `orderNumber` via DB lookup
- [ ] Redirects to `/order/[orderNumber]?payment=success|failed`
- [ ] Falls back to `/` if no order found (never throws)

### 5.4 Courier Library
```bash
cat src/lib/courier.ts
```
- [ ] `bookSteadfast`: auth via `Api-Key` + `Api-Secret` request headers (not Bearer)
- [ ] `bookPathao`: token fetched via POST to `issue-token`, cached with expiry
- [ ] `bookRedX`: auth via `Authorization: Bearer {REDX_API_TOKEN}`
- [ ] All three return `{ courier, consignmentId, trackingCode, trackingUrl, rawResponse }`
- [ ] Tracking URLs correct:
  - Steadfast: `https://steadfast.com.bd/tracking?trackingCode={code}`
  - Pathao: `https://merchant.pathao.com/order-tracking/{consignmentId}`
  - RedX: `https://redx.com.bd/track-parcel/?trackingId={trackingId}`

### 5.5 COD Amount Logic
In `POST /api/admin/orders/[id]/courier/route.ts`:
```bash
grep -n "codAmount\|cod_amount\|amount_to_collect\|cash_collection" \
  "src/app/api/admin/orders/[id]/courier/route.ts"
```
- [ ] `codAmount = 0` when `paymentMethod !== "cod"` (prepaid orders)
- [ ] `codAmount = parseFloat(order.total)` for COD (full total)
- [ ] This value passed correctly to Steadfast `cod_amount`, Pathao `amount_to_collect`, RedX `cash_collection_amount`

---

## §6 — Email & Notifications

### 6.1 Brevo Library
```bash
cat src/lib/brevo.ts
```
- [ ] `sendOrderConfirmationEmail` function exists and accepts:
  `{ customerName, customerPhone, orderNumber, items, subtotal, deliveryCharge, codFee, total, paymentMethod, address }`
- [ ] `sendShippingUpdateEmail` function exists (for when courier is booked)
- [ ] Both POST to `https://api.brevo.com/v3/smtp/email`
- [ ] Auth: `api-key: ${process.env.BREVO_API_KEY}` header
- [ ] Recipient built from `customerPhone@varito.com.bd` or stored email if available

### 6.2 Email Trigger Audit
```bash
grep -rn "sendOrderConfirmation\|sendShippingUpdate" src/app/api
```
- [ ] `sendOrderConfirmationEmail` called in `POST /api/orders` after successful DB insert
- [ ] Called with `.catch(() => {})` — fire and forget, never blocking
- [ ] Not called in webhook handler (webhook must be fast)

---

## §7 — Frontend: Real API vs Mock Data

### 7.1 Mock Data Detection
```bash
grep -rn "MOCK_\|= \[\s*{" src/app --include="*.tsx" | grep -v "\.test\.\|spec\." | head -40
```
- [ ] List all matches — these must be replaced with API calls before launch
- [ ] Note: `MOCK_` in comments is OK; `const MOCK_` or `const MOCK` in active code is NOT

### 7.2 Public Pages API Wiring Audit

For each page, run:
```bash
grep -n "fetch\|useQuery\|useSWR\|api/" src/app/\(shop\)/[page]/page.tsx
```

| Page | Expected API Call | Wired? |
|------|------------------|--------|
| `/` (homepage) | `GET /api/banners?position=hero` | [ ] |
| `/` (homepage) | `GET /api/flash-deal` | [ ] |
| `/` (homepage) | `GET /api/products?sort=popular&limit=8` | [ ] |
| `/categories` | `GET /api/categories` | [ ] |
| `/category/[slug]` | `GET /api/products?categoryId=[slug]` | [ ] |
| `/product/[slug]` | `GET /api/products/[slug]` | [ ] |
| `/search` | `GET /api/products?search=[q]` | [ ] |
| `/order/[orderNumber]` | `GET /api/orders/[orderNumber]` | [ ] |

### 7.3 Admin Pages API Wiring Audit

```bash
grep -n "fetch\|useQuery\|useSWR\|api/admin" src/app/admin/[page]/page.tsx
```

| Admin Page | Expected API | Wired? |
|-----------|-------------|--------|
| `/admin` | `GET /api/admin/dashboard` | [ ] |
| `/admin/orders` | `GET /api/admin/orders` | [ ] |
| `/admin/orders/[id]` | `GET /api/admin/orders/[id]` | [ ] |
| `/admin/products` | `GET /api/admin/products` | [ ] |
| `/admin/categories` | `GET /api/admin/categories` | [ ] |
| `/admin/customers` | `GET /api/admin/customers` | [ ] |
| `/admin/flash-deals` | `GET /api/admin/flash-deals` | [ ] |
| `/admin/content` | `GET /api/admin/banners` | [ ] |
| `/admin/coupons` | `GET /api/admin/coupons` | [ ] |
| `/admin/inventory` | `GET /api/admin/inventory` | [ ] |
| `/admin/analytics` | All 5 analytics routes | [ ] |
| `/admin/settings` | `GET /api/admin/settings` | [ ] |
| `/admin/users` | `GET /api/admin/users` | [ ] |
| `/admin/audit-log` | `GET /api/admin/audit-log` | [ ] |

### 7.4 Action Wiring Audit

Verify form submissions and button actions call the right endpoints:

| Action | Expected Endpoint | Wired? |
|--------|------------------|--------|
| Place order | `POST /api/orders` | [ ] |
| Apply coupon | `POST /api/coupons/validate` | [ ] |
| Admin: change order status | `PATCH /api/admin/orders/[id]/status` | [ ] |
| Admin: book courier | `POST /api/admin/orders/[id]/courier` | [ ] |
| Admin: update notes | `PATCH /api/admin/orders/[id]/notes` | [ ] |
| Admin: create product | `POST /api/admin/products` | [ ] |
| Admin: upload image | `POST /api/admin/upload` | [ ] |
| Admin: adjust stock | `PATCH /api/admin/products/[id]/stock` | [ ] |
| Admin: ban customer | `PATCH /api/admin/customers/[id]/ban` | [ ] |
| Admin: update settings | `PATCH /api/admin/settings` | [ ] |
| Admin: create flash deal | `POST /api/admin/flash-deals` | [ ] |
| Admin: reorder banners | `PATCH /api/admin/banners/reorder` | [ ] |

---

## §8 — Design System Compliance

Claude runs these as grep audits — no visual check required for most.

### 8.1 Tailwind v4 — Banned Patterns
```bash
echo "=== space-y/space-x ===" && grep -rn "space-y-\|space-x-" src/components src/app --include="*.tsx" | grep -v "//\|#"
echo "=== w-N h-N (use size-N) ===" && grep -rn "\bw-\([0-9]\+\) h-\1\b" src/components src/app --include="*.tsx"
echo "=== divide utilities ===" && grep -rn "\bdivide-" src/components src/app --include="*.tsx"
```
- [ ] `space-y-*` → must be replaced with `flex flex-col gap-*`
- [ ] `space-x-*` → must be replaced with `flex gap-*`
- [ ] `w-N h-N` where N is same → use `size-N`

Fix any found. These are breaking changes for Tailwind v4.

### 8.2 Hardcoded Colors
```bash
echo "=== Hex colors ===" && grep -rn "#[0-9a-fA-F]\{3,8\}" src/components src/app --include="*.tsx" | grep -v "//\|globals.css\|\.md"
echo "=== Non-emerald green ===" && grep -rn "bg-green-\|text-green-\|border-green-" src/components src/app --include="*.tsx"
echo "=== Blue (should not exist) ===" && grep -rn "bg-blue-\|text-blue-" src/components src/app --include="*.tsx"
```
- [ ] Zero hardcoded hex colors in component files
- [ ] No `bg-green-*` — use `bg-primary` or emerald tokens
- [ ] No `bg-blue-*` — project uses emerald as primary

### 8.3 Inline Styles
```bash
grep -rn 'style={{' src/components src/app --include="*.tsx"
```
- [ ] Zero `style={}` attributes (all styling through Tailwind or CSS variables)

### 8.4 img vs Image
```bash
grep -rn "<img " src/components src/app --include="*.tsx"
```
- [ ] Zero `<img>` tags — all replaced with `<Image>` from `next/image`

### 8.5 use client Audit
```bash
grep -rln '"use client"' src/app --include="*.tsx"
```
For each file found, verify it actually needs client:
- [ ] Uses `useState`, `useEffect`, `useRef`, `useContext`, or custom hooks
- [ ] Uses browser APIs (`window`, `localStorage`, `document`)
- [ ] Uses event handlers attached to DOM elements
- If none of the above → remove `"use client"` and convert to Server Component

### 8.6 console.log in Components
```bash
grep -rn "console\." src/components src/app --include="*.tsx"
```
- [ ] Zero console statements in any component or page file

---

## §9 — Mobile Layout (375px Check)

Open browser DevTools → Responsive → iPhone SE (375×667).
For each page listed, confirm:

**Public Pages:**
- [ ] `/` — Homepage: hero banner, featured products, flash deal timer all fit
- [ ] `/products` — Product grid: 2 columns at 375px, no horizontal overflow
- [ ] `/product/[slug]` — Image + details + "Add to Cart" button visible without scroll
- [ ] `/cart` — Items, quantities, total all visible; checkout button full-width
- [ ] `/checkout` — All form fields accessible; payment method selector stacks vertically
- [ ] `/order/[orderNumber]` — Status timeline, items, courier info readable

**Admin Pages:**
- [ ] `/admin` — Dashboard stats stacked in 1 or 2 columns
- [ ] `/admin/orders` — Table scrollable horizontally with frozen first column
- [ ] `/admin/products` — Table scrollable or switches to card view
- [ ] Admin sidebar — Collapses to hamburger at mobile breakpoint

**Common checks for all pages:**
- [ ] No text truncated mid-word
- [ ] All buttons ≥44px tall (tap target)
- [ ] `<main>` padding: at least 16px horizontal
- [ ] Images do not overflow container

---

## §10 — Accessibility (Structural Audit)

### 10.1 Icon-Only Buttons
```bash
grep -rn "<button\|<Button" src/components src/app --include="*.tsx" | grep -v "aria-label\|children\|[A-Za-z].*</" | head -20
```
- [ ] Cart icon button: `aria-label="View cart"`
- [ ] Search icon button: `aria-label="Search"`
- [ ] Close/dismiss buttons: `aria-label="Close"`
- [ ] Mobile menu toggle: `aria-label="Open menu"` / `aria-label="Close menu"`

### 10.2 Form Labels
```bash
grep -n "<input\|<Input\|<select\|<Select\|<textarea" src/components --include="*.tsx" -r | grep -v "aria-label\|htmlFor\|type=\"hidden\"" | head -20
```
- [ ] Every visible form field has `<label htmlFor="fieldId">` or `aria-label`
- [ ] OTP input has `aria-label="Enter verification code"`
- [ ] Checkout address fields labelled in both English and Bengali

### 10.3 Heading Structure
```bash
grep -rn "<h[1-6]\|<H[1-6]" src/app --include="*.tsx" | head -30
```
- [ ] `<h1>` appears exactly once per page
- [ ] Admin dashboard `<h1>` is "Dashboard" or similar
- [ ] Product detail `<h1>` is the product name
- [ ] Heading levels not skipped (h1 → h2 → h3, no h1 → h4)

### 10.4 Image Alt Text
```bash
grep -rn "<Image" src/components src/app --include="*.tsx" | grep -v "alt=" | head -20
```
- [ ] Zero `<Image>` without `alt` prop
- [ ] Decorative images: `alt=""`
- [ ] Product images: `alt={product.name}`
- [ ] Banner images: `alt={banner.title ?? "Promotional banner"}`

---

## §11 — Bangladesh-Specific Checks

### 11.1 Phone Number Format Validation
```bash
grep -n "regex\|pattern\|match" src/lib/validate.ts src/app/api/auth/otp/route.ts src/app/api/orders/route.ts
```
- [ ] OTP route: validates `+8801[3-9]\d{8}` (E.164, 13 chars)
- [ ] Order address: validates `01[3-9]\d{8}` (local, 11 chars)
- [ ] Courier booking: passes local format `01XXXXXXXXX` to courier APIs

### 11.2 Currency Format
```bash
grep -rn "formatPrice\|৳\|BDT\|taka" src/lib/format-price.ts src/components --include="*.ts" --include="*.tsx"
```
- [ ] `src/lib/format-price.ts` exists and formats with `৳` symbol
- [ ] No `BDT` or `Tk` used as currency label anywhere
- [ ] Prices show as `৳ 1,200` not `৳1200.00`
- [ ] All price displays import from `src/lib/format-price.ts`

### 11.3 Districts Data
```bash
wc -l src/constants/districts.ts && grep -c "district\|thana\|upazila" src/constants/districts.ts
```
- [ ] File has substantial content (all 64 districts)
- [ ] Checkout form district dropdown uses this data
- [ ] Thana/Upazila list updates dynamically when district changes

### 11.4 COD Flow Correctness
```bash
grep -n "COD_FEE\|cod_fee\|codFee\|40" src/app/api/orders/route.ts
```
- [ ] `COD_FEE = 40` defined as constant
- [ ] Applied only when `paymentMethod === "cod"`
- [ ] COD fee shown separately in order total breakdown

### 11.5 Bangla Text Rendering
```bash
grep -rn "nameBn\|name_bn" src/app --include="*.tsx" | head -10
```
- [ ] Product `nameBn` rendered when populated (not just English name)
- [ ] Category `nameBn` rendered in breadcrumbs/navigation
- [ ] Verify Bangla characters render with correct font (Plus Jakarta Sans supports Latin; Bangla needs a separate font or system font fallback)

---

## §12 — End-to-End Flows

Run these against a real DB (after `db:migrate` + `db:seed`).

### 12.1 Full COD Order Lifecycle

```
Step 1: GET /api/products → pick a product with stock > 0
Step 2: GET /api/flash-deal → check if active deal exists
Step 3: POST /api/coupons/validate { code: "WELCOME10", orderSubtotal: 500 }
Step 4: POST /api/orders {
  items: [{ productId, qty: 1 }],
  address: { name: "Test User", phone: "01712345678", district: "Chattogram", thana: "Kotwali", area: "Agrabad" },
  paymentMethod: "cod",
  couponCode: "WELCOME10"
}
Step 5: GET /api/orders/[orderNumber] → verify response
Step 6: GET /api/admin/orders → verify order appears
Step 7: PATCH /api/admin/orders/[id]/status { status: "confirmed", note: "Verified" }
Step 8: POST /api/admin/orders/[id]/courier { courier: "steadfast" }
Step 9: PATCH /api/admin/orders/[id]/payment { paymentStatus: "paid" }
Step 10: PATCH /api/admin/orders/[id]/status { status: "delivered" }
Step 11: GET /api/orders/[orderNumber] → verify final state
```

At each step verify:
- [ ] Step 4: Returns 201 with `orderNumber`
- [ ] Step 4: DB `orders.subtotal` + `codFee: 40` + `deliveryCharge: 80`
- [ ] Step 4: `couponUses` row created
- [ ] Step 4: Product `stock` decremented
- [ ] Step 5: Status "pending", items visible, courier null
- [ ] Step 7: `orderHistory` row added with `fromStatus: "pending"`, `toStatus: "confirmed"`
- [ ] Step 8: `orders.consignmentId` set, `courierStatus: "booked"`
- [ ] Step 9: `paymentStatus: "paid"` in DB
- [ ] Step 10: `status: "delivered"` in DB
- [ ] Step 11: Shows full timeline, tracking URL if consignment set

### 12.2 Stock Depletion Guard

```
Step 1: Find product with stock = 1
Step 2: POST /api/orders with qty: 2 for that product
```
- [ ] Returns 400 with `code: "INSUFFICIENT_STOCK"`
- [ ] Error message includes product name: `"Insufficient stock for [name]. Available: 1"`

### 12.3 Flash Deal Overlap Guard

```
Step 1: POST /api/admin/flash-deals {
  productId: 1, flashPrice: 100,
  startsAt: "2026-05-23T10:00:00Z",
  endsAt: "2026-05-23T12:00:00Z"
}
Step 2: POST /api/admin/flash-deals {
  productId: 2, flashPrice: 50,
  startsAt: "2026-05-23T11:00:00Z",
  endsAt: "2026-05-23T14:00:00Z"
}
```
- [ ] Step 1 returns 201
- [ ] Step 2 returns 409 `CONFLICT` (time windows overlap)

### 12.4 Coupon Per-User Limit

```
Step 1: Create coupon with perUserLimit = 1
Step 2: Place order with that coupon as authenticated user → should work
Step 3: Place another order with same coupon same user → should return COUPON_EXHAUSTED
```
- [ ] Step 3 returns 400 `COUPON_EXHAUSTED`

### 12.5 Admin Ban Flow

```
Step 1: PATCH /api/admin/customers/[id]/ban { reason: "Fake COD orders" }
Step 2: GET /api/admin/customers/[id] → isBanned: true, banReason set
Step 3: PATCH /api/admin/customers/[id]/unban
Step 4: GET /api/admin/customers/[id] → isBanned: false, banReason: null
```
- [ ] Step 1 returns 200
- [ ] Step 2 shows ban correctly
- [ ] Step 4 shows clean state

---

## §13 — Analytics

### 13.1 PostHog Setup
```bash
cat src/app/posthog-provider.tsx
cat src/app/posthog-pageview.tsx
grep -n "NEXT_PUBLIC_POSTHOG" src/lib/env.ts 2>/dev/null || grep -rn "POSTHOG" src/app/layout.tsx
```
- [ ] PostHog initialized with `NEXT_PUBLIC_POSTHOG_KEY` from env
- [ ] `NEXT_PUBLIC_POSTHOG_HOST` set (not hardcoded EU/US endpoint)
- [ ] PageView fires on route changes

### 13.2 No PII in Event Properties
```bash
grep -rn "posthog\.capture\|capture(" src/app src/components --include="*.tsx" --include="*.ts" | head -20
```
For each `posthog.capture()` call:
- [ ] No `phone` property in event payload
- [ ] No `email` property
- [ ] No `name` (customer name)
- [ ] `orderId`, `orderNumber`, `productId` are OK (not PII)

### 13.3 Server-Side Events in API
```bash
grep -rn "posthog\|PostHog\|capture" src/app/api --include="*.ts" | head -10
```
- [ ] `order_placed` event fired server-side in `POST /api/orders`
- [ ] `payment_confirmed` event fired server-side in `POST /api/payment/webhook`
- [ ] Events fired after successful DB writes (not before)

---

## §14 — Final Launch Checklist

### 14.1 Hard Blockers — Cannot Launch

```bash
# Run all at once
npx tsc --noEmit && echo "TS: PASS" || echo "TS: FAIL"
npm run lint && echo "LINT: PASS" || echo "LINT: FAIL"
npm run build && echo "BUILD: PASS" || echo "BUILD: FAIL"
grep -rn "console\.log" src/app/api src/lib && echo "CONSOLE: FAIL" || echo "CONSOLE: PASS"
grep -rn "MOCK_\|= \[\s*{" src/app --include="*.tsx" | grep -v "test\|spec" && echo "MOCK DATA: FAIL" || echo "MOCK DATA: PASS"
git log --all -- .env.local 2>&1 | grep commit && echo ".ENV COMMITTED: CRITICAL FAIL" || echo ".env.local: not in git (PASS)"
```

Backend:
- [ ] TypeScript: clean
- [ ] Lint: clean
- [ ] Build: clean
- [ ] Zero `console.log` in API routes and lib files
- [ ] `.env.local` never committed to git
- [ ] All 65 API routes marked `[READY]` in `docs/API_SPEC.md`
- [ ] `costPrice` hidden from all public routes
- [ ] aamarPay webhook signature verified before any processing
- [ ] Rate limiting: auth endpoints + order creation
- [ ] Migration ran on production Neon DB
- [ ] Seed ran: super_admin exists

Frontend (Claude audits via grep):
- [ ] Zero mock data arrays in active production pages
- [ ] Checkout validates BD phone format
- [ ] COD fee ৳40 shown before order submit
- [ ] Coupon validate called before order submit
- [ ] RBAC-gated UI: super_admin-only pages/buttons not rendered for staff

### 14.2 Should Fix Before Launch

- [ ] Bangla font fallback for product names in Bengali script
- [ ] Low-stock badge on product cards (stock ≤ 5)
- [ ] "Out of stock" blocks add-to-cart button
- [ ] All 64 districts in checkout dropdown
- [ ] Flash deal countdown timer accurate (client-side clock)
- [ ] Order timeline renders with all history entries
- [ ] Admin dashboard shows real stats (not placeholder zeros)
- [ ] Courier tracking URL shown in order page after dispatch
- [ ] `404` page has "Go Home" button
- [ ] PWA icon files exist: `public/icons/icon-192.png` + `icon-512.png`

### 14.3 Post-Launch Backlog

- [ ] Courier webhook callbacks (Steadfast/Pathao status push)
- [ ] Customer saved addresses at checkout
- [ ] Order cancellation (before processing)
- [ ] Product reviews publish/moderate
- [ ] Admin CSV export (orders + inventory)
- [ ] SMS notification integration (SSL Wireless / Infobip)
- [ ] Shipping update email trigger when courier booked

---

## §15 — QA Session Sign-Off

```
QA Session Date: ___________
Conducted by: Claude Backend Agent

Build Health:
  TypeScript:  ✅/❌
  Lint:        ✅/❌
  Build:       ✅/❌

Security:
  costPrice exposure:  ✅ Clean / ❌ Found at: ___
  Secret exposure:     ✅ Clean / ❌ Found at: ___
  Rate limiting:       ✅ All wired / ❌ Missing at: ___
  Webhook signature:   ✅ Verified / ❌ Not verified

API Routes:
  All 52 exist:        ✅/❌
  All admin gated:     ✅/❌
  All Zod validated:   ✅/❌

Frontend Wiring:
  Public pages real:   ✅/❌ (list any still mocked: ___)
  Admin pages real:    ✅/❌ (list any still mocked: ___)

BD-Specific:
  Phone validation:    ✅/❌
  COD fee correct:     ✅/❌
  Districts loaded:    ✅/❌

E2E Flows:
  COD order lifecycle: ✅/❌
  Stock guard:         ✅/❌
  Flash deal overlap:  ✅/❌
  Coupon per-user:     ✅/❌

OVERALL STATUS: ✅ READY TO LAUNCH / ❌ BLOCKERS REMAIN

Critical issues fixed this session:
1.
2.
3.

Open issues (with owner/priority):
1.
2.
3.
```

---

*QA.md — Varito Solutions | Created 2026-05-23 by Claude Backend Agent*
*Run this document before every major release.*
*Add new bug patterns to §3-§5 as they are discovered.*
