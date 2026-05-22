# SECURITY.md — Varito Solutions
## Security Architecture | Claude Agent Implements | Inspector Verifies

> Security is not optional. Every item in this document is a hard requirement.
> Claude (Backend): implement all of these before any route goes live.
> Inspector (Antigravity): verify every item in this doc before approving any backend section.
> Gemini (Design): read the client-side section — you own the frontend security too.

---

## 🔐 1. Authentication Architecture

### Two Separate Auth Systems
```
Customer auth  → Supabase Auth (phone OTP)
Admin auth     → Supabase Auth (phone OTP) + role check in DB
```

**Never mix these.** A customer JWT must never grant admin access.
Admin check is ALWAYS: `user.role === 'super_admin' || user.role === 'staff'`
This check reads from the **database** — never from the JWT payload.

### Admin Session Rules
```
Session duration:      8 hours (shorter than customer's 30 days)
Refresh token:         Disabled for admin — must re-login after 8 hours
Multiple devices:      Allowed, but each session is tracked in audit_log
Inactive timeout:      Auto-logout after 2 hours of inactivity (frontend timer)
```

### Admin Login Protection
```
Rate limit:   5 failed attempts → 15-minute lockout (tracked in Redis or DB)
IP logging:   Log every login attempt (success + failure) with IP + user agent
OTP expiry:   5 minutes (Supabase default — verify this in config)
No passwords: OTP-only — no password auth for anyone in this system
```

---

## 🛡️ 2. Middleware Architecture (Next.js)

### Admin Route Protection (`src/middleware.ts`)
```typescript
// Pseudocode — Claude implements the real version
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Protect /admin/* pages
  if (path.startsWith('/admin')) {
    const token = request.cookies.get('admin-token')
    if (!token) return redirect('/admin/login')

    // Verify JWT with Supabase
    const user = await verifySupabaseJWT(token)
    if (!user) return redirect('/admin/login')

    // Check admin role in DB (never trust JWT claims for role)
    const dbUser = await db.query.users.findFirst({
      where: eq(users.supabaseId, user.id)
    })
    if (!dbUser || !['super_admin', 'staff'].includes(dbUser.role)) {
      return redirect('/403')
    }

    // Attach user info to request headers for use in routes
    request.headers.set('x-admin-id', dbUser.id)
    request.headers.set('x-admin-role', dbUser.role)
  }

  // Protect /api/admin/* routes
  if (path.startsWith('/api/admin')) {
    // Same check as above, return 401/403 JSON instead of redirect
  }
}
```

### Route Protection Matrix
```
/admin/login            → Public (no auth needed)
/admin/*                → Admin auth required (any role)
/admin/settings         → Super Admin only
/admin/users            → Super Admin only
/admin/audit-log        → Super Admin only
/admin/coupons          → Super Admin only

/api/admin/*            → Admin auth required (any role)
/api/admin/settings     → Super Admin only
/api/admin/users        → Super Admin only
/api/admin/audit-log    → Super Admin only
/api/admin/coupons      → Super Admin only
/api/admin/orders/*/refund → Super Admin only
/api/admin/customers/*/ban → Super Admin only
```

---

## 🔒 3. API Security Rules

### Input Validation (Mandatory on Every Route)
```typescript
// Every route uses Zod. No route touches the DB without validating first.

// Example for POST /api/admin/products
const CreateProductSchema = z.object({
  name: z.string().min(2).max(200).trim(),
  nameBn: z.string().max(200).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/).max(220),
  categoryId: z.number().int().positive(),
  price: z.number().positive().max(999999),
  salePrice: z.number().positive().optional(),
  costPrice: z.number().positive().max(999999),  // Admin only field
  stock: z.number().int().min(0),
  sku: z.string().min(2).max(50).trim(),
  images: z.array(z.string().url()).min(1).max(10),
  unit: z.enum(['piece', 'roll', 'kg', 'meter', 'pack']),
  minOrderQty: z.number().int().min(1),
})

// Always parse at the top of every route handler:
const body = CreateProductSchema.safeParse(await request.json())
if (!body.success) {
  return Response.json(
    { error: 'Invalid input', code: 'VALIDATION_ERROR', details: body.error.flatten() },
    { status: 400 }
  )
}
```

### SQL Injection Prevention
```typescript
// ALWAYS use Drizzle ORM parameterized queries
// NEVER do this:
const result = await sql`SELECT * FROM products WHERE name = '${userInput}'`  // ❌ DANGEROUS

// ALWAYS do this:
const result = await db.query.products.findMany({
  where: eq(products.name, userInput)  // ✅ Parameterized
})
```

