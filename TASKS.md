# TASKS.md — Varito Solutions
## Agent Task Queue | Updated by both agents

> **HOW THIS WORKS:**
> - Tasks marked `[GEMINI]` → Gemini Flash agent does it
> - Tasks marked `[CLAUDE]` → Claude Code agent does it
> - Tasks marked `[BOTH]` → Both agents must coordinate
> - Tasks marked `[HUMAN]` → User must do it (decision or external action)
> - Status: `[ ]` pending → `[/]` in progress → `[x]` done → `[!]` blocked

---

## 🚨 HUMAN SETUP (Blockers — Agents Cannot Proceed Without These)

- [x] `[HUMAN]` Initialize Next.js project ✅ Done
- [x] `[HUMAN]` Push initial project to GitHub repo ✅ Done
- [ ] `[HUMAN]` Register domain at Namecheap or Porkbun
- [ ] `[HUMAN]` Point domain to Cloudflare nameservers
- [ ] `[HUMAN]` Connect GitHub repo to Cloudflare Pages (auto-deploy on push)
- [ ] `[HUMAN]` Create Neon DB project named `varito-production` → save connection string
- [ ] `[HUMAN]` Create `.env.local` — fill ALL keys from `docs/ENV_VARS.md`
- [ ] `[HUMAN]` Get aamarPay sandbox credentials (aamarpay.com → Merchant Dashboard → API Settings)
- [ ] `[HUMAN]` Get Steadfast API key + secret (portal.steadfast.com.bd → API Integration)
- [ ] `[HUMAN]` Get Pathao client ID + secret (merchant.pathao.com → Settings → API Access)
- [ ] `[HUMAN]` Get RedX API token (redx.com.bd → Merchant → API)
- [ ] `[HUMAN]` Create Upstash Redis DB → get REST URL + token (console.upstash.com — free tier)
- [ ] `[HUMAN]` Get PostHog Personal API Key (posthog.com → Settings → Personal API Keys)

---

## 🎨 GEMINI AGENT TASKS (UI/UX)

### Phase 1: Design System Setup ✅ Complete
- [x] `[GEMINI]` Install shadcn/ui and base components
- [x] `[GEMINI]` Create `src/styles/globals.css` with CSS variables from `docs/DESIGN_SYSTEM.md`
- [x] `[GEMINI]` Create `src/lib/fonts.ts` — Plus Jakarta Sans + Hind Siliguri
- [x] `[GEMINI]` **PREMIUM EMERALD REFACTOR** (Emerald theme, solid colors, no gradients)
- [x] `[GEMINI]` **ANTI-SLOP VALIDATION** (lint + type-check passed)

### Phase 2: Component Library ✅ Complete
- [x] `[GEMINI]` Build all 21 components (Button, ProductCard, CategoryCard, etc.)
- [x] `[GEMINI]` Build `/app/component-preview/page.tsx`
- [x] `[HUMAN]` **REVIEW AND APPROVE** component library at localhost:3000/component-preview

### Phase 3: Shop Pages ✅ Complete
- [x] `[GEMINI]` Homepage, Categories, Category listing, Product detail
- [x] `[GEMINI]` SEO Implementation (OpenGraph + JSON-LD on product pages)
- [x] `[GEMINI]` Search, Cart, Checkout, Order confirmation
- [x] `[GEMINI]` Profile, My Orders
- [x] `[GEMINI]` About, Contact, Help/FAQ, Track Order
- [x] `[GEMINI]` Shipping, Returns, Privacy Policy, Terms & Conditions
- [x] `[GEMINI]` Phase Review & Self-Audit

### Phase 4: Admin Panel UI ✅ Complete
- [x] `[GEMINI]` Admin login page (`/admin/login`)
- [x] `[GEMINI]` Admin layout (sidebar, header, breadcrumb)
- [x] `[GEMINI]` Admin dashboard (`/admin`)
- [x] `[GEMINI]` Admin orders list + detail + print invoice/label
- [x] `[GEMINI]` Admin products list + add/edit form
- [x] `[GEMINI]` Admin categories tree view
- [x] `[GEMINI]` Admin customers list + detail
- [x] `[GEMINI]` Admin analytics (all 5 tabs)
- [x] `[GEMINI]` Admin banners + content manager
- [x] `[GEMINI]` Admin coupons
- [x] `[GEMINI]` Admin inventory
- [x] `[GEMINI]` Admin settings
- [x] `[GEMINI]` Admin users
- [x] `[GEMINI]` Admin audit log
- [x] `[GEMINI]` PostHog tracking calls wired in (per `docs/ANALYTICS.md`)
- [x] `[GEMINI]` Phase Review & Self-Audit

