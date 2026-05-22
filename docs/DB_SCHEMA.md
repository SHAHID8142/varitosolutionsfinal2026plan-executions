# DB_SCHEMA.md — Varito Solutions
## Database Schema Reference | Claude Agent Implements in Drizzle

> Source of truth for database design.
> Actual code lives in `src/db/schema.ts`
> Run `npm run db:studio` to view data visually.

---

## Database: Neon PostgreSQL

**Connection:** Stored in `DATABASE_URL` environment variable  
**ORM:** Drizzle ORM  
**Migrations:** `drizzle/` directory  

---

## Tables

### `categories`
```sql
id           SERIAL PRIMARY KEY
name         VARCHAR(100) NOT NULL
name_bn      VARCHAR(100)
slug         VARCHAR(120) UNIQUE NOT NULL
parent_id    INTEGER REFERENCES categories(id) ON DELETE SET NULL
image        TEXT
sort_order   INTEGER DEFAULT 0
is_active    BOOLEAN DEFAULT true
is_featured  BOOLEAN DEFAULT false  -- show in homepage categories grid
created_at   TIMESTAMP DEFAULT NOW()
updated_at   TIMESTAMP DEFAULT NOW()
```

**Indexes:** `slug` (unique), `parent_id`, `is_featured`

---

### `products`
```sql
id              SERIAL PRIMARY KEY
name            VARCHAR(200) NOT NULL
name_bn         VARCHAR(200)
slug            VARCHAR(220) UNIQUE NOT NULL
description     TEXT
description_bn  TEXT
category_id     INTEGER REFERENCES categories(id) ON DELETE SET NULL
price           DECIMAL(10,2) NOT NULL          -- Selling price (BDT)
sale_price      DECIMAL(10,2)                   -- NULL = no sale
cost_price      DECIMAL(10,2) NOT NULL          -- NEVER expose to customers
stock           INTEGER DEFAULT 0 CHECK (stock >= 0)
unit            VARCHAR(20) DEFAULT 'piece'     -- piece, roll, kg, meter, pack
min_order_qty   INTEGER DEFAULT 1
sku             VARCHAR(50) UNIQUE NOT NULL
images          TEXT[]                          -- Array of R2 URLs
is_active       BOOLEAN DEFAULT true
is_featured     BOOLEAN DEFAULT false           -- shows in homepage featured section
total_orders    INTEGER DEFAULT 0              -- denormalized: incremented on each order, used for sort=popular
deleted_at      TIMESTAMP                       -- Soft delete
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

**Indexes:** `slug` (unique), `category_id`, `is_active`, `deleted_at`, `is_featured`, `total_orders`
**Full-text:** `search_vector TSVECTOR` generated from `name || name_bn`

> `total_orders` is a denormalized counter updated atomically when an order is placed or cancelled.
> Used exclusively for `sort=popular`. Never recalculate from `order_items` at query time — it's too slow.

---

### `users`
```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
supabase_id   UUID UNIQUE                        -- Supabase Auth user ID
phone         VARCHAR(15) UNIQUE NOT NULL
name          VARCHAR(100)
email         VARCHAR(150)
role          VARCHAR(20) DEFAULT 'customer'
-- Enum: customer | staff | super_admin
-- staff:       can manage orders, products, banners, view analytics
-- super_admin: full access including settings, coupons, refunds, user management
-- Middleware reads role from DB — NEVER from JWT claims

is_banned     BOOLEAN DEFAULT false
banned_at     TIMESTAMP
ban_reason    TEXT
banned_by     UUID REFERENCES users(id)          -- admin who banned
created_at    TIMESTAMP DEFAULT NOW()
updated_at    TIMESTAMP DEFAULT NOW()
```

**Indexes:** `phone` (unique), `supabase_id` (unique), `role`, `is_banned`

> **Role enforcement:** Middleware checks `role IN ('staff', 'super_admin')` for admin routes.
> Super-admin-only routes additionally check `role = 'super_admin'`.
> See `docs/SECURITY.md` Route Protection Matrix for the full list.

---

### `addresses`
```sql
id           SERIAL PRIMARY KEY
user_id      UUID REFERENCES users(id) ON DELETE CASCADE
label        VARCHAR(20) DEFAULT 'home'         -- home | office | other
name         VARCHAR(100) NOT NULL
phone        VARCHAR(15) NOT NULL
district     VARCHAR(50) NOT NULL
thana        VARCHAR(50) NOT NULL
area         VARCHAR(100)
road         VARCHAR(150)
house        VARCHAR(100)
landmark     VARCHAR(200)
is_default   BOOLEAN DEFAULT false
created_at   TIMESTAMP DEFAULT NOW()
```

**Indexes:** `user_id`

---

### `orders`
```sql
id              SERIAL PRIMARY KEY
order_number    VARCHAR(20) UNIQUE NOT NULL
-- Format: VR-{YYYY}-{id zero-padded to 5 digits}   e.g., VR-2026-00001
-- Generation: Use the SERIAL id after INSERT. Application formats it as:
--   `VR-${new Date().getFullYear()}-${id.toString().padStart(5, '0')}`
-- Insert with a placeholder, then UPDATE with the formatted string immediately after.
-- This avoids a sequence object while keeping the format deterministic.
user_id         UUID REFERENCES users(id) ON DELETE SET NULL
status          VARCHAR(20) DEFAULT 'pending'
-- Enum: pending | confirmed | processing | shipped | delivered | cancelled | returned

