# ADMIN_SPEC.md — Varito Solutions
## Complete Admin Panel Specification | Claude (Backend) + Gemini (UI)

> The admin panel is the **nerve centre** of the entire business.
> Every product, order, customer, payment, banner, coupon, setting,
> and analytics view is controlled from here. Nothing ships without this.
>
> **Backend (Claude):** Implement all admin API routes. Enforce RBAC on every single one.
> **Frontend (Gemini):** Build the UI only after Claude marks routes [READY].
> **Security:** Every admin route is protected. See `docs/SECURITY.md`.

---

## 👥 Admin Roles (RBAC)

Two roles. All permissions enforced server-side — never trust the client.

| Permission | Super Admin | Staff |
|-----------|-------------|-------|
| View orders | ✅ | ✅ |
| Update order status | ✅ | ✅ |
| Add order notes | ✅ | ✅ |
| View products | ✅ | ✅ |
| Create/edit products | ✅ | ✅ |
| Delete products | ✅ | ❌ |
| View customers | ✅ | ✅ |
| Ban/unban customers | ✅ | ❌ |
| View analytics | ✅ | ✅ |
| Export reports | ✅ | ❌ |
| Manage banners/content | ✅ | ✅ |
| Manage coupons | ✅ | ❌ |
| Manage settings | ✅ | ❌ |
| Manage admin users | ✅ | ❌ |
| View audit log | ✅ | ❌ |
| Process refunds | ✅ | ❌ |

---

## 🖥️ Admin Panel Sections (Pages)

### 1. Dashboard Home (`/admin`)
**Purpose:** At-a-glance business overview

**Metrics shown:**
- Today's orders (count + revenue)
- This week vs last week (% change)
- This month revenue
- Pending orders (need action)
- Low stock alerts (< 10 units)
- Recent 10 orders (table with quick status update)
- Top 5 products this week (by revenue)
- Payment method breakdown (COD / bKash / Nagad / Card pie chart)

**Data from:** `GET /api/admin/dashboard/stats`

---

### 2. Orders (`/admin/orders`)
**Purpose:** Manage the full order lifecycle with granular logistics pipeline

**Workflow Pipeline (Tabs):**
- **All Orders:** Complete database view
- **Pending:** New orders awaiting initial verification
- **Approved:** Verified orders moved to warehouse queue
- **Packing:** Currently being picked/packed/labelled
- **Shipping:** Handed over to courier, in-transit
- **Handover:** Out for final delivery with local agent
- **Delivered:** Successfully completed deliveries
- **Not Received:** Failed delivery attempts (customer unreachable/absent)
- **Cancelled:** Voided or customer-requested cancellations
- **Return:** Items returned to origin (RTO processing)
- **Refund:** Processed monetary refunds

**List view features:**
- **Tab-based Navigation:** Switch between workflow stages instantly
- **Contextual Actions:** Three-dot menu changes items based on the active tab (e.g., "Approve" in Pending, "Handover" in Packing)
- **Courier Trust Scorecard:** Integration with courier partner APIs (RedX/Pathao) to show customer's delivery success rate and trust level before approving
- **Search by:** Order number, customer phone, customer name
- **Export to CSV:** Stage-specific or bulk export
- **Pagination:** 20 per page, responsive table with sticky headers

**Order detail (`/admin/orders/[id]`):**
- Full order info: items, prices, address, payment
- Order timeline (status history with timestamps + who changed it)
- Admin notes field (internal, customer never sees this)
- Status update with optional note
- Print invoice button (generates PDF-ready print view)
- Payment status (manual mark paid for COD confirmation)
- Refund initiation button (Super Admin only)
- Customer info with link to customer profile

---

### 3. Products (`/admin/products`)
**Purpose:** Full catalogue management

**List view features:**
- Filter by: category, stock status (in stock / low / out), active/inactive
- Search by: name, SKU, slug
- Sort by: name, price, stock, newest
- Quick stock update (inline edit)
- Quick price update (inline edit)
- Bulk activate/deactivate
- Low stock highlighted in red (< 10 units)
- Show cost_price and margin % (Super Admin only)

**Create product (`/admin/products/new`):**
```
Fields:
- Product name (English)       [required]
- Product name (Bengali)       [optional]
- Slug                         [auto-generated from name, editable]
- Category                     [dropdown, required]
- Description (English)        [rich text editor — simple]
- Description (Bengali)        [optional]
- SKU                          [required, unique]
- Unit                         [piece / roll / kg / meter / pack]
- Minimum order quantity        [number, default 1]
- Cost price (BDT)             [required, Super Admin only]
- Selling price (BDT)          [required]
- Sale price (BDT)             [optional — enables discount badge]
- Stock quantity               [required]
- Product images               [multi-upload to R2, drag to reorder, first = main]
- Status                       [active / inactive toggle]
```

