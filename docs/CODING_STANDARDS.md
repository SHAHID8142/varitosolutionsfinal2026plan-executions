# CODING_STANDARDS.md — Varito Solutions
## Code Organization, Comments & File Structure | ALL Agents Follow This

> This is the law. Every file, every function, every component must follow these rules.
> Any agent that violates these standards will have their code rejected by the Inspector.
> Read this BEFORE writing any code.

---

## 📁 Rule 1 — One Element Per File (No Exceptions)

Every component, utility, hook, type, and constant gets its **own file**.
Never put two components or two utilities in the same file.

### ✅ Correct File Structure
```
src/components/ui/
├── button.tsx           ← ONLY the Button component
├── badge.tsx            ← ONLY the Badge component
├── product-card.tsx     ← ONLY the ProductCard component
├── price-tag.tsx        ← ONLY the PriceTag component
└── quantity-selector.tsx ← ONLY the QuantitySelector component

src/lib/
├── db.ts                ← ONLY the database connection
├── auth.ts              ← ONLY auth helpers
├── r2.ts                ← ONLY Cloudflare R2 helpers
├── brevo.ts             ← ONLY email helpers
└── aamarpay.ts          ← ONLY payment helpers

src/hooks/
├── use-cart.ts          ← ONLY the useCart hook
├── use-auth.ts          ← ONLY the useAuth hook
└── use-debounce.ts      ← ONLY the useDebounce hook

src/types/
├── product.ts           ← ONLY product-related types
├── order.ts             ← ONLY order-related types
├── user.ts              ← ONLY user-related types
└── payment.ts           ← ONLY payment-related types

src/constants/
├── districts.ts         ← ONLY Bangladesh districts/thanas data
├── payment-methods.ts   ← ONLY payment method constants
└── routes.ts            ← ONLY app route constants
```

### ❌ Wrong — Never Do This
```typescript
// ❌ WRONG — two components in one file
export function Button() { ... }
export function IconButton() { ... }    // Should be its own file

// ❌ WRONG — mixing types and components
export type Product = { ... }
export function ProductCard() { ... }  // Types go in src/types/product.ts

// ❌ WRONG — barrel file with everything
export * from './button'
export * from './badge'
export * from './card'                  // OK for index.ts, NOT for components
```

---

## 📝 Rule 2 — Every File Must Have a Header Comment

Every file starts with a header block. No exceptions.

### Frontend Component Header Template
```typescript
/**
 * @file button.tsx
 * @description Reusable Button component with multiple variants and states.
 *              Used across all pages for primary actions, form submissions,
 *              and navigation triggers.
 *
 * @variants primary | secondary | outline | ghost | danger
 * @states   default | loading | disabled
 * @sizes    sm | md | lg
 *
 * @example
 * <Button variant="primary" size="md" onClick={handleSubmit}>
 *   Place Order
 * </Button>
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */
```

### Backend API Route Header Template
```typescript
/**
 * @file route.ts
 * @path /api/products
 * @description Public API for listing products with pagination, search, and filtering.
 *              Returns paginated product list. No auth required (public endpoint).
 *
 * @methods  GET
 * @auth     None (public)
 * @ratelimit No rate limiting (public read)
 *
 * @queryParams
 *   page     - Page number (default: 1)
 *   limit    - Items per page (default: 20, max: 50)
 *   category - Filter by category slug
 *   search   - Search term for product name
 *   sort     - 'price_asc' | 'price_desc' | 'newest'
 *
 * @responses
 *   200 - { data: Product[], nextCursor: string | null }
 *   400 - { error: string, code: 'INVALID_PARAMS' }
 *   500 - { error: string, code: 'SERVER_ERROR' }
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-22
 */
```

### Utility/Library File Header Template
```typescript
/**
 * @file brevo.ts
 * @description Brevo (formerly Sendinblue) email client and helpers.
 *              Handles transactional emails: order confirmation, shipping updates, OTPs.
 *              Uses Brevo REST API v3.
 *
 * @env BREVO_API_KEY - Required. Get from Brevo Dashboard → API Keys.
 *
 * @functions
 *   sendOrderConfirmation(order) - Sends order confirmation to customer
 *   sendShippingUpdate(order)    - Sends shipping notification
 *   sendOTPEmail(email, otp)     - Sends OTP for email verification
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-22
 */
```

### Type Definition File Header Template
```typescript
/**
 * @file product.ts
 * @description TypeScript type definitions for all product-related data structures.
 *              These types are shared between the frontend and backend.
 *              API responses and DB queries must conform to these types.
 *
 * @usedBy
 *   - src/app/api/products/route.ts (API response shape)
 *   - src/components/shop/product-card.tsx (component props)
 *   - src/db/schema.ts (DB schema must match Product type)
 *
 * @owner    Both agents (coordinate before changing)
 * @updated  2026-05-22
 */
```