### Price Manipulation Prevention
```typescript
// NEVER trust prices from the client
// ALWAYS recalculate on the server

// ❌ WRONG:
const total = req.body.total  // Client says the total — NEVER trust this

// ✅ RIGHT:
const items = await db.query.products.findMany({
  where: inArray(products.id, itemIds)
})
const subtotal = items.reduce((sum, item) => sum + (item.price * qty), 0)
const codFee = paymentMethod === 'cod' ? SETTINGS.codFee : 0
const deliveryCharge = SETTINGS.deliveryCharge
const total = subtotal + codFee + deliveryCharge - discount
```

### Sensitive Data — Never Expose in API Responses
```typescript
// NEVER include in customer-facing API responses:
const SENSITIVE_FIELDS = [
  'cost_price',       // Business margin data
  'admin_notes',      // Internal admin notes on orders
  'supabase_id',      // Internal auth ID
  'deleted_at',       // Soft delete timestamp
]

// ❌ WRONG:
return Response.json({ data: product })  // Might include cost_price

// ✅ RIGHT:
const { costPrice, deletedAt, ...safeProduct } = product
return Response.json({ data: safeProduct })
```

---

## ⏱️ 4. Rate Limiting

### Per-Endpoint Limits
```
POST /api/auth/otp           →  5 requests per phone per 10 minutes
POST /api/auth/verify        →  10 requests per IP per 10 minutes
POST /api/orders             →  20 requests per IP per hour
POST /api/payment/initiate   →  10 requests per IP per 10 minutes
POST /api/admin/login        →  5 requests per IP per 15 minutes
All /api/admin/*             →  200 requests per admin per minute
All public /api/*            →  60 requests per IP per minute
```

### Implementation
```typescript
// Use Upstash Redis (free tier) for rate limiting
// Package: @upstash/ratelimit

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '10 m'),
})

// In route handler:
const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1'
const { success } = await ratelimit.limit(ip)
if (!success) {
  return Response.json(
    { error: 'Too many requests', code: 'RATE_LIMITED' },
    { status: 429 }
  )
}
```

---

## 🔏 5. Payment Security

### aamarPay Webhook Verification (Critical)
```typescript
// NEVER process a payment without verifying the signature first
// aamarPay sends a hash in the payload — verify it matches

import crypto from 'crypto'

function verifyAamarPaySignature(
  payload: AamarPayWebhookPayload,
  secretKey: string
): boolean {
  // Remove the hash field from payload, then compute expected hash
  const { hash, ...dataWithoutHash } = payload

  // Sort keys alphabetically, concatenate values
  const dataString = Object.keys(dataWithoutHash)
    .sort()
    .map(key => dataWithoutHash[key])
    .join('')

  const expectedHash = crypto
    .createHash('sha256')
    .update(dataString + secretKey)
    .digest('hex')

  // Use timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(expectedHash)
  )
}

// Usage in webhook route:
export async function POST(request: Request) {
  const payload = await request.json()

  if (!verifyAamarPaySignature(payload, process.env.AAMARPAY_SIGNATURE_KEY!)) {
    // Log this as a potential attack
    await logAuditEvent('webhook.signature_failed', { ip: getIP(request) })
    return Response.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // Now safe to process
}
```

### Idempotency (Prevent Double Processing)
```typescript
// Payment webhooks can fire multiple times (aamarPay retries on timeout)
// Always check if already processed before updating DB

const existingOrder = await db.query.orders.findFirst({
  where: eq(orders.aamarPayTxnId, payload.txn_id)
})

if (existingOrder?.paymentStatus === 'paid') {
  // Already processed — return 200 to stop retries, do nothing
  return Response.json({ status: 'already_processed' })
}

// Only now update
```

---

## 🌐 6. HTTP Security Headers

Add these to `next.config.ts`:

```typescript
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.posthog.com",  // PostHog needs unsafe-inline
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      "font-src 'self' fonts.gstatic.com",
      "img-src 'self' data: *.r2.cloudflarestorage.com",
      "connect-src 'self' *.supabase.co *.posthog.com *.aamarpay.com",
    ].join('; ')
  },
]
```

---

## 🔑 7. Environment Variable Security

### Never Expose Server Secrets to Client
```typescript
// ❌ WRONG — any env var without NEXT_PUBLIC_ prefix is fine on server
// But NEVER do this on the client side:
const apiKey = process.env.BREVO_API_KEY  // This will be undefined on client, but...

// ✅ RIGHT — explicitly mark server-only variables
// In src/lib/env.ts, validate at startup:
import { z } from 'zod'

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  AAMARPAY_SIGNATURE_KEY: z.string().min(1),
  BREVO_API_KEY: z.string().min(1),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().min(1),
})

// This throws at startup if any required env var is missing
export const serverEnv = serverEnvSchema.parse(process.env)
```

