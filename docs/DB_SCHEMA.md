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
created_at   TIMESTAMP DEFAULT NOW()
updated_at   TIMESTAMP DEFAULT NOW()
```

**Indexes:** `slug` (unique), `parent_id`

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
deleted_at      TIMESTAMP                       -- Soft delete
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

**Indexes:** `slug` (unique), `category_id`, `is_active`, `deleted_at`
**Full-text:** `search_vector TSVECTOR` generated from `name || name_bn`

---

### `users`
```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
supabase_id   UUID UNIQUE                        -- Supabase Auth user ID
phone         VARCHAR(15) UNIQUE NOT NULL
name          VARCHAR(100)
email         VARCHAR(150)
role          VARCHAR(20) DEFAULT 'customer'     -- customer | admin
created_at    TIMESTAMP DEFAULT NOW()
updated_at    TIMESTAMP DEFAULT NOW()
```

**Indexes:** `phone` (unique), `supabase_id` (unique)

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
order_number    VARCHAR(20) UNIQUE NOT NULL       -- e.g., VR-2026-00001
user_id         UUID REFERENCES users(id) ON DELETE SET NULL
status          VARCHAR(20) DEFAULT 'pending'
-- Enum: pending | confirmed | processing | shipped | delivered | cancelled

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
- 2 top-level categories: "Sanitary Items", "Packaging Materials"
- 8 sub-categories under each
- 20 sample products (mix of both categories)
- 1 admin user (phone: +8801700000000)

Seed file: `src/db/seed.ts` (Claude agent creates this)

---

*Claude agent implements this in src/db/schema.ts*
*Run npm run db:generate + npm run db:migrate after any schema change*