### Phase 5: Gaps & Polish ✅ Complete (Gemini Portion)
- [x] `[GEMINI]` Admin flash deals UI (`/admin/flash-deals`) — Built with mock data.
- [x] `[GEMINI]` Build `src/app/error.tsx` — global error boundary page.
- [x] `[GEMINI]` Build `src/app/loading.tsx` — global Suspense fallback (brand loader).
- [x] `[GEMINI]` Build `src/app/not-found.tsx` — global 404 page with Bangla support.
- [ ] `[GEMINI]` Homepage: wire up dynamic banner from `GET /api/banners` (once Claude marks [READY])
- [ ] `[GEMINI]` Homepage: wire up flash deal countdown from `GET /api/flash-deal` (once Claude marks [READY])
- [ ] `[GEMINI]` Checkout: wire up "Apply Coupon" button to `POST /api/coupons/validate` (once Claude marks [READY])
- [x] `[GEMINI]` SEO: add dynamic OpenGraph + JSON-LD to category pages (`/category/[slug]`)
- [x] `[GEMINI]` SEO: add structured data (Organization schema) to homepage and About page
- [x] `[GEMINI]` Facebook Messenger chat widget — added floating widget.
- [x] `[GEMINI]` PWA "Add to Home Screen" banner prompt — implemented with `beforeinstallprompt`.
- [x] `[GEMINI]` **Phase Review & Self-Audit** — All autonomous Phase 5 tasks completed. Wiring pending.

---

## 🔧 CLAUDE AGENT TASKS (Backend)

> **Read before starting:**
> `docs/API_SPEC.md` — all route contracts
> `docs/DB_SCHEMA.md` — all tables and columns
> `docs/SECURITY.md` — all security requirements
> `docs/CODING_STANDARDS.md` — file structure and comment rules

### Phase 1: Infrastructure & Helpers (Start Here)
- [ ] `[CLAUDE]` Install packages: `npm install drizzle-orm @neondatabase/serverless drizzle-kit @upstash/ratelimit @upstash/redis sharp @aws-sdk/client-s3`
- [ ] `[CLAUDE]` Add scripts to `package.json`: `db:generate`, `db:migrate`, `db:studio`
- [ ] `[CLAUDE]` Create `src/lib/env.ts` — validate ALL required env vars at startup (Zod schema, throws on missing)
- [ ] `[CLAUDE]` Create `src/db/schema.ts` — implement ALL tables from `docs/DB_SCHEMA.md`
- [ ] `[CLAUDE]` Run first migration: `npm run db:generate && npm run db:migrate`
- [ ] `[CLAUDE]` Create `src/db/seed.ts` — seed categories, products, admin user, default settings (see `docs/DB_SCHEMA.md` seed section)
- [ ] `[CLAUDE]` Create `src/lib/db.ts` — Neon/Drizzle connection
- [ ] `[CLAUDE]` Create `src/lib/auth.ts` — Supabase client + JWT verification helpers
- [ ] `[CLAUDE]` Create `src/lib/r2.ts` — Cloudflare R2 S3-compatible client (upload, delete, get URL)
- [ ] `[CLAUDE]` Create `src/lib/brevo.ts` — Brevo email client (order confirmation + shipping update templates)
- [ ] `[CLAUDE]` Create `src/lib/aamarpay.ts` — aamarPay client (initiate payment, verify webhook signature)
- [ ] `[CLAUDE]` Create `src/lib/courier.ts` — courier booking (Steadfast primary, Pathao + RedX fallback). Read `docs/skills/courier-integration.md` first.
- [ ] `[CLAUDE]` Create `src/lib/redis.ts` — Upstash Redis client for rate limiting
- [ ] `[CLAUDE]` Create `src/lib/audit.ts` — `logAuditEvent()` helper that writes to `audit_log` table
- [ ] `[CLAUDE]` Create `src/lib/errors.ts` — standard `{ error, code }` response helpers
- [ ] `[CLAUDE]` Create `src/lib/validate.ts` — shared Zod schemas (phone, BDT amount, pagination params)
- [ ] `[CLAUDE]` Create `src/constants/districts.ts` — all 64 Bangladesh districts + upazilas data
- [ ] `[CLAUDE]` Create `src/constants/routes.ts` — all app route paths as typed constants
- [ ] `[CLAUDE]` Create `src/constants/payment-methods.ts` — payment method configs (labels, fees, icons)
- [ ] `[CLAUDE]` Create `src/types/product.ts`, `order.ts`, `user.ts`, `cart.ts`, `payment.ts` — shared TypeScript types (coordinate with Gemini before changing)
- [ ] `[CLAUDE]` Create `src/middleware.ts` — protect `/admin/*` pages + `/api/admin/*` routes (RBAC). Read `docs/SECURITY.md` middleware pseudocode.