---

## 💬 Rule 3 — Comment Standards (What and How to Comment)

### What MUST be commented:

**1. Every exported function — JSDoc block**
```typescript
/**
 * Verifies the aamarPay webhook signature to prevent fraudulent callbacks.
 * IMPORTANT: Never process a payment without calling this first.
 *
 * @param payload - The raw request body from aamarPay
 * @param signature - The signature from the 'hash' field in the payload
 * @returns true if valid, false if tampered/invalid
 * @throws Never — returns false on any error (fail safe)
 *
 * @security This is a critical security function. Do not modify without review.
 */
export function verifyAamarPaySignature(
  payload: AamarPayWebhookPayload,
  signature: string
): boolean {
  ...
}
```

**2. Every React component — JSDoc block**
```typescript
/**
 * ProductCard component — displays a single product in grid/list views.
 *
 * Shows product image, name, price (with sale price if applicable),
 * stock status badge, and an "Add to Cart" button.
 * Optimized for mobile-first display at 375px minimum width.
 *
 * @param product - Full product object from the API
 * @param onAddToCart - Callback when "Add to Cart" is clicked
 * @param showBadge - Whether to show the "New" / "Sale" badge (default: true)
 */
export function ProductCard({
  product,
  onAddToCart,
  showBadge = true,
}: ProductCardProps) {
  ...
}
```

**3. Complex logic blocks — inline comments explaining WHY**
```typescript
// COD fee is only applied when the total is below 500 BDT.
// Above 500 BDT, COD is free to encourage larger orders.
// Reference: Business decision from ROADMAP.md Phase 2.
const codFee = subtotal < 500 ? 30 : 0;

// We soft-delete products instead of hard-deleting them.
// Orders referencing the product still need to resolve the product name.
// Hard delete would break order history.
await db
  .update(products)
  .set({ deletedAt: new Date() })
  .where(eq(products.id, productId));
```

**4. All TODO and FIXME comments must include context**
```typescript
// TODO(Claude): Add Redis caching for product list — currently re-fetches on every request.
// Priority: Medium. Do this in Phase 3 after launch.

// FIXME(Gemini): The mobile nav z-index is wrong on iOS Safari.
// Repro: Open menu → scroll → menu jumps behind content.
// Filed: TASKS.md bug queue #3.
```

**5. Every environment variable usage**
```typescript
// BREVO_API_KEY is required. If missing, email silently fails.
// Set in .env.local (local) and Cloudflare Pages env vars (production).
const BREVO_API_KEY = process.env.BREVO_API_KEY;
if (!BREVO_API_KEY) {
  console.error('[brevo] BREVO_API_KEY not set — emails will not send');
  return;
}
```

### What NOT to comment:
```typescript
// ❌ Don't comment obvious things
const total = price * quantity; // multiply price by quantity (USELESS)

// ❌ Don't describe what the code does — describe WHY
const isLoggedIn = user !== null; // checks if user is not null (USELESS)

// ✅ Only comment when the WHY isn't obvious
const isLoggedIn = user !== null; // null = guest checkout, object = authenticated
```

---

## 🗂️ Rule 4 — Naming Conventions

### Files
```
Components:    kebab-case.tsx         →  product-card.tsx
Hooks:         use-kebab-case.ts      →  use-cart.ts
Utilities:     kebab-case.ts          →  format-price.ts
Types:         kebab-case.ts          →  product.ts
Constants:     kebab-case.ts          →  payment-methods.ts
API routes:    folder/route.ts        →  api/products/route.ts
```

### Variables and Functions
```typescript
// Variables — camelCase
const productList = [];
const isLoading = false;
const totalPrice = 0;

// Functions — camelCase, verb-first
function getProduct() {}
function formatPrice() {}
function handleAddToCart() {}
function validateOrderData() {}

// React components — PascalCase
function ProductCard() {}
function CheckoutForm() {}
function AdminOrderTable() {}

// Types and Interfaces — PascalCase
type Product = {}
type OrderStatus = 'pending' | 'shipped' | 'delivered'
interface CartItem {}

// Constants — SCREAMING_SNAKE_CASE
const MAX_CART_ITEMS = 20;
const COD_FEE_THRESHOLD = 500;
const DEFAULT_PAGE_SIZE = 20;

// CSS class variables — kebab-case with prefix
--color-primary
--color-muted
--spacing-section
```

### Database (Drizzle)
```typescript
// Tables — snake_case, plural
products, orders, order_items, product_images, categories

// Columns — snake_case
product_id, created_at, updated_at, deleted_at, cost_price, sale_price

// Relations — descriptive camelCase
productsRelations, ordersRelations
```

---

