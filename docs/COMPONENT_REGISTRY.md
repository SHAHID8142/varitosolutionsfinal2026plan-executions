# COMPONENT_REGISTRY.md — Varito Solutions
## All UI Components | Status Tracking | Gemini Agent Builds This

> **GEMINI AGENT:** Update this file as you build components.
> **HUMAN:** Review the "Preview URL" column to approve components.
> Status: `[ ]` pending | `[/]` in progress | `[x]` built | `[✓]` approved by human

---

## Component Approval Status

**Overall:** 21 / 21 components built | 0 / 21 approved

**Review URL (when dev server running):** `http://localhost:3000/component-preview`

---

## Base UI Components (`src/components/ui/`)

| Status | Component | File | Preview Section | Notes |
|--------|-----------|------|----------------|-------|
| `[x]` | Button | `button.tsx` | Buttons | 5 variants required |
| `[x]` | PriceTag | `price-tag.tsx` | Prices | BDT format, sale price, discount % |
| `[x]` | Badge | `badge.tsx` | Badges | new, sale, out-of-stock, COD, verified |
| `[x]` | QuantitySelector | `quantity-selector.tsx` | Forms | Minus / number / plus |
| `[x]` | RatingStars | `rating-stars.tsx` | Display | Display + interactive modes |
| `[x]` | LoadingSkeleton | `loading-skeleton.tsx` | States | ProductCard, ListItem, Page variants |
| `[x]` | EmptyState | `empty-state.tsx` | States | Icon + title + description + CTA |
| `[x]` | Toast | `toast.tsx` | Feedback | success, error, info (using sonner) |
| `[x]` | Breadcrumb | `breadcrumb.tsx` | Navigation | Standard breadcrumb trail |
| `[x]` | Tabs | `tabs.tsx` | Navigation | Granular workflow navigation |

## Shop Components (`src/components/shop/`)

| Status | Component | File | Preview Section | Notes |
|--------|-----------|------|----------------|-------|
| `[x]` | ProductCard | `product-card.tsx` | Cards | Image, name, price, cart button |
| `[x]` | CategoryCard | `category-card.tsx` | Cards | Image, name, product count |
| `[x]` | ImageGallery | `image-gallery.tsx` | Product | Main + thumbnails, zoom on tap |
| `[x]` | OrderSummary | `order-summary.tsx` | Checkout | Items, delivery, COD fee, total |
| `[x]` | PaymentMethodSelector | `payment-method-selector.tsx` | Checkout | COD, bKash, Nagad, Card |
| `[x]` | AddressForm | `address-form.tsx` | Forms | District → Thana → Area dropdowns |

## Layout Components (`src/components/layout/`)

| Status | Component | File | Preview Section | Notes |
|--------|-----------|------|----------------|-------|
| `[x]` | Header | `header.tsx` | Layout | Logo, search, cart, mobile menu |
| `[x]` | BottomNav | `bottom-nav.tsx` | Layout | Mobile: Home, Categories, Search, Cart, Profile |
| `[x]` | Footer | `footer.tsx` | Layout | Links, social, phone, address |
| `[x]` | SearchBar | `search-bar.tsx` | Layout | Input + suggestions dropdown |
| `[x]` | WhatsAppButton | `whatsapp-button.tsx` | Layout | Fixed floating button |

## Admin UI Components (`src/components/admin/`)

| Status | Component | File | Preview Section | Notes |
|--------|-----------|------|----------------|-------|
| `[x]` | StatsCard | `stats-card.tsx` | Admin | Dashboard metric cards |
| `[x]` | OrderStatusBadge | `order-status-badge.tsx` | Admin | Color-coded status pills |
| `[x]` | OrdersTable | `orders-table.tsx` | Admin | Advanced data table with filters |
| `[x]` | OrderTimeline | `order-timeline.tsx` | Admin | Vertical status history |
| `[x]` | ProductsTable | `products-table.tsx` | Admin | Catalogue table with inline edit |
| `[x]` | ProductForm | `product-form.tsx` | Admin | Multi-step creation/edit form |
| `[x]` | ImageUploader | `image-uploader.tsx` | Admin | Multi-image upload with R2 focus |
| `[x]` | CategoryTree | `category-tree.tsx` | Admin | Hierarchical category manager |
| `[x]` | FlashDealsTable | `flash-deals-table.tsx` | Admin | Timed promotion management |
| `[x]` | FlashDealForm | `flash-deal-form.tsx` | Admin | Product promotion scheduler |
| `[x]` | FlashDealCountdown | `flash-deal-countdown.tsx` | Display | Real-time deal timer |