### Phase 2: Public API Routes
- [ ] `[CLAUDE]` `GET /api/products` — list with cursor pagination, category filter, search, sort (including `sort=popular` using `total_orders` column)
- [ ] `[CLAUDE]` `GET /api/products/[slug]` — single product detail (404 if deleted or inactive)
- [ ] `[CLAUDE]` `GET /api/categories` — full category tree (only active categories)
- [ ] `[CLAUDE]` `GET /api/banners` — active banners by position for homepage. See `docs/API_SPEC.md`.
- [ ] `[CLAUDE]` `GET /api/flash-deal` — current active flash deal (1 deal or null). See `docs/API_SPEC.md`.
- [ ] `[CLAUDE]` `POST /api/coupons/validate` — validate coupon code before order placement. See `docs/API_SPEC.md`.
- [ ] `[CLAUDE]` `POST /api/orders` — create order: verify stock, calculate price server-side, handle COD fee, call aamarPay for non-COD, send Brevo email, decrement stock + increment `total_orders`
- [ ] `[CLAUDE]` `GET /api/orders/[orderNumber]` — public order tracking (no auth needed)
- [ ] `[CLAUDE]` `POST /api/payment/initiate` — start aamarPay payment session
- [ ] `[CLAUDE]` `POST /api/payment/webhook` — aamarPay webhook: verify signature, idempotency check, update order. **Read `docs/skills/payment-integration.md` before writing this.**
- [ ] `[CLAUDE]` `GET /api/payment/callback` — redirect endpoint aamarPay sends user back to (handles success/fail/cancel URL params, redirects to `/order/[id]`)
- [ ] `[CLAUDE]` `POST /api/auth/otp` — send Supabase phone OTP (rate limited: 5/phone/10min via Upstash Redis)
- [ ] `[CLAUDE]` `POST /api/auth/verify` — verify OTP, return Supabase session token
- [ ] `[CLAUDE]` **Phase Review & Self-Audit** — Check all routes match `docs/API_SPEC.md` contracts exactly. Check auth/RBAC. Ask user for manual verification.