## 🏗️ Rule 5 — Full Folder Structure (The Complete Map)

```
varito-solutions/
├── src/
│   ├── app/                           ← Next.js App Router
│   │   ├── (shop)/                    ← Customer-facing pages
│   │   │   ├── page.tsx               ← Homepage (/)
│   │   │   ├── layout.tsx             ← Shop layout (header + footer)
│   │   │   ├── category/
│   │   │   │   └── [slug]/page.tsx    ← Category listing
│   │   │   ├── product/
│   │   │   │   └── [slug]/page.tsx    ← Product detail
│   │   │   ├── search/page.tsx        ← Search results
│   │   │   ├── cart/page.tsx          ← Cart
│   │   │   ├── checkout/page.tsx      ← Checkout
│   │   │   ├── order/
│   │   │   │   └── [id]/page.tsx      ← Order confirmation
│   │   │   └── account/
│   │   │       └── orders/page.tsx    ← My orders
│   │   ├── admin/                     ← Admin dashboard
│   │   │   ├── page.tsx               ← Admin home (stats)
│   │   │   ├── layout.tsx             ← Admin layout
│   │   │   ├── products/
│   │   │   │   ├── page.tsx           ← Product list
│   │   │   │   ├── new/page.tsx       ← Add product
│   │   │   │   └── [id]/edit/page.tsx ← Edit product
│   │   │   └── orders/
│   │   │       └── page.tsx           ← Order management
│   │   ├── api/                       ← API routes (Claude only)
│   │   │   ├── products/
│   │   │   │   ├── route.ts           ← GET /api/products
│   │   │   │   └── [slug]/route.ts    ← GET /api/products/[slug]
│   │   │   ├── categories/route.ts    ← GET /api/categories
│   │   │   ├── orders/
│   │   │   │   ├── route.ts           ← POST /api/orders
│   │   │   │   └── [id]/route.ts      ← GET /api/orders/[id]
│   │   │   ├── payment/
│   │   │   │   ├── initiate/route.ts  ← POST /api/payment/initiate
│   │   │   │   └── webhook/route.ts   ← POST /api/payment/webhook
│   │   │   ├── auth/
│   │   │   │   ├── otp/route.ts       ← POST /api/auth/otp
│   │   │   │   └── verify/route.ts    ← POST /api/auth/verify
│   │   │   └── admin/
│   │   │       ├── orders/
│   │   │       │   ├── route.ts       ← GET /api/admin/orders
│   │   │       │   └── [id]/route.ts  ← PATCH /api/admin/orders/[id]
│   │   │       ├── products/
│   │   │       │   ├── route.ts       ← GET POST /api/admin/products
│   │   │       │   └── [id]/route.ts  ← PATCH DELETE /api/admin/products/[id]
│   │   │       └── upload/route.ts    ← POST /api/admin/upload
│   │   ├── component-preview/
│   │   │   └── page.tsx               ← Component showcase (all breakpoints)
│   │   ├── layout.tsx                 ← Root layout
│   │   ├── not-found.tsx              ← 404 page (global)
│   │   ├── error.tsx                  ← Unhandled error boundary (global)
│   │   ├── loading.tsx                ← Root suspense fallback
│   │   └── globals.css                ← Global styles + CSS variables
│   │
│   ├── components/                    ← All React components (Gemini only)
│   │   ├── ui/                        ← Base design system components
│   │   │   ├── button.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── price-tag.tsx
│   │   │   ├── loading-skeleton.tsx
│   │   │   ├── empty-state.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── rating-stars.tsx
│   │   │   └── whatsapp-button.tsx
│   │   ├── shop/                      ← Shop-specific components
│   │   │   ├── product-card.tsx
│   │   │   ├── category-card.tsx
│   │   │   ├── product-image-gallery.tsx
│   │   │   ├── quantity-selector.tsx
│   │   │   ├── search-bar.tsx
│   │   │   ├── payment-method-selector.tsx
│   │   │   ├── order-summary.tsx
│   │   │   └── address-form.tsx
│   │   ├── admin/                     ← Admin-specific components
│   │   │   ├── stats-card.tsx
│   │   │   ├── orders-table.tsx
│   │   │   └── product-form.tsx
│   │   └── layout/                    ← Layout components
│   │       ├── header.tsx
│   │       ├── footer.tsx
│   │       ├── bottom-nav.tsx
│   │       └── admin-sidebar.tsx
│   │
│   ├── lib/                           ← Server utilities (Claude only)
│   │   ├── db.ts                      ← Neon/Drizzle connection
│   │   ├── auth.ts                    ← Supabase auth helpers
│   │   ├── r2.ts                      ← Cloudflare R2 upload helpers
│   │   ├── brevo.ts                   ← Email helpers
│   │   ├── aamarpay.ts                ← Payment client
│   │   ├── courier.ts                 ← Courier booking (Steadfast/Pathao/RedX)
│   │   ├── redis.ts                   ← Upstash Redis client (rate limiting)
│   │   ├── env.ts                     ← Startup env var validation (Zod)
│   │   ├── audit.ts                   ← Audit log helper
│   │   ├── format-price.ts            ← BDT price formatting utility
│   │   ├── validate.ts                ← Shared Zod schemas
│   │   └── errors.ts                  ← Standard error response helpers
│   │
│   ├── db/                            ← Database (Claude only)
│   │   ├── schema.ts                  ← Drizzle schema (source of truth)
│   │   └── migrations/                ← Generated migration files (never edit manually)
│   │
│   ├── hooks/                         ← React hooks (Gemini writes, Claude reviews)
│   │   ├── use-cart.ts                ← Cart state management
│   │   ├── use-auth.ts                ← Auth state
│   │   └── use-debounce.ts            ← Search input debounce
│   │
│   ├── types/                         ← TypeScript types (both coordinate)
│   │   ├── product.ts
│   │   ├── order.ts
│   │   ├── user.ts
│   │   ├── cart.ts
│   │   └── payment.ts
│   │
│   ├── constants/                     ← App-wide constants (both coordinate)
│   │   ├── districts.ts               ← Bangladesh districts + thanas data
│   │   ├── payment-methods.ts         ← Payment method configs
│   │   └── routes.ts                  ← All app routes as constants
│   │
│   └── server/                        ← Server actions (Claude only)
│       ├── products.ts                ← Product server actions
│       └── orders.ts                  ← Order server actions
│
├── public/                            ← Static assets
│   ├── icons/                         ← App icons (PWA)
│   └── images/                        ← Static images (logos, placeholders)
│
├── docs/                              ← Project documentation
│   ├── DESIGN_SYSTEM.md
│   ├── API_SPEC.md
│   ├── DB_SCHEMA.md
│   ├── COMPONENT_REGISTRY.md
│   ├── ENV_VARS.md
│   ├── MCP_SERVERS.md
│   ├── TOKEN_EFFICIENCY.md
│   ├── CODING_STANDARDS.md            ← This file
│   └── skills/                        ← Expert knowledge docs
│
├── GEMINI.md                          ← Design agent config
├── CLAUDE.md                          ← Backend agent config
├── AGENTS.md                          ← Multi-agent coordination
├── PROMPT.md                          ← Master onboarding prompts
├── STATUS.md                          ← Live project state
├── TASKS.md                           ← Task queue
├── ROADMAP.md                         ← 5-phase plan
└── TECH_STACK.md                      ← Technology choices
```