payment_method  VARCHAR(20) NOT NULL
-- Enum: cod | bkash | nagad | card

payment_status  VARCHAR(20) DEFAULT 'pending'
-- Enum: pending | pending_cod | paid | failed | refunded

subtotal        DECIMAL(10,2) NOT NULL            -- Sum of items before fees
delivery_charge DECIMAL(10,2) DEFAULT 60.00       -- Delivery fee
cod_fee         DECIMAL(10,2) DEFAULT 0           -- 40 if COD, 0 otherwise
discount        DECIMAL(10,2) DEFAULT 0
total           DECIMAL(10,2) NOT NULL            -- Final amount charged

-- Address snapshot (stored at time of order, not FK)
customer_name   VARCHAR(100) NOT NULL
customer_phone  VARCHAR(15) NOT NULL
address_district VARCHAR(50) NOT NULL
address_thana   VARCHAR(50) NOT NULL
address_area    VARCHAR(100)
address_road    VARCHAR(150)
address_house   VARCHAR(100)
address_landmark VARCHAR(200)

-- Courier Integration
courier_name        VARCHAR(50)
consignment_id      VARCHAR(100)
courier_status      VARCHAR(50)

-- Payment gateway
aamarpay_txn_id     VARCHAR(100)
aamarpay_payment_id VARCHAR(100)

notes           TEXT
admin_notes     TEXT
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

**Indexes:** `order_number` (unique), `user_id`, `status`, `payment_status`, `created_at`

---

### `order_items`
```sql
id           SERIAL PRIMARY KEY
order_id     INTEGER REFERENCES orders(id) ON DELETE CASCADE
product_id   INTEGER REFERENCES products(id) ON DELETE SET NULL
-- Snapshot at time of order:
product_name VARCHAR(200) NOT NULL
product_sku  VARCHAR(50) NOT NULL
product_image TEXT
qty          INTEGER NOT NULL CHECK (qty > 0)
unit_price   DECIMAL(10,2) NOT NULL
total        DECIMAL(10,2) NOT NULL               -- qty * unit_price
```

**Indexes:** `order_id`, `product_id`

---

### `order_history`
Track status changes over time.
```sql
id           SERIAL PRIMARY KEY
order_id     INTEGER REFERENCES orders(id) ON DELETE CASCADE
from_status  VARCHAR(20)
to_status    VARCHAR(20) NOT NULL
changed_by   UUID REFERENCES users(id)            -- Admin who changed it
note         TEXT
created_at   TIMESTAMP DEFAULT NOW()
```

---

### `flash_deals`
Time-bounded price promotions shown on the homepage. Only one deal can be active at a time.
```sql
id           SERIAL PRIMARY KEY
product_id   INTEGER REFERENCES products(id) ON DELETE CASCADE
flash_price  DECIMAL(10,2) NOT NULL             -- Must be < products.price (enforced in API)
starts_at    TIMESTAMP NOT NULL
ends_at      TIMESTAMP NOT NULL
max_qty      INTEGER                            -- NULL = unlimited
sold_qty     INTEGER DEFAULT 0                 -- incremented atomically on each order
is_active    BOOLEAN DEFAULT true              -- admin can kill it early
created_by   UUID REFERENCES users(id)
created_at   TIMESTAMP DEFAULT NOW()
```

**Indexes:** `product_id`, `starts_at`, `ends_at`, `is_active`
**Constraint:** `flash_price < product.price` validated at API level, not DB level.
**Active deal query:** `WHERE is_active = true AND starts_at <= NOW() AND ends_at > NOW() LIMIT 1`

