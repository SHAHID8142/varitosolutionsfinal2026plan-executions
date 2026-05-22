# TASKS.md — Varito Solutions
## Agent Task Queue | Updated by both agents

> **HOW THIS WORKS:**
> - Tasks marked `[GEMINI]` → Gemini Flash agent does it
> - Tasks marked `[CLAUDE]` → Claude Code agent does it
> - Tasks marked `[BOTH]` → Both agents must coordinate
> - Tasks marked `[HUMAN]` → User must do it (decision or external action)
> - Status: `[ ]` pending → `[/]` in progress → `[x]` done → `[!]` blocked

---

## 🚨 IMMEDIATE TASKS (Before Agents Can Build)

- [ ] `[HUMAN]` Register domain at Namecheap or Porkbun
- [ ] `[HUMAN]` Point domain to Cloudflare nameservers
- [ ] `[HUMAN]` Initialize Next.js project: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir`
- [ ] `[HUMAN]` Push initial Next.js project to this repo
- [ ] `[HUMAN]` Connect GitHub repo to Cloudflare Pages (auto-deploy on push)
- [ ] `[HUMAN]` Create `.env.local` with all API keys (see docs/ENV_VARS.md)
- [ ] `[HUMAN]` Create Neon DB project named `varito-production`

---

## 🎨 GEMINI AGENT TASKS (UI/UX)

### Phase 1: Design System Setup
- [ ] `[GEMINI]` Install shadcn/ui: `npx shadcn@latest init`
- [ ] `[GEMINI]` Add base shadcn components: `npx shadcn@latest add button card dialog sheet input select badge carousel skeleton toast`
- [ ] `[GEMINI]` Create `src/styles/globals.css` with all CSS variables from `docs/DESIGN_SYSTEM.md`
- [ ] `[GEMINI]` Create `src/lib/fonts.ts` — load Hind Siliguri from Google Fonts

### Phase 2: Component Library (MUST COMPLETE BEFORE ANY PAGE)
- [ ] `[GEMINI]` Build `<Button>` variants (primary, secondary, outline, ghost, danger)
- [ ] `[GEMINI]` Build `<ProductCard>` (image, name, price, sale price, cart button)
- [ ] `[GEMINI]` Build `<CategoryCard>` (image, name, product count)
- [ ] `[GEMINI]` Build `<PriceTag>` (formatted BDT price, sale price, discount %)
- [ ] `[GEMINI]` Build `<Badge>` variants (new, sale, out-of-stock, COD, verified)
- [ ] `[GEMINI]` Build `<Header>` (logo, search, cart icon, mobile menu)
- [ ] `[GEMINI]` Build `<BottomNav>` (mobile: Home, Categories, Search, Cart, Profile)
- [ ] `[GEMINI]` Build `<Footer>` (links, social, phone, address)
- [ ] `[GEMINI]` Build `<SearchBar>` (input + suggestions dropdown)
- [ ] `[GEMINI]` Build `<ImageGallery>` (main image + thumbnails, zoom on tap)
- [ ] `[GEMINI]` Build `<QuantitySelector>` (minus, number, plus)
- [ ] `[GEMINI]` Build `<AddressForm>` (District → Thana → Area dropdowns)
- [ ] `[GEMINI]` Build `<OrderSummary>` (items, delivery, COD fee, total)
- [ ] `[GEMINI]` Build `<PaymentMethodSelector>` (COD, bKash, Nagad, Card)
- [ ] `[GEMINI]` Build `<EmptyState>` (icon, title, description, CTA button)
- [ ] `[GEMINI]` Build `<LoadingSkeleton>` variants (product card, list item, page)
- [ ] `[GEMINI]` Build `<WhatsAppButton>` (floating, fixed bottom-right)
- [ ] `[GEMINI]` Build `<Toast>` (success, error, info variants)
- [ ] `[GEMINI]` Build `<Breadcrumb>` (navigation trail)
- [ ] `[GEMINI]` Build `<RatingStars>` (display + interactive)
- [ ] `[GEMINI]` Build `/app/component-preview/page.tsx` (shows ALL components)
- [ ] `[HUMAN]` **REVIEW AND APPROVE** component library at localhost:3000/component-preview

### Phase 3: Page Building (Only After Component Approval)
- [ ] `[GEMINI]` Homepage (`/`) — hero banner, categories grid, featured products, flash deal, announcement bar
- [ ] `[GEMINI]` Category listing page (`/category/[slug]`) — grid, filters, sort
- [ ] `[GEMINI]` Product detail page (`/product/[slug]`) — gallery, details, add to cart, trust signals
- [ ] `[GEMINI]` **SEO Implementation** — Add dynamic OpenGraph tags and JSON-LD schema to product pages
- [ ] `[GEMINI]` Search results page (`/search`) — results grid
- [ ] `[GEMINI]` Cart page (`/cart`) — items, COD surcharge, proceed
- [ ] `[GEMINI]` Checkout page (`/checkout`) — address, payment, COD default
- [ ] `[GEMINI]` Order confirmation page (`/order/[id]`) — success, order number
- [ ] `[GEMINI]` My orders page (`/account/orders`) — list, status tracking
- [ ] `[GEMINI]` About Us page (`/about`) — trust signals, team, location
- [ ] `[GEMINI]` Contact page (`/contact`) — phone, WhatsApp, form
- [ ] `[GEMINI]` Returns policy page (`/returns`) — policy text

### Phase 4: Admin Panel UI (Read docs/ADMIN_SPEC.md first)
- [ ] `[GEMINI]` Admin login page (`/admin/login`) — phone OTP login for admins
- [ ] `[GEMINI]` Admin layout — sidebar (all 12 sections), header (admin name + logout), breadcrumb
- [ ] `[GEMINI]` Admin dashboard (`/admin`) — stats cards, revenue overview, pending orders, low stock alerts
- [ ] `[GEMINI]` Admin orders list (`/admin/orders`) — table with filter, search, sort, inline status update
- [ ] `[GEMINI]` Admin order detail (`/admin/orders/[id]`) — full details, timeline, notes, print invoice
- [ ] `[GEMINI]` **Invoice & Label Printing** — A4 Customer Invoice component + Thermal Courier Barcode component
- [ ] `[GEMINI]` Admin products list (`/admin/products`) — table with quick stock/price edit, low stock highlight
- [ ] `[GEMINI]` Admin add product (`/admin/products/new`) — full form with multi-image upload
- [ ] `[GEMINI]` Admin edit product (`/admin/products/[id]/edit`) — same form, pre-populated
- [ ] `[GEMINI]` Admin categories (`/admin/categories`) — tree view, create/edit/reorder
- [ ] `[GEMINI]` Admin customers (`/admin/customers`) — list, search, ban/unban
- [ ] `[GEMINI]` Admin analytics (`/admin/analytics`) — revenue/orders/products/customers tabs with charts
- [ ] `[GEMINI]` Admin banners (`/admin/content`) — hero + secondary + announcement manager
- [ ] `[GEMINI]` Admin coupons (`/admin/coupons`) — create/manage discount codes
- [ ] `[GEMINI]` Admin inventory (`/admin/inventory`) — stock levels, adjustments, log
- [ ] `[GEMINI]` Admin settings (`/admin/settings`) — delivery, payments, general, maintenance mode
- [ ] `[GEMINI]` Admin users (`/admin/users`) — create/manage admin accounts
- [ ] `[GEMINI]` Admin audit log (`/admin/audit-log`) — paginated action history
- [ ] `[GEMINI]` Add PostHog tracking calls per docs/ANALYTICS.md event map

---

## 🔧 CLAUDE AGENT TASKS (Backend)

### Phase 1: Database & Infrastructure
- [ ] `[CLAUDE]` Install Drizzle: `npm install drizzle-orm @neondatabase/serverless drizzle-kit`
- [ ] `[CLAUDE]` Create `src/db/schema.ts` from `docs/DB_SCHEMA.md`
- [ ] `[CLAUDE]` Add scripts to `package.json`: `db:generate`, `db:migrate`, `db:studio`
- [ ] `[CLAUDE]` Run first migration on Neon DB
- [ ] `[CLAUDE]` Create `src/lib/db.ts` — database connection helper
- [ ] `[CLAUDE]` Create `src/lib/r2.ts` — Cloudflare R2 client
- [ ] `[CLAUDE]` Create `src/lib/brevo.ts` — email client
- [ ] `[CLAUDE]` Create `src/lib/aamarpay.ts` — payment client
- [ ] `[CLAUDE]` Create `src/lib/auth.ts` — Supabase auth helpers

### Phase 2: API Routes (Read docs/API_SPEC.md + docs/ADMIN_SPEC.md + docs/SECURITY.md first)
- [ ] `[CLAUDE]` `GET /api/products` — list with pagination, filters, full-text search
- [ ] `[CLAUDE]` `GET /api/products/[slug]` — single product detail
- [ ] `[CLAUDE]` `GET /api/categories` — full category hierarchy
- [ ] `[CLAUDE]` `POST /api/orders` — create order, server-side price calc, Brevo email
- [ ] `[CLAUDE]` `GET /api/orders/[orderNumber]` — order status (public, no auth)
- [ ] `[CLAUDE]` `POST /api/payment/initiate` — start aamarPay session
- [ ] `[CLAUDE]` `POST /api/payment/webhook` — verify signature, update order
- [ ] `[CLAUDE]` `POST /api/auth/otp` — send Supabase OTP (rate limited)
- [ ] `[CLAUDE]` `POST /api/auth/verify` — verify OTP, return session
- [ ] `[CLAUDE]` Middleware: protect /admin/* + /api/admin/* (RBAC — see docs/SECURITY.md)

### Phase 3: Admin API Routes (All need RBAC middleware)
- [ ] `[CLAUDE]` `GET /api/admin/dashboard/stats` — revenue + order counts + alerts
- [ ] `[CLAUDE]` `GET/PATCH /api/admin/orders` — list + status update + COD mark paid
- [ ] `[CLAUDE]` `GET /api/admin/orders/[id]` — full order detail
- [ ] `[CLAUDE]` `POST /api/admin/orders/[id]/courier` — send order to Steadfast/Pathao API
- [ ] `[CLAUDE]` `POST /api/admin/orders/[id]/refund` — initiate refund (Super Admin)
- [ ] `[CLAUDE]` `GET /api/admin/orders/export` — CSV export (Super Admin)
- [ ] `[CLAUDE]` `GET/POST /api/admin/products` — list (with cost_price) + create
- [ ] `[CLAUDE]` `GET/PATCH/DELETE /api/admin/products/[id]` — get + update + soft delete
- [ ] `[CLAUDE]` `PATCH /api/admin/products/[id]/restore` — restore deleted product
- [ ] `[CLAUDE]` `PATCH /api/admin/products/[id]/stock` — quick stock adjustment
- [ ] `[CLAUDE]` `POST /api/admin/upload` — R2 image upload WITH `sharp` compression (WebP, max 1200px)
- [ ] `[CLAUDE]` `GET/POST/PATCH/DELETE /api/admin/categories` — category CRUD + reorder
- [ ] `[CLAUDE]` `GET /api/admin/customers` — list customers
- [ ] `[CLAUDE]` `GET /api/admin/customers/[id]` — customer detail + order history
- [ ] `[CLAUDE]` `PATCH /api/admin/customers/[id]/ban` — ban with reason (Super Admin)
- [ ] `[CLAUDE]` `GET /api/admin/analytics/revenue` — revenue by period
- [ ] `[CLAUDE]` `GET /api/admin/analytics/orders` — funnel + heatmap
- [ ] `[CLAUDE]` `GET /api/admin/analytics/products` — top + low performing
- [ ] `[CLAUDE]` `GET /api/admin/analytics/customers` — new/returning + districts
- [ ] `[CLAUDE]` `GET /api/admin/analytics/inventory` — stock status summary
- [ ] `[CLAUDE]` `GET/POST/PATCH/DELETE /api/admin/banners` — banner CRUD + reorder
- [ ] `[CLAUDE]` `GET/POST/PATCH/DELETE /api/admin/coupons` — coupon CRUD (Super Admin)
- [ ] `[CLAUDE]` `GET/POST /api/admin/inventory` — stock levels + manual adjustment
- [ ] `[CLAUDE]` `GET/PATCH /api/admin/settings` — settings CRUD (Super Admin)
- [ ] `[CLAUDE]` `GET/POST/PATCH /api/admin/users` — admin user management (Super Admin)
- [ ] `[CLAUDE]` `GET /api/admin/audit-log` — paginated audit entries (Super Admin)
- [ ] `[CLAUDE]` Mark each completed route `[READY]` in `docs/API_SPEC.md`

### Phase 4: Security, Integrations & Polish
- [ ] `[CLAUDE]` Add Zod validation schemas to ALL routes (see docs/SECURITY.md)
- [ ] `[CLAUDE]` Implement Upstash Redis rate limiting on auth endpoints
- [ ] `[CLAUDE]` Add HTTP security headers to `next.config.ts`
- [ ] `[CLAUDE]` Create `src/lib/env.ts` — validate all required env vars at startup
- [ ] `[CLAUDE]` Create `src/lib/audit.ts` — audit log helper function
- [ ] `[CLAUDE]` Implement Next.js ISR cache tags (revalidate) for products endpoints to save DB compute
- [ ] `[CLAUDE]` Implement COD Trust Score calculation in customer profile queries
- [ ] `[CLAUDE]` Write order confirmation Brevo email template
- [ ] `[CLAUDE]` Write shipping update Brevo email template
- [ ] `[CLAUDE]` Add server-side PostHog events (order placed, payment confirmed)
- [ ] `[CLAUDE]` Create `src/db/seed.ts` — seed data for development
- [ ] `[CLAUDE]` Full security audit — run through ALL items in docs/SECURITY.md checklist
- [ ] `[CLAUDE]` Create `src/constants/districts.ts` — all 64 Bangladesh districts + upazilas

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
*(Leave notes here when Gemini needs something from Claude)*

**From Claude → Gemini:**
*(Leave notes here when Claude needs something from Gemini)*

---

*Update task status as you work. [/] = in progress, [x] = done, [!] = blocked.*
*Add new tasks as they are discovered — do not wait for someone to add them.*