---

## 🔖 Rule 6 — Section Dividers Inside Files

For any file over 50 lines, divide it into clearly labelled sections.

```typescript
// ─────────────────────────────────────────────
// IMPORTS
// ─────────────────────────────────────────────
import { ... } from '...'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type ProductCardProps = { ... }

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const PLACEHOLDER_IMAGE = '/images/product-placeholder.jpg'

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export function ProductCard({ ... }: ProductCardProps) {
  ...
}

// ─────────────────────────────────────────────
// HELPERS (private to this file)
// ─────────────────────────────────────────────
function formatDiscount(original: number, sale: number): string {
  ...
}
```

---

## ✅ Rule 7 — Inspector Checklist for Comments & Structure

The Inspector (Antigravity) and 2nd Inspector (Claude) check these on EVERY review:

```
□ Every file has a header comment block (@file, @description, @owner)
□ Every exported function has a JSDoc comment
□ Every component has a JSDoc comment describing its purpose and props
□ Complex logic blocks have inline "WHY" comments
□ All TODO/FIXME comments include owner name and context
□ All env variable usages have a comment explaining what they do
□ No file contains more than one component/utility/hook
□ File names are kebab-case (except for Next.js required names like layout.tsx)
□ Types are in src/types/ — not mixed into component files
□ Constants are in src/constants/ — not inline in components
□ Hooks are in src/hooks/ — not inline in component files
□ Section dividers exist in files over 50 lines
□ Naming conventions follow this document exactly
```

---

## 🚀 Why This Matters

When any agent (or human) opens a file for the first time, they should be able to:
1. **Read the header** → know exactly what the file does, who owns it, and when it was updated
2. **Scan the sections** → find the exact part they need without reading the whole file
3. **Read inline comments** → understand WHY decisions were made, not just what the code does
4. **Trust the structure** → know that every component is in its own file, every type in `src/types/`

This is especially important in a multi-agent, multi-computer project where different
tools pick up the work at different times.

---

*Varito Solutions | Coding Standards | All Agents Follow This | Updated 2026-05-22*