---

### `banners`
Homepage visual banners managed by admins. Supports hero, secondary slots, and announcement bar.
```sql
id           SERIAL PRIMARY KEY
title        VARCHAR(200)
subtitle     VARCHAR(300)
image        TEXT NOT NULL                      -- R2 URL
cta_text     VARCHAR(50)
cta_url      VARCHAR(500)
position     VARCHAR(30) NOT NULL
-- Enum: hero | secondary | announcement
-- hero:         large main banner (1200×400px recommended)
-- secondary:    2 smaller side banners next to hero
-- announcement: top strip text (no image needed — image column ignored)
sort_order   INTEGER DEFAULT 0
is_active    BOOLEAN DEFAULT true
starts_at    TIMESTAMP                          -- NULL = always active
ends_at      TIMESTAMP                          -- NULL = never expires
created_by   UUID REFERENCES users(id)
created_at   TIMESTAMP DEFAULT NOW()
updated_at   TIMESTAMP DEFAULT NOW()
```

**Indexes:** `position`, `is_active`, `sort_order`

---

### `coupons`
Discount codes. Super Admin only.
```sql
id              SERIAL PRIMARY KEY
code            VARCHAR(30) UNIQUE NOT NULL     -- Uppercase, e.g., WELCOME10
type            VARCHAR(20) NOT NULL
-- Enum: percentage | fixed
value           DECIMAL(10,2) NOT NULL          -- 10 = 10% or ৳10 depending on type
min_order       DECIMAL(10,2) DEFAULT 0         -- Minimum cart value to apply
max_discount    DECIMAL(10,2)                   -- Cap for percentage type (NULL = no cap)
usage_limit     INTEGER                         -- Total max uses (NULL = unlimited)
per_user_limit  INTEGER DEFAULT 1               -- Max uses per user (NULL = unlimited)
used_count      INTEGER DEFAULT 0               -- Incremented atomically
is_active       BOOLEAN DEFAULT true
starts_at       TIMESTAMP
expires_at      TIMESTAMP
created_by      UUID REFERENCES users(id)
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

**Indexes:** `code` (unique), `is_active`, `expires_at`

---

### `coupon_uses`
Audit trail for every coupon redemption.
```sql
id           SERIAL PRIMARY KEY
coupon_id    INTEGER REFERENCES coupons(id)
order_id     INTEGER REFERENCES orders(id)
user_id      UUID REFERENCES users(id)          -- NULL for guest orders
discount     DECIMAL(10,2) NOT NULL
used_at      TIMESTAMP DEFAULT NOW()
```

**Indexes:** `coupon_id`, `order_id`, `user_id`

---

### `settings`
Key-value store for all configurable business settings. Super Admin manages via `/admin/settings`.
```sql
id           SERIAL PRIMARY KEY
key          VARCHAR(100) UNIQUE NOT NULL
-- Known keys: delivery_charge, free_delivery_threshold, cod_fee, low_stock_threshold,
--             delivery_days_min, delivery_days_max, store_name, store_phone,
--             store_whatsapp, store_address, store_email,
--             payment_cod_enabled, payment_bkash_enabled, payment_nagad_enabled,
--             payment_card_enabled, aamarpay_mode, maintenance_mode,
--             maintenance_message, notification_email
value        TEXT NOT NULL                      -- Always stored as string
type         VARCHAR(20) DEFAULT 'string'
-- Enum: string | number | boolean | json
-- Parse on read: number → parseFloat, boolean → value === 'true', json → JSON.parse
updated_by   UUID REFERENCES users(id)
updated_at   TIMESTAMP DEFAULT NOW()
```

**Indexes:** `key` (unique)

> **Default values** are seeded by `src/db/seed.ts` on first deploy.
> Claude: read the existing value before writing — PATCH only changed keys.

---

### `inventory_log`
Immutable audit trail of every stock change. Never delete rows.
```sql
id           SERIAL PRIMARY KEY
product_id   INTEGER REFERENCES products(id)
type         VARCHAR(20) NOT NULL
-- Enum: order | order_cancel | manual_add | manual_subtract | correction | refund
quantity     INTEGER NOT NULL                   -- positive = added, negative = removed
before       INTEGER NOT NULL                   -- stock level before change
after        INTEGER NOT NULL                   -- stock level after change
reason       TEXT                               -- Required for manual types
order_id     INTEGER REFERENCES orders(id)      -- Set when type = order | order_cancel | refund
changed_by   UUID REFERENCES users(id)          -- NULL if system-triggered
created_at   TIMESTAMP DEFAULT NOW()
```

**Indexes:** `product_id`, `order_id`, `type`, `created_at`

---

### `audit_log`
Immutable record of every admin action. Never delete rows. Super Admin views only.
```sql
id           SERIAL PRIMARY KEY
admin_id     UUID REFERENCES users(id)
action       VARCHAR(100) NOT NULL
-- Convention: '{entity}.{verb}'  e.g., product.create, order.status_change,
--             user.ban, coupon.deactivate, setting.update, admin.login_success,
--             admin.login_fail, product.delete, product.restore
entity_type  VARCHAR(50)
-- Enum: product | order | user | coupon | banner | setting | admin | inventory
entity_id    VARCHAR(50)                        -- ID of affected record as string
changes      JSONB
-- Structure: { "before": { field: value }, "after": { field: value } }
-- For creates: { "after": { ...all fields } }
-- For deletes: { "before": { ...all fields } }
ip_address   VARCHAR(45)                        -- Supports IPv6
user_agent   TEXT
created_at   TIMESTAMP DEFAULT NOW()
```

**Indexes:** `admin_id`, `action`, `entity_type`, `entity_id`, `created_at`

---

### `courier_shipments`
Tracks every courier booking made through the admin panel.
```sql
id              SERIAL PRIMARY KEY
order_id        INTEGER REFERENCES orders(id)
courier         VARCHAR(20) NOT NULL            -- Enum: steadfast | pathao | redx
consignment_id  VARCHAR(100) UNIQUE             -- Courier's reference ID
tracking_code   VARCHAR(100)                    -- For customer tracking
status          VARCHAR(50)                     -- Mirrors courier API status
courier_charge  DECIMAL(10,2)                   -- Actual courier charge (for reconciliation)
booked_by       UUID REFERENCES users(id)
booked_at       TIMESTAMP DEFAULT NOW()
last_synced_at  TIMESTAMP                       -- Last time we polled courier for status
raw_response    JSONB                           -- Full courier API response (for debugging)
```

**Indexes:** `order_id`, `courier`, `consignment_id`, `status`

> **One shipment per order** is enforced at the API level — check before booking.
> Use `raw_response` for debugging courier issues without calling their API again.

---

### `product_reviews` (Phase 2 feature)
```sql
id           SERIAL PRIMARY KEY
product_id   INTEGER REFERENCES products(id) ON DELETE CASCADE
user_id      UUID REFERENCES users(id) ON DELETE SET NULL
order_id     INTEGER REFERENCES orders(id)         -- Only reviewed buyers
rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5)
title        VARCHAR(150)
body         TEXT
is_approved  BOOLEAN DEFAULT false
created_at   TIMESTAMP DEFAULT NOW()
```

---

## Drizzle Schema Structure (`src/db/schema.ts`)

```typescript
// Example structure — Claude agent writes the full file
import { pgTable, serial, varchar, text, decimal, boolean, 
         timestamp, integer, uuid } from 'drizzle-orm/pg-core'

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  nameBn: varchar('name_bn', { length: 100 }),
  slug: varchar('slug', { length: 120 }).notNull().unique(),
  // ...
})