### Phase 3: Admin API Routes (All protected by middleware)
- [ ] `[CLAUDE]` `GET /api/admin/dashboard/stats` — today/week/month summary + pending + low stock
- [ ] `[CLAUDE]` `GET /api/admin/orders` — list with filters, search, pagination, sort
- [ ] `[CLAUDE]` `GET /api/admin/orders/[id]` — full order detail including timeline + courier info
- [ ] `[CLAUDE]` `PATCH /api/admin/orders/[id]/status` — update status + add note → appends `order_history`
- [ ] `[CLAUDE]` `PATCH /api/admin/orders/[id]/payment` — mark COD as paid/failed (COD orders only)
- [ ] `[CLAUDE]` `PATCH /api/admin/orders/[id]/notes` — update internal admin notes
- [ ] `[CLAUDE]` `POST /api/admin/orders/[id]/courier` — book shipment (Steadfast/Pathao/RedX). Read `docs/skills/courier-integration.md`.
- [ ] `[CLAUDE]` `POST /api/admin/orders/[id]/refund` — aamarPay refund initiation (Super Admin only)
- [ ] `[CLAUDE]` `GET /api/admin/orders/export` — CSV export with date range (Super Admin only)
- [ ] `[CLAUDE]` `GET /api/admin/products` — list with cost_price + margin (margin % only for super_admin)
- [ ] `[CLAUDE]` `POST /api/admin/products` — create product, write `inventory_log` row for initial stock
- [ ] `[CLAUDE]` `GET /api/admin/products/[id]` — single product full detail
- [ ] `[CLAUDE]` `PATCH /api/admin/products/[id]` — partial update (costPrice + isFeatured restricted to super_admin)
- [ ] `[CLAUDE]` `DELETE /api/admin/products/[id]` — soft delete (Super Admin only)
- [ ] `[CLAUDE]` `PATCH /api/admin/products/[id]/restore` — restore soft-deleted (Super Admin only)
- [ ] `[CLAUDE]` `PATCH /api/admin/products/[id]/stock` — quick stock adjustment → writes `inventory_log`
- [ ] `[CLAUDE]` `POST /api/admin/upload` — R2 image upload with `sharp` compression → WebP, max 1200px wide
- [ ] `[CLAUDE]` `GET /api/admin/categories` — full category tree with product counts
- [ ] `[CLAUDE]` `POST /api/admin/categories` — create category
- [ ] `[CLAUDE]` `PATCH /api/admin/categories/[id]` — update category
- [ ] `[CLAUDE]` `DELETE /api/admin/categories/[id]` — deactivate (block if has products → 409)
- [ ] `[CLAUDE]` `PATCH /api/admin/categories/reorder` — bulk sort_order update
- [ ] `[CLAUDE]` `GET /api/admin/customers` — list with search + ban filter
- [ ] `[CLAUDE]` `GET /api/admin/customers/[id]` — profile + all orders + addresses
- [ ] `[CLAUDE]` `PATCH /api/admin/customers/[id]/ban` — ban with reason (Super Admin only)
- [ ] `[CLAUDE]` `PATCH /api/admin/customers/[id]/unban` — unban (Super Admin only)
- [ ] `[CLAUDE]` `GET /api/admin/analytics/revenue` — revenue by period (see `docs/ANALYTICS.md §4`)
- [ ] `[CLAUDE]` `GET /api/admin/analytics/orders` — funnel + heatmap + COD success rate
- [ ] `[CLAUDE]` `GET /api/admin/analytics/products` — top/low performing by period
- [ ] `[CLAUDE]` `GET /api/admin/analytics/customers` — new/returning + district breakdown + top customers
- [ ] `[CLAUDE]` `GET /api/admin/analytics/inventory` — stock summary (totalStockValue super_admin only)
- [ ] `[CLAUDE]` `GET /api/admin/banners` — all banners including inactive
- [ ] `[CLAUDE]` `POST /api/admin/banners` — create banner
- [ ] `[CLAUDE]` `PATCH /api/admin/banners/[id]` — update banner
- [ ] `[CLAUDE]` `DELETE /api/admin/banners/[id]` — delete banner
- [ ] `[CLAUDE]` `PATCH /api/admin/banners/reorder` — bulk sort_order update
- [ ] `[CLAUDE]` `GET /api/admin/flash-deals` — list all deals (past + active)
- [ ] `[CLAUDE]` `POST /api/admin/flash-deals` — create deal (validate flash_price < product.price, no overlap)
- [ ] `[CLAUDE]` `PATCH /api/admin/flash-deals/[id]` — update / deactivate early
- [ ] `[CLAUDE]` `GET /api/admin/coupons` — list with usage stats (Super Admin only)
- [ ] `[CLAUDE]` `POST /api/admin/coupons` — create coupon (Super Admin only)
- [ ] `[CLAUDE]` `PATCH /api/admin/coupons/[id]` — update coupon (Super Admin only)
- [ ] `[CLAUDE]` `DELETE /api/admin/coupons/[id]` — deactivate coupon (Super Admin only)
- [ ] `[CLAUDE]` `GET /api/admin/inventory` — stock levels with low-stock highlighting
- [ ] `[CLAUDE]` `POST /api/admin/inventory/adjust` — manual stock adjustment → writes `inventory_log`
- [ ] `[CLAUDE]` `GET /api/admin/inventory/log` — full adjustment history with filters
- [ ] `[CLAUDE]` `GET /api/admin/inventory/export` — CSV export (Super Admin only)
- [ ] `[CLAUDE]` `GET /api/admin/settings` — all settings as typed object (Super Admin only)
- [ ] `[CLAUDE]` `PATCH /api/admin/settings` — partial update (logs before/after to audit_log)
- [ ] `[CLAUDE]` `GET /api/admin/users` — list admin accounts (Super Admin only)
- [ ] `[CLAUDE]` `POST /api/admin/users` — create admin account (Super Admin only)
- [ ] `[CLAUDE]` `PATCH /api/admin/users/[id]` — update role / deactivate (Super Admin only, cannot self-deactivate)
- [ ] `[CLAUDE]` `GET /api/admin/audit-log` — paginated audit entries with filters (Super Admin only)
- [ ] `[CLAUDE]` Mark each completed route `[READY]` in `docs/API_SPEC.md`
- [ ] `[CLAUDE]` **Phase Review & Self-Audit** — Verify all routes match API_SPEC.md contracts. Verify RBAC on every route. Ask user for manual verification.