**Edit product (`/admin/products/[id]/edit`):**
- Same form as create
- Shows created date, last updated date
- Soft delete button (Super Admin only) — asks confirmation
- Restore button (if deleted)

---

### 4. Categories (`/admin/categories`)
**Purpose:** Manage product hierarchy

**Features:**
- Two-level tree (parent → children)
- Create top-level category
- Create sub-category under any parent
- Edit name (English + Bengali), slug, image, sort order
- Activate/deactivate category (hides all products in it from shop)
- Drag to reorder (sort_order update)
- Show product count per category

---

### 5. Customers (`/admin/customers`)
**Purpose:** Customer account management

**List view:**
- Search by: phone, name
- Filter by: active, banned, date registered
- Show: phone, name, order count, total spent, last order date

**Customer detail (`/admin/customers/[id]`):**
- Profile info (phone, name, registration date)
- Order history (all orders with status)
- Total spent
- Saved addresses
- Account status (active / banned)
- Ban/unban button with reason (Super Admin only)

---

### 6. Analytics (`/admin/analytics`)
**Purpose:** Data-driven business decisions

#### Revenue Analytics
- Total revenue (daily/weekly/monthly/custom range)
- Line chart: revenue over time
- Bar chart: revenue by payment method
- Average order value trend

#### Order Analytics
- Order count by status (funnel: placed → confirmed → shipped → delivered)
- Cancellation rate + reason breakdown
- COD delivery success rate (delivered vs returned)
- Peak order hours heatmap

#### Product Analytics
- Top 10 products by revenue
- Top 10 products by order count
- Low-performing products (ordered < 5 times in 30 days)
- Out-of-stock frequency (how often products go OOS)

#### Customer Analytics
- New vs returning customers
- Geographic breakdown (orders by district, top 10)
- Repeat purchase rate

#### Traffic Analytics (PostHog data)
- Page views (homepage, category, product, checkout)
- Cart abandonment rate
- Checkout funnel drop-off
- Device breakdown (mobile vs desktop)
- Most visited product pages

**Data from:**
- Custom admin analytics API (aggregated from DB)
- PostHog API (traffic + behavior)

---

### 7. Banners & Content (`/admin/content`)
**Purpose:** Control what customers see on the homepage

**Homepage sections controlled:**
- Hero banner (main large banner — image + title + subtitle + CTA button link)
- Secondary banners (2 side banners next to hero)
- Announcement bar (top strip — text + optional link)
- Featured categories (which categories show in homepage grid)
- Featured products (handpick products for homepage section)
- Flash deal (special timed offer — product + price + countdown timer)

**Banner fields:**
```
Image        Upload to R2 (recommended: 1200×400px for hero)
Title        Text overlay (optional)
Subtitle     Text overlay (optional)
CTA text     Button text (e.g., "Shop Now")
CTA link     Internal URL or external URL
Active       Toggle on/off
Sort order   Controls position
Starts at    Schedule activation (optional)
Ends at      Schedule deactivation (optional)
```

---

### 8. Coupons (`/admin/coupons`) — Super Admin Only
**Purpose:** Discount and promotion management

**Coupon fields:**
```
Code         Uppercase, unique (e.g., WELCOME10)
Type         Percentage discount | Fixed amount discount
Value        10 (= 10% or ৳10 depending on type)
Min order    Minimum cart value to apply (e.g., ৳500)
Max discount Maximum discount cap (for percentage type)
Usage limit  Max total uses (e.g., 100)
Per user     Max uses per customer (e.g., 1)
Active       Toggle
Starts at    Optional start date
Expires at   Optional expiry date
```

---

### 9. Inventory (`/admin/inventory`)
**Purpose:** Track and manage stock

**Features:**
- Current stock levels for all products
- Low stock alerts (< 10 units — configurable in settings)
- Inventory adjustment form (add/subtract stock with reason)
- Inventory log (every stock change with timestamp, user, reason)
- Export stock report (CSV)

---

### 10. Settings (`/admin/settings`) — Super Admin Only
**Purpose:** Control all configurable business settings

**Sections:**

**General:**
- Store name
- Store phone (shown in header)
- Store WhatsApp number
- Store address (shown in footer)
- Store email

**Delivery:**
- Standard delivery charge (default: ৳60)
- Free delivery threshold (above X BDT = free)
- COD fee (default: ৳40)
- Delivery areas (districts where delivery is available)
- Estimated delivery days (default: 3-5)

**Payments:**
- Enable/disable each payment method (COD, bKash, Nagad, Card)
- aamarPay mode (sandbox / live)

**Notifications:**
- Low stock alert threshold (default: 10 units)
- Email for order notifications
- SMS notifications toggle (if integrated)