### Required Environment Variables
```bash
# These must NEVER appear in client-side code:
DATABASE_URL
SUPABASE_SERVICE_ROLE_KEY      # Admin-level Supabase key
AAMARPAY_STORE_ID
AAMARPAY_SIGNATURE_KEY
BREVO_API_KEY
CLOUDFLARE_R2_SECRET_ACCESS_KEY
NEXTAUTH_SECRET

# These are OK on client:
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_POSTHOG_KEY
```

---

## 📋 8. Audit Logging

Every significant admin action must be logged to the `audit_log` table.

```typescript
// Helper function — Claude creates in src/lib/audit.ts
async function logAuditEvent(
  adminId: string,
  action: string,
  entityType: string,
  entityId: string,
  changes: { before?: object; after?: object },
  request: Request
) {
  await db.insert(auditLog).values({
    adminId,
    action,                    // e.g., 'product.update'
    entityType,               // e.g., 'product'
    entityId: String(entityId),
    changes: JSON.stringify(changes),
    ipAddress: request.headers.get('x-forwarded-for') ?? 'unknown',
    userAgent: request.headers.get('user-agent') ?? 'unknown',
  })
}
```

**Must log these events:**
- Admin login (success + failure)
- Product created / updated / deleted / restored
- Order status changed
- Order refunded
- Customer banned / unbanned
- Coupon created / deactivated
- Settings changed (before + after values)
- Admin user created / role changed / deactivated
- Manual stock adjustment

---

## 🖥️ 9. Frontend Security (Gemini's Domain)

### No Sensitive Data in Client State
```typescript
// ❌ WRONG — never store these in localStorage, sessionStorage, or React state
localStorage.setItem('costPrice', product.costPrice)  // Business data leak
localStorage.setItem('adminToken', token)              // Use httpOnly cookie instead

// ✅ RIGHT — admin JWT should be httpOnly cookie (set by server, not JS)
```

### CSRF Protection
```typescript
// Next.js App Router is protected by default for same-origin requests
// For webhook endpoints that receive external POST requests:
// — Verify with signature (aamarPay), not CSRF token
// — For internal admin forms — Next.js handles this automatically with server actions
```

### Content from User (XSS Prevention)
```typescript
// Never render raw HTML from user input
// ❌ WRONG:
<div dangerouslySetInnerHTML={{ __html: product.description }} />

// ✅ RIGHT — use a safe markdown renderer (DOMPurify + marked):
import DOMPurify from 'isomorphic-dompurify'
import { marked } from 'marked'
const safeHtml = DOMPurify.sanitize(marked(product.description))
<div dangerouslySetInnerHTML={{ __html: safeHtml }} />
```

---

## ✅ Security Checklist (Inspector Verifies Before Every Deploy)

```
AUTHENTICATION:
□ Admin routes protected by middleware (not just page-level check)
□ Role check reads from DB — never from JWT claims alone
□ Admin sessions expire in 8 hours
□ Failed login attempts rate-limited and logged

INPUT VALIDATION:
□ Every route has Zod schema at the top
□ safeParse used (not parse) — errors returned, not thrown
□ All user-input strings trimmed
□ Numbers validated for reasonable min/max

SQL:
□ Zero raw SQL string interpolation — all Drizzle ORM
□ No TypeScript "any" on DB query results

PRICES:
□ Order total calculated server-side in every order route
□ No client-supplied prices trusted for order creation

DATA EXPOSURE:
□ cost_price not in any customer-facing response
□ admin_notes not in any customer-facing response
□ supabase_id not in any API response

PAYMENT:
□ aamarPay webhook verifies signature with timingSafeEqual
□ Webhook checks if already processed before updating DB
□ Payment status only set to "paid" via verified webhook

RATE LIMITING:
□ /api/auth/otp: 5/phone/10min
□ /api/auth/verify: 10/IP/10min
□ /api/admin/*: 200/admin/min
□ Upstash Redis connected and working

HTTP HEADERS:
□ All security headers in next.config.ts
□ HSTS enabled
□ X-Frame-Options: SAMEORIGIN

AUDIT LOG:
□ Every admin action logged with IP + user agent
□ Before/after captured for all data changes

ENVIRONMENT:
□ Server secrets not accessible in client-side code
□ env.ts validates all required vars at startup
□ No .env.local in git (verify .gitignore)
```

---

*Varito Solutions | Security Architecture | Claude implements, Inspector verifies | 2026*