### Phase 4: Security, Integrations & Polish
- [ ] `[CLAUDE]` Verify Zod validation schema at top of EVERY route handler (no route touches DB without validating)
- [ ] `[CLAUDE]` Verify Upstash Redis rate limiting wired on all auth + payment endpoints (see `docs/SECURITY.md §4`)
- [ ] `[CLAUDE]` Add HTTP security headers to `next.config.ts` (full list in `docs/SECURITY.md §6`)
- [ ] `[CLAUDE]` ISR cache tags: add `revalidateTag('products')` to product list/detail routes to avoid DB hammering
- [ ] `[CLAUDE]` COD Trust Score: add to customer profile query — calculate as `(delivered_cod_orders / total_cod_orders) * 100` using `order_history`
- [ ] `[CLAUDE]` Write Brevo order confirmation email template (HTML + text, includes order items + total + tracking link)
- [ ] `[CLAUDE]` Write Brevo shipping update email template (includes courier name + tracking code + tracking URL)
- [ ] `[CLAUDE]` Server-side PostHog event: fire `order_placed` from `POST /api/orders` handler
- [ ] `[CLAUDE]` Server-side PostHog event: fire `payment_confirmed` from `POST /api/payment/webhook` handler
- [ ] `[CLAUDE]` Full security audit: run through ALL checkboxes in `docs/SECURITY.md` ✅ checklist
- [ ] `[CLAUDE]` **Phase Review & Self-Audit** — Run security checklist, verify email templates send correctly in sandbox, ask user for manual verification.

### Phase 5: PWA Setup
- [ ] `[CLAUDE]` Install Serwist: `npm install serwist @serwist/next`
- [ ] `[CLAUDE]` Create `public/manifest.json` — app name, icons (192px + 512px), theme color `#10b981`, display standalone
- [ ] `[CLAUDE]` Generate PWA icons: 192×192 and 512×512 PNG from logo (use `sharp` or instruct human)
- [ ] `[CLAUDE]` Configure Serwist in `next.config.ts` — service worker with offline fallback
- [ ] `[CLAUDE]` Create `src/app/offline/page.tsx` — offline page shown when user loses connection
- [ ] `[CLAUDE]` Test: open Chrome DevTools → Application → Service Workers → verify registration
- [ ] `[CLAUDE]` **Phase Review & Self-Audit** — Verify "Add to Home Screen" prompt appears on Android Chrome. Ask user to test on real device.

---

## 🐛 BUG QUEUE

*Agents add bugs here when found. Claude agent is primary bug fixer.*

| ID | Description | Reported By | Priority | Status |
|----|-------------|-------------|----------|--------|
| — | No bugs yet | — | — | — |

---

## 💬 AGENT NOTES

*Use this section to leave notes for the other agent*

**From Gemini → Claude:**
- All public shop pages and admin UI are built with mock/static data.
- Once you mark API routes `[READY]` in `docs/API_SPEC.md`, I will wire the real data calls.
- Priority order for wiring: Products → Categories → Cart/Checkout → Orders → Admin Dashboard.

**From Claude → Gemini:**
*(Leave notes here when Claude needs something from Gemini)*

---

*Update task status as you work. [/] = in progress, [x] = done, [!] = blocked.*
*Add new tasks as they are discovered — do not wait for someone to add them.*