## SEO & Engagement Components (`src/components/shop/` & `src/components/ui/`)

| Status | Component | File | Preview Section | Notes |
|--------|-----------|------|----------------|-------|
| `[x]` | ProductSchema | `product-schema.tsx` | SEO | JSON-LD for individual products |
| `[x]` | CategorySchema | `category-schema.tsx` | SEO | JSON-LD for collection pages |
| `[x]` | OrganizationSchema | `organization-schema.tsx` | SEO | JSON-LD for brand identification |
| `[x]` | FacebookMessenger | `facebook-messenger.tsx` | Engagement | Floating chat widget |
| `[x]` | PWAInstallPrompt | `pwa-install-prompt.tsx` | Engagement | Smart banner for mobile install |

## Admin Layout Components (`src/components/layout/`)

| Status | Component | File | Preview Section | Notes |
|--------|-----------|------|----------------|-------|
| `[x]` | AdminSidebar | `admin-sidebar.tsx` | Admin Layout | Collapsible sidebar with 12 sections |
| `[x]` | AdminHeader | `admin-header.tsx` | Admin Layout | Glassmorphism bar with search/profile |
| `[x]` | AdminBreadcrumb | `admin-breadcrumb.tsx` | Admin Layout | Hierarchy tracking |

## Preview Page

| Status | File | URL |
|--------|------|-----|
| `[x]` | `src/app/component-preview/page.tsx` | `/component-preview` |

---

## Component Specification Details

### Button (`src/components/ui/button.tsx`)
**Variants required:**
```
primary  — Blue background, white text, primary actions
secondary — White background, blue border, secondary actions
accent    — Orange background, white text, CTA / "Buy Now" / "Add to Cart"
ghost     — Transparent, gray text, low-priority actions
danger    — Red background, white text, delete/cancel
```
**States:** default, hover, active, disabled, loading (spinner)
**Sizes:** sm (36px), md (44px — default), lg (52px)

### ProductCard (`src/components/shop/product-card.tsx`)
**Must show:**
- Product image (square, 1:1 aspect ratio)
- Product name (max 2 lines, truncate)
- Price (৳ formatted)
- Sale price if on sale (strikethrough original)
- Discount % badge if on sale
- "Add to Cart" button
- "New" badge if less than 7 days old
- "Out of Stock" overlay if `stock === 0`

**Props:**
```typescript
interface ProductCardProps {
  id: string
  name: string
  nameBn?: string
  slug: string
  image: string
  price: number
  salePrice?: number
  stock: number
  isNew?: boolean
}
```

### Header (`src/components/layout/header.tsx`)
**Desktop:** Logo left | Search center | Cart + notification right
**Mobile:** Hamburger left | Logo center | Cart right
**Must include:** Phone number (visible on both)
**Sticky:** Yes, `position: sticky; top: 0; z-index: 50`

### BottomNav (`src/components/layout/bottom-nav.tsx`)
**Tabs:** Home | Categories | Search | Cart | Profile
**Active state:** Primary color icon + label
**Cart badge:** Show count when items in cart
**Safe area:** Add `padding-bottom: env(safe-area-inset-bottom)`

### AddressForm (`src/components/shop/address-form.tsx`)
**Fields:**
1. Full Name (text input)
2. Phone Number (tel input, BD format: 01XXXXXXXXX)
3. District (dropdown — all 64 districts of Bangladesh)
4. Upazila/Thana (dropdown — filtered by district)
5. Area/Union (text input — freeform)
6. Road/Street (text input)
7. House/Flat No. (text input)
8. Landmark (text input — optional)
9. Address Label (radio: Home | Office | Other)

### PaymentMethodSelector (`src/components/shop/payment-method-selector.tsx`)
**Options (in this order):**
1. **COD** (Cash on Delivery) — default selected, show +৳40 fee clearly
2. **bKash** — pink icon, bKash logo
3. **Nagad** — orange icon, Nagad logo
4. **Card** (Visa/Mastercard) — standard card icons

**Rule:** COD MUST be the first option and default selected.

---

## Design Token Reference

See `docs/DESIGN_SYSTEM.md` for all color tokens, typography, and spacing.

**Quick reference for component building:**
- Primary color: `var(--color-primary-500)` = `#10b981` (Emerald — updated after Premium Emerald Refactor)
- Accent/CTA: `var(--color-accent-500)` = `#F97316`
- Card border: `var(--color-border)` = `#E5E7EB`
- Minimum touch target: 44×44px
- Minimum font size: 16px for readable content

---

*Update status column as components are built and approved.*
*GEMINI AGENT: Change [ ] → [/] when starting, [x] when built, [✓] after human approval.*
