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

### Phase 1: Infrastructure & Helpers ✅ Complete
- [x] `[CLAUDE]` Install packages
- [x] `[CLAUDE]` Add scripts to `package.json`
- [x] `[CLAUDE]` Create `src/lib/env.ts`
- [x] `[CLAUDE]` Create `src/db/schema.ts`
- [x] `[CLAUDE]` Run first migration
- [x] `[CLAUDE]` Create `src/db/seed.ts`
- [x] `[CLAUDE]` Create `src/lib/db.ts`
- [x] `[CLAUDE]` Create `src/lib/auth.ts`
- [x] `[CLAUDE]` Create `src/lib/r2.ts`
- [x] `[CLAUDE]` Create `src/lib/brevo.ts`
- [x] `[CLAUDE]` Create `src/lib/aamarpay.ts`
- [ ] `[CLAUDE]` Create `src/lib/courier.ts` (Not found in lib)
- [x] `[CLAUDE]` Create `src/lib/redis.ts` (Implemented as ratelimit.ts)
- [x] `[CLAUDE]` Create `src/lib/audit.ts`
- [ ] `[CLAUDE]` Create `src/lib/errors.ts`
- [ ] `[CLAUDE]` Create `src/lib/validate.ts`
- [x] `[CLAUDE]` Create `src/constants/districts.ts`
- [x] `[CLAUDE]` Create `src/middleware.ts`

### Phase 2: Public API Routes ✅ Complete
- [x] `[CLAUDE]` `GET /api/products`
- [x] `[CLAUDE]` `GET /api/products/[slug]`
- [x] `[CLAUDE]` `GET /api/categories`
- [x] `[CLAUDE]` `GET /api/banners`
- [x] `[CLAUDE]` `GET /api/flash-deal`
- [x] `[CLAUDE]` `POST /api/coupons/validate`
- [x] `[CLAUDE]` `POST /api/orders`
- [x] `[CLAUDE]` `GET /api/orders/[orderNumber]`
- [x] `[CLAUDE]` `POST /api/payment/initiate`
- [x] `[CLAUDE]` `POST /api/payment/webhook`
- [x] `[CLAUDE]` `GET /api/payment/callback`
- [x] `[CLAUDE]` `POST /api/auth/otp`
- [x] `[CLAUDE]` `POST /api/auth/verify`

### Phase 3: Admin API Routes ✅ Complete
- [x] `[CLAUDE]` `GET /api/admin/dashboard/stats`
- [x] `[CLAUDE]` `GET /api/admin/orders`
- [x] `[CLAUDE]` `GET /api/admin/orders/[id]`
- [x] `[CLAUDE]` `PATCH /api/admin/orders/[id]/status`
- [x] `[CLAUDE]` `PATCH /api/admin/orders/[id]/payment`
- [x] `[CLAUDE]` `PATCH /api/admin/orders/[id]/notes`
- [ ] `[CLAUDE]` `POST /api/admin/orders/[id]/courier`
- [x] `[CLAUDE]` `POST /api/admin/orders/[id]/refund`
- [x] `[CLAUDE]` `GET /api/admin/orders/export`
- [x] `[CLAUDE]` `GET /api/admin/products`
- [x] `[CLAUDE]` `POST /api/admin/products`
- [x] `[CLAUDE]` `GET /api/admin/products/[id]`
- [x] `[CLAUDE]` `PATCH /api/admin/products/[id]`
- [x] `[CLAUDE]` `DELETE /api/admin/products/[id]`
- [x] `[CLAUDE]` `PATCH /api/admin/products/[id]/restore`
- [x] `[CLAUDE]` `PATCH /api/admin/products/[id]/stock`
- [x] `[CLAUDE]` `POST /api/admin/upload`
- [x] `[CLAUDE]` `GET /api/admin/categories`
- [x] `[CLAUDE]` `POST /api/admin/categories`
- [x] `[CLAUDE]` `PATCH /api/admin/categories/[id]`
- [x] `[CLAUDE]` `DELETE /api/admin/categories/[id]`
- [ ] `[CLAUDE]` `PATCH /api/admin/categories/reorder`
- [x] `[CLAUDE]` `GET /api/admin/customers`
- [x] `[CLAUDE]` `GET /api/admin/customers/[id]`
- [x] `[CLAUDE]` `PATCH /api/admin/customers/[id]/ban`
- [x] `[CLAUDE]` `PATCH /api/admin/customers/[id]/unban`
- [x] `[CLAUDE]` `GET /api/admin/analytics/revenue`
- [x] `[CLAUDE]` `GET /api/admin/analytics/orders`
- [x] `[CLAUDE]` `GET /api/admin/analytics/products`
- [x] `[CLAUDE]` `GET /api/admin/analytics/customers`
- [x] `[CLAUDE]` `GET /api/admin/analytics/inventory`
- [x] `[CLAUDE]` `GET /api/admin/banners`
- [x] `[CLAUDE]` `POST /api/admin/banners`
- [x] `[CLAUDE]` `PATCH /api/admin/banners/[id]`
- [x] `[CLAUDE]` `DELETE /api/admin/banners/[id]`
- [ ] `[CLAUDE]` `PATCH /api/admin/banners/reorder`
- [ ] `[CLAUDE]` `GET /api/admin/flash-deals` (Routes missing)
- [ ] `[CLAUDE]` `POST /api/admin/flash-deals`
- [ ] `[CLAUDE]` `PATCH /api/admin/flash-deals/[id]`
- [x] `[CLAUDE]` `GET /api/admin/coupons`
- [x] `[CLAUDE]` `POST /api/admin/coupons`
- [x] `[CLAUDE]` `PATCH /api/admin/coupons/[id]`
- [x] `[CLAUDE]` `DELETE /api/admin/coupons/[id]`
- [x] `[CLAUDE]` `GET /api/admin/inventory`
- [x] `[CLAUDE]` `POST /api/admin/inventory/adjust`
- [x] `[CLAUDE]` `GET /api/admin/inventory/log`
- [x] `[CLAUDE]` `GET /api/admin/inventory/export`
- [x] `[CLAUDE]` `GET /api/admin/settings`
- [x] `[CLAUDE]` `PATCH /api/admin/settings`
- [x] `[CLAUDE]` `GET /api/admin/users`
- [x] `[CLAUDE]` `POST /api/admin/users`
- [x] `[CLAUDE]` `PATCH /api/admin/users/[id]`
- [x] `[CLAUDE]` `GET /api/admin/audit-log`

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