**Maintenance:**
- Maintenance mode toggle (shows coming-soon page to customers)
- Maintenance message

---

### 11. Admin Users (`/admin/users`) — Super Admin Only
**Purpose:** Manage who has admin access

**Features:**
- List all admin users
- Create new admin (phone + name + role)
- Change admin role (super_admin → staff or reverse)
- Deactivate admin account (does not delete)
- View last login date

---

### 12. Audit Log (`/admin/audit-log`) — Super Admin Only
**Purpose:** Track every admin action for accountability

**Shows:**
- Timestamp
- Admin user (who did it)
- Action (e.g., "Updated product price", "Changed order status")
- Details (e.g., "Price: ৳500 → ৳450")
- IP address

---

## 📡 Admin API Routes (Full List)

All admin routes require `Authorization: Bearer <admin-jwt>` header.
Role checked server-side via middleware on every request.

### Dashboard
```
GET    /api/admin/dashboard/stats          ← Today/week/month summary + pending counts
```

### Orders
```
GET    /api/admin/orders                   ← List with filters + pagination
GET    /api/admin/orders/[id]             ← Full order detail
PATCH  /api/admin/orders/[id]/status      ← Update status + add note
PATCH  /api/admin/orders/[id]/payment     ← Mark COD as paid/collected (Super Admin)
POST   /api/admin/orders/[id]/refund      ← Initiate refund (Super Admin)
GET    /api/admin/orders/export           ← Export CSV (Super Admin)
```

### Products
```
GET    /api/admin/products                 ← List (includes cost_price)
POST   /api/admin/products                 ← Create product
GET    /api/admin/products/[id]           ← Get single product
PATCH  /api/admin/products/[id]           ← Update (partial)
DELETE /api/admin/products/[id]           ← Soft delete (Super Admin)
PATCH  /api/admin/products/[id]/restore   ← Restore deleted product (Super Admin)
PATCH  /api/admin/products/[id]/stock     ← Quick stock adjustment
POST   /api/admin/upload                  ← Upload image to R2
```

### Categories
```
GET    /api/admin/categories              ← Full category tree
POST   /api/admin/categories              ← Create category
PATCH  /api/admin/categories/[id]        ← Update category
DELETE /api/admin/categories/[id]        ← Deactivate (not delete if has products)
PATCH  /api/admin/categories/reorder     ← Update sort_order in bulk
```

### Customers
```
GET    /api/admin/customers               ← List customers
GET    /api/admin/customers/[id]         ← Customer detail + order history
PATCH  /api/admin/customers/[id]/ban     ← Ban with reason (Super Admin)
PATCH  /api/admin/customers/[id]/unban   ← Unban (Super Admin)
```

### Analytics
```
GET    /api/admin/analytics/revenue       ← Revenue by period
GET    /api/admin/analytics/orders        ← Order counts + funnel
GET    /api/admin/analytics/products      ← Top/low performing products
GET    /api/admin/analytics/customers     ← New/returning, geographic breakdown
GET    /api/admin/analytics/inventory     ← Stock status summary
```

### Content (Banners)
```
GET    /api/admin/banners                 ← All banners
POST   /api/admin/banners                 ← Create banner
PATCH  /api/admin/banners/[id]           ← Update banner
DELETE /api/admin/banners/[id]           ← Delete banner
PATCH  /api/admin/banners/reorder        ← Update sort_order
```

### Coupons (Super Admin only)
```
GET    /api/admin/coupons                 ← List coupons with usage stats
POST   /api/admin/coupons                 ← Create coupon
PATCH  /api/admin/coupons/[id]           ← Update coupon
DELETE /api/admin/coupons/[id]           ← Deactivate coupon
```

### Inventory
```
GET    /api/admin/inventory               ← Stock levels + low-stock list
POST   /api/admin/inventory/adjust        ← Manual stock adjustment
GET    /api/admin/inventory/log           ← Full adjustment history
GET    /api/admin/inventory/export        ← Export CSV (Super Admin)
```

### Settings (Super Admin only)
```
GET    /api/admin/settings                ← All settings as key-value object
PATCH  /api/admin/settings                ← Update settings (partial)
```

### Admin Users (Super Admin only)
```
GET    /api/admin/users                   ← List admin users
POST   /api/admin/users                   ← Create admin user
PATCH  /api/admin/users/[id]             ← Update role / deactivate
```

### Audit Log (Super Admin only)
```
GET    /api/admin/audit-log               ← Paginated audit entries with filters
```

---

## 🎨 Admin UI Components (Gemini builds these)

