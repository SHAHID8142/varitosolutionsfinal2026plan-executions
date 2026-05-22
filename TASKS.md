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
- [ ] `[GEMINI]` Homepage (`/`) — hero, categories, featured products, flash deals
- [ ] `[GEMINI]` Category listing page (`/category/[slug]`) — grid, filters, sort
- [ ] `[GEMINI]` Product detail page (`/product/[slug]`) — gallery, details, add to cart
- [ ] `[GEMINI]` Search results page (`/search`) — results grid
- [ ] `[GEMINI]` Cart page (`/cart`) — items, COD surcharge, proceed
- [ ] `[GEMINI]` Checkout page (`/checkout`) — address, payment, COD default
- [ ] `[GEMINI]` Order confirmation page (`/order/[id]`) — success, order number
- [ ] `[GEMINI]` My orders page (`/account/orders`) — list, status tracking
- [ ] `[GEMINI]` About Us page (`/about`) — trust signals, team, location
- [ ] `[GEMINI]` Contact page (`/contact`) — phone, WhatsApp, form
- [ ] `[GEMINI]` Returns policy page (`/returns`) — policy text
- [ ] `[GEMINI]` Admin product list (`/admin/products`) — table, CRUD actions
- [ ] `[GEMINI]` Admin add/edit product (`/admin/products/new`, `/admin/products/[id]/edit`)
- [ ] `[GEMINI]` Admin orders (`/admin/orders`) — table, status update, filter
- [ ] `[GEMINI]` Admin dashboard home (`/admin`) — stats, recent orders

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

### Phase 2: API Routes
- [ ] `[CLAUDE]` `GET /api/products` — list with pagination, filters, search
- [ ] `[CLAUDE]` `GET /api/products/[slug]` — single product
- [ ] `[CLAUDE]` `GET /api/categories` — all categories with hierarchy
- [ ] `[CLAUDE]` `POST /api/orders` — create order (guest + authenticated)
- [ ] `[CLAUDE]` `GET /api/orders/[id]` — order status by order number
- [ ] `[CLAUDE]` `POST /api/payment/initiate` — start aamarPay payment
- [ ] `[CLAUDE]` `POST /api/payment/webhook` — aamarPay webhook handler
- [ ] `[CLAUDE]` `POST /api/auth/otp` — send Supabase OTP
- [ ] `[CLAUDE]` `POST /api/auth/verify` — verify OTP
- [ ] `[CLAUDE]` `GET /api/admin/orders` — admin: list orders
- [ ] `[CLAUDE]` `PATCH /api/admin/orders/[id]` — admin: update status
- [ ] `[CLAUDE]` `GET /api/admin/products` — admin: list products
- [ ] `[CLAUDE]` `POST /api/admin/products` — admin: create product
- [ ] `[CLAUDE]` `PATCH /api/admin/products/[id]` — admin: update product
- [ ] `[CLAUDE]` `DELETE /api/admin/products/[id]` — admin: soft delete
- [ ] `[CLAUDE]` `POST /api/admin/upload` — image upload to R2
- [ ] `[CLAUDE]` Mark each completed route as `[READY]` in `docs/API_SPEC.md`

### Phase 3: Integration & Polish
- [ ] `[CLAUDE]` Add Zod validation to all API routes
- [ ] `[CLAUDE]` Add rate limiting (auth endpoints)
- [ ] `[CLAUDE]` Write order confirmation email (Brevo)
- [ ] `[CLAUDE]` Write shipping update email (Brevo)
- [ ] `[CLAUDE]` Add PostHog server-side events (order placed, payment confirmed)
- [ ] `[CLAUDE]` Security audit — run through security checklist in CLAUDE.md

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