export const products = pgTable('products', {
  // ...
})

// Add type exports
export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
// ...
```

---

## Migration Commands

```bash
# After changing schema.ts, generate a migration file
npm run db:generate

# Apply pending migrations to Neon DB
npm run db:migrate

# Open visual DB browser
npm run db:studio

# Add to package.json:
"db:generate": "drizzle-kit generate",
"db:migrate": "drizzle-kit migrate",
"db:studio": "drizzle-kit studio"
```

---

## Seed Data (Development)

When running locally, seed with:
- 2 top-level categories: "Sanitary Items", "Packaging Materials" (both `is_featured = true`)
- 8 sub-categories under each
- 20 sample products (mix of both categories, 3 with `is_featured = true`)
- 1 super_admin user (phone: +8801700000000, role: 'super_admin')
- 1 staff user (phone: +8801700000001, role: 'staff')
- Default settings rows (all keys listed in the `settings` table schema above)
- 1 sample flash deal (active for the next 24 hours, 15% off a featured product)

Seed file: `src/db/seed.ts` (Claude agent creates this)

---

*Claude agent implements this in src/db/schema.ts*
*Run npm run db:generate + npm run db:migrate after any schema change*
*All table definitions live here — do not define schema in ADMIN_SPEC.md or elsewhere*