```
src/components/admin/
├── stats-card.tsx           ← Metric card (number + label + trend arrow)
├── orders-table.tsx         ← Sortable/filterable order table
├── order-status-badge.tsx   ← Color-coded status pill
├── order-timeline.tsx       ← Status history vertical timeline
├── product-form.tsx         ← Create/edit product form (multi-step)
├── image-uploader.tsx       ← Multi-image upload with drag-reorder
├── category-tree.tsx        ← Collapsible category hierarchy
├── customer-table.tsx       ← Customer list with search
├── revenue-chart.tsx        ← Line chart (recharts)
├── orders-funnel-chart.tsx  ← Funnel visualization
├── top-products-table.tsx   ← Ranked product table
├── coupon-form.tsx          ← Create/edit coupon
├── banner-manager.tsx       ← Banner CRUD with preview
├── settings-form.tsx        ← Key-value settings form
├── admin-user-table.tsx     ← Admin user management
├── audit-log-table.tsx      ← Audit entries with filter
├── inventory-table.tsx      ← Stock levels with low-stock highlight
└── stock-adjust-modal.tsx   ← Adjust stock popup
```

**Admin Layout components:**
```
src/components/layout/
├── admin-sidebar.tsx        ← Left nav with all sections
├── admin-header.tsx         ← Top bar with admin name + logout
└── admin-breadcrumb.tsx     ← Breadcrumb for nested pages
```

---

## 🗄️ Additional DB Tables Needed for Admin

Add these to `DB_SCHEMA.md` and `src/db/schema.ts`:

### `banners`
```sql
id           SERIAL PRIMARY KEY
title        VARCHAR(200)
subtitle     VARCHAR(300)
image        TEXT NOT NULL        -- R2 URL
cta_text     VARCHAR(50)
cta_url      VARCHAR(500)
position     VARCHAR(30)          -- hero | secondary | announcement
sort_order   INTEGER DEFAULT 0
is_active    BOOLEAN DEFAULT true
starts_at    TIMESTAMP
ends_at      TIMESTAMP
created_by   UUID REFERENCES users(id)
created_at   TIMESTAMP DEFAULT NOW()
updated_at   TIMESTAMP DEFAULT NOW()
```

### `coupons`
```sql
id              SERIAL PRIMARY KEY
code            VARCHAR(30) UNIQUE NOT NULL   -- e.g., WELCOME10
type            VARCHAR(20) NOT NULL           -- percentage | fixed
value           DECIMAL(10,2) NOT NULL
min_order       DECIMAL(10,2) DEFAULT 0
max_discount    DECIMAL(10,2)                  -- cap for percentage
usage_limit     INTEGER                        -- total max uses
per_user_limit  INTEGER DEFAULT 1
used_count      INTEGER DEFAULT 0
is_active       BOOLEAN DEFAULT true
starts_at       TIMESTAMP
expires_at      TIMESTAMP
created_by      UUID REFERENCES users(id)
created_at      TIMESTAMP DEFAULT NOW()
```

### `coupon_uses`
```sql
id           SERIAL PRIMARY KEY
coupon_id    INTEGER REFERENCES coupons(id)
order_id     INTEGER REFERENCES orders(id)
user_id      UUID REFERENCES users(id)
discount     DECIMAL(10,2) NOT NULL
used_at      TIMESTAMP DEFAULT NOW()
```

### `settings`
```sql
id           SERIAL PRIMARY KEY
key          VARCHAR(100) UNIQUE NOT NULL     -- e.g., delivery_charge
value        TEXT NOT NULL                    -- always stored as string
type         VARCHAR(20) DEFAULT 'string'     -- string | number | boolean | json
updated_by   UUID REFERENCES users(id)
updated_at   TIMESTAMP DEFAULT NOW()
```

### `inventory_log`
```sql
id           SERIAL PRIMARY KEY
product_id   INTEGER REFERENCES products(id)
type         VARCHAR(20) NOT NULL    -- adjustment | order | refund | correction
quantity     INTEGER NOT NULL        -- positive = added, negative = removed
before       INTEGER NOT NULL        -- stock before change
after        INTEGER NOT NULL        -- stock after change
reason       TEXT
order_id     INTEGER REFERENCES orders(id)  -- if triggered by order
changed_by   UUID REFERENCES users(id)
created_at   TIMESTAMP DEFAULT NOW()
```

### `audit_log`
```sql
id           SERIAL PRIMARY KEY
admin_id     UUID REFERENCES users(id)
action       VARCHAR(100) NOT NULL   -- e.g., product.update, order.status_change
entity_type  VARCHAR(50)             -- product | order | user | setting
entity_id    VARCHAR(50)             -- ID of the affected record
changes      JSONB                   -- { before: {...}, after: {...} }
ip_address   VARCHAR(45)
user_agent   TEXT
created_at   TIMESTAMP DEFAULT NOW()
```

---

*Admin panel is the control centre. Build backend first, then UI. Both agents read this.*
