# 🗺️ ROADMAP — Varito Solutions E-Commerce
### Sanitary Items + Packaging Materials | Chattogram, Bangladesh | 2026
### Business Model: Hybrid (Reseller + Dropshipping + Own Brand)

---

## 📌 Business Context

| Item | Detail |
|------|--------|
| **Business Name** | Varito Solutions |
| **Location** | Chattogram, Bangladesh |
| **Product Line 1** | Sanitary Items — luxury to budget fittings (bathroom, kitchen, plumbing) |
| **Product Line 2** | Packaging Materials — cartons, tape, bubble wrap, poly bags, stretch film, foam, labels |
| **Target Market** | B2C + B2B (businesses that ship products need packaging materials) |
| **Model** | Hybrid: Reseller + Dropshipping + Own Brand |
| **Budget** | Domain cost only (~৳1,200/year) |
| **Status at Roadmap Start** | Accounts ✅, Social ✅, Docs ✅ |

---

## ⚡ Mobile App Strategy — Answered Upfront

> **Question: If we build the website now, will there be a conflict when converting to mobile app later?**

**Answer: Zero conflict. Here is the exact evolution path:**

```
Stage 1 (NOW)          Stage 2 (~500 orders/mo)     Stage 3 (~৳5L/mo revenue)
─────────────────      ───────────────────────      ──────────────────────────
Next.js Website   →    PWA + TWA (Play Store)  →    React Native App
     +                        $25 fee                  Same API backend
   PWA Layer              Same codebase!               No rewrite needed
```

**Why zero conflict:**
- Your Next.js API routes serve the website now
- The same API routes serve a React Native app later — no changes needed
- PWA wraps your existing site — no new code
- TWA (Trusted Web Activity via Bubblewrap) publishes your PWA to Play Store — same code
- React Native is a **separate frontend** using the **same backend** — plug and play
- **Never use Capacitor** to wrap your site (breaks Next.js SSR). Use TWA/Bubblewrap only.

---

## Phase 1 — Foundation
### Week 1–2 | Cost: ~৳1,200 (domain only)

**Status: Accounts & docs already done — Just need domain**

### 1.1 Register Domain
- Provider: **Namecheap.com** or **Porkbun.com** (cheapest, international card accepted)
- Type: `.com` — ~$10–12/year (~৳1,100–1,300)
- Name should: be short, easy to say in Bangla AND English, reflect "Varito" brand
- Avoid: hyphens, numbers, confusing spelling

### 1.2 Configure Your Free Accounts

| Account | Configuration Needed |
|---------|---------------------|
| **GitHub** | Create org or personal repo, set default branch to `main` |
| **Cloudflare** | Add domain DNS → point to Pages deployment |
| **Neon** | Create project `varito-production`, save connection string |
| **Cloudflare R2** | Create bucket `varito-products`, note endpoint URL |
| **Brevo** | Set up domain email (info@yourdomain.com), verify DNS |
| **aamarPay** | Complete KYC, get sandbox + production API keys |
| **PostHog** | Create project, get API key for Next.js |
| **Supabase** | Create project, get anon key + service role key |

### 1.3 Point Domain to Cloudflare
1. Register domain at Namecheap
2. Log into Cloudflare → Add Site → Enter your domain
3. Cloudflare gives you 2 nameservers
4. Go back to Namecheap → Replace nameservers with Cloudflare's
5. SSL is now automatic and free

---

## Phase 2 — Build the Website
### Week 3–6 | Cost: ৳0

### 2.1 Tech Stack

```
Layer              Tool                    Why
─────────────────────────────────────────────────────────────
Framework          Next.js 15              SSR + API routes + SEO
Styling            Tailwind CSS v4         Utility-first, fast development
Components         shadcn/ui               Free, you own the code, production-ready
Database ORM       Drizzle ORM             Free MIT, TypeScript-first, edge-ready
Database           Neon (PostgreSQL)       0.5GB free, scale-to-zero, no CC needed
Hosting            Cloudflare Pages        Unlimited bandwidth, 500 builds/month
Image Storage      Cloudflare R2           10GB free, ZERO egress cost
Authentication     Supabase Auth           50K MAU free, built-in RLS
Payment            aamarPay                NO setup fee: bKash + Nagad + Cards
Email              Brevo                   9,000 emails/month free
Analytics          PostHog                 1M events/month free, session replay
PWA Layer          Serwist                 Modern PWA for Next.js (replaces next-pwa)
Search             PostgreSQL FTS          Built-in, free, sufficient for <10K products
```

### 2.2 Database Schema (Core Tables)

```sql
products (id, name, name_bn, slug, description, category_id,
          price, sale_price, cost_price, stock, images[], sku,
          unit, min_order_qty, is_active, created_at)

categories (id, name, name_bn, slug, parent_id, image, sort_order)

orders (id, order_number, user_id, status, payment_method,
        payment_status, subtotal, delivery_charge, cod_fee,
        discount, total, address, phone, notes, created_at)

order_items (id, order_id, product_id, qty, unit_price, total)

users (id, name, phone, email, created_at)

addresses (id, user_id, label, name, phone, district, thana,
           area, road, house, landmark)
```

### 2.3 Pages to Build (Priority Order)

| Priority | Page | Notes |
|----------|------|-------|
| 1 | **Homepage** | Hero banner, categories, featured products, flash deals |
| 2 | **Category Page** | Grid layout, filters (price, brand), sort options |
| 3 | **Product Page** | Image gallery, price, stock, add to cart, return badge |
| 4 | **Cart** | Quantity control, COD surcharge visible early |
| 5 | **Checkout** | Guest first, COD default, address hierarchy |
| 6 | **Order Confirmation** | SMS trigger, WhatsApp link |
| 7 | **My Orders** | Order tracking per user |
| 8 | **About / Contact** | Phone number prominent — TRUST SIGNAL |
| 9 | **Returns Policy** | Legal requirement — Digital Commerce Policy 2021 |
| 10 | **Search Results** | PostgreSQL full-text search |
| 11 | **Admin Dashboard** | Order management, product CRUD, stock tracking |

### 2.4 Product Category Structure

**Sanitary Items:**
```
Sanitary Items/
├── Bathroom Fittings
│   ├── Faucets & Taps (luxury, standard, budget)
│   ├── Showers & Shower Heads
│   ├── Bath Accessories
│   └── WC Fittings
├── Kitchen Fittings
│   ├── Kitchen Faucets
│   ├── Sinks
│   └── Kitchen Accessories
├── Pipes & Plumbing
│   ├── PVC Pipes
│   ├── Connectors & Joints
│   └── Valves
└── Sanitaryware
    ├── Toilets & Commodes
    ├── Basins & Sinks
    └── Bidets
```

**Packaging Materials:**
```
Packaging Materials/
├── Boxes & Cartons
│   ├── Standard Carton Boxes (by size)
│   ├── Corrugated Boxes
│   └── Custom-size Boxes
├── Tapes
│   ├── OPP/Bopp Tape (transparent/brown)
│   ├── Masking Tape
│   └── Double-sided Tape
├── Protective Materials
│   ├── Bubble Wrap
│   ├── Foam Sheets
│   └── Corner Protectors
├── Poly & Mailers
│   ├── Poly Bags (by size)
│   ├── Poly Mailers / Courier Bags
│   └── Zip-lock Bags
├── Stretch & Shrink
│   ├── Stretch Film / Pallet Wrap
│   └── Shrink Bags
└── Labels & Accessories
    ├── Fragile Labels
    ├── Address Labels
    └── Stickers
```

> B2B OPPORTUNITY: Packaging materials are needed by ALL Bangladeshi e-commerce sellers
> (50,000+ F-commerce pages). Position Varito as the go-to packaging supplier for
> small online sellers in Chattogram — a massively underserved digital segment.

### 2.5 Must-Have Features at Launch

**Payment:**
- [ ] COD as first/default option (surcharge +৳40, show early)
- [ ] bKash via aamarPay
- [ ] Nagad via aamarPay
- [ ] Credit/Debit Card via aamarPay

**UX:**
- [ ] Guest checkout (no forced account — 26% abandon at forced registration)
- [ ] Mobile bottom nav (Home / Categories / Search / Cart / Profile)
- [ ] Bangla product names + prices visible
- [ ] WhatsApp floating chat button
- [ ] Facebook Messenger chat widget
- [ ] Breadcrumb navigation
- [ ] PWA "Add to Home Screen" prompt

**Trust:**
- [ ] Phone number in header
- [ ] Return policy badge on every product card
- [ ] HTTPS padlock (auto via Cloudflare)
- [ ] SMS confirmation within 60 seconds of order

**Performance:**
- [ ] Cloudflare R2 images (auto-optimized, WebP)
- [ ] Target: Lighthouse score >80 on mobile 3G
- [ ] Test on 4GB RAM Android + 3G

---

## Phase 3 — Soft Launch
### Week 7–8 | Cost: ৳0

### 3.1 Pre-Launch Checklist
- [ ] Test full checkout flow (COD + bKash + Nagad)
- [ ] Test on real Android phone
- [ ] Test with 3G speed (Chrome DevTools → Slow 3G)
- [ ] All product photos on white background
- [ ] Return policy page live
- [ ] Contact page with real phone number
- [ ] SMS confirmation working
- [ ] WhatsApp Business connected

### 3.2 Launch Channels

**Facebook (Day 1):**
- Post 3–5 products on your Facebook Business Page
- Join and post in:
  - Chattogram buy/sell groups
  - F-commerce seller groups (for packaging products)
  - Home renovation groups (for sanitary items)
  - Local Chattogram neighborhood groups

**WhatsApp (Day 1):**
- WhatsApp Business catalogue with top 10 products
- Post on personal WhatsApp Status
- Message contacts about the launch

**TikTok (Day 2):**
- First video: show the packaging products (e-commerce sellers are on TikTok)
- Phone camera is enough — authentic beats professional in BD

**Instagram (Day 3+):**
- Repurpose TikTok videos (remove watermark via CapCut)

### 3.3 B2B Packaging Strategy
- Post in "F-Commerce Seller Bangladesh" Facebook groups
- Offer bulk pricing for regular orders
- CTA: "Order packaging in bulk → WhatsApp us"
- Position as: "We supply packaging to Chattogram's online sellers"

### 3.4 First 10 Orders — Track Everything
- Did COD customers actually accept delivery?
- Did they contact via Messenger or WhatsApp?
- Any address input confusion?
- How did they find you? (ask them directly)
- What did they complain about?

Fix before scaling.

---

## Phase 4 — Growth
### Month 2–4 | Cost: ৳0

### 4.1 Weekly Content Calendar

| Day | Content |
|----|---------|
| Mon | Product showcase (sanitary items) |
| Tue | Before/After renovation photo |
| Wed | Packaging tips video (educates B2B buyers) |
| Thu | Product demo / unboxing |
| Fri | Friday deal / weekly discount |
| Sat | Customer review / testimonial screenshot |
| Sun | Behind-the-scenes (warehouse, sourcing) |

### 4.2 SEO Keywords to Target

| Keyword (Bangla) | Keyword (English) |
|-----------------|------------------|
| প্যাকেজিং সামগ্রী চট্টগ্রাম | packaging materials chattogram |
| বাবল র‍্যাপ কিনুন বাংলাদেশ | bubble wrap buy online bangladesh |
| সানিটারি ফিটিংস দাম | sanitary fittings price bangladesh |
| কার্টন বক্স পাইকারি | carton box wholesale |
| পলি ব্যাগ অনলাইন | poly bag online bangladesh |

### 4.3 Key Metrics (PostHog)

| Metric | Target by Month 3 |
|--------|-------------------|
| Monthly Orders | 100+ |
| COD Acceptance Rate | >85% |
| Repeat Customer Rate | >20% |
| Mobile Traffic % | >85% |
| Average Order Value | Track trend |

### 4.4 Order Milestones & Upgrades

| Milestone | Action |
|-----------|--------|
| 50 orders | Add product reviews/ratings feature |
| 100 orders/month | Source from 2nd wholesaler for better pricing |
| 200 orders/month | Brevo email campaigns for repeat buyers |
| 300 orders/month | Add loyalty points system |
| 500 orders/month | Google Play Store via Bubblewrap ($25) |
| 500 orders/month | Hire part-time order handler |

---

## Phase 5 — Scale
### Month 5+ | Invest Only When Revenue Justifies

### 5.1 Revenue-Triggered Investment Plan

| Monthly Revenue | Investment |
|----------------|------------|
| ৳50,000 | Upgrade Neon DB to paid plan |
| ৳1,00,000 | Micro-influencer campaigns (৳5,000–15,000 each) |
| ৳2,00,000 | Google Play Store via TWA/Bubblewrap ($25) |
| ৳3,00,000 | First paid Facebook ad test (৳5,000) |
| ৳5,00,000 | React Native mobile app (BD freelancer: $2,000–5,000 MVP) |
| ৳10,00,000 | Full-time customer support hire |
| ৳20,00,000 | iOS App Store ($99/year) |

### 5.2 Mobile App Evolution Path

```
Phase 2–3 (NOW):
  Next.js Website + Serwist PWA
  Users can "Add to Home Screen" on Android
  Push notifications work
  Looks like native app
  Cost: ৳0

Phase 4 (~500 orders/month):
  Same Next.js code → Bubblewrap → Android APK → Google Play
  No new code. Just a wrapper.
  $25 one-time Play Store fee.

Phase 5 (~৳5L/month):
  React Native App (separate frontend, same Next.js API backend)
  Language: JavaScript/TypeScript — same as your website
  No backend changes needed
  BD freelancer: $2,000–5,000 for MVP

Phase 5+ (~৳20L+/month):
  iOS App Store
  $99/year Apple Developer fee
  Same React Native codebase compiled for iOS
```

### 5.3 Own Brand Path (Packaging)

When you have revenue + data on best-selling SKUs:
1. **Identify** top 3 products by volume (e.g., brown tape, poly bags, carton boxes)
2. **Source** direct from Chattogram/Dhaka manufacturer (cut out wholesaler)
3. **Brand** with "Varito" label
4. **Price** 15–25% below current resale (you now earn wholesale + brand margin)
5. **Launch** on your site + Daraz as "Varito" brand seller

---

## Summary

```
Week 1–2:   Register domain → Configure all free accounts
Week 3–6:   Build website (Next.js + Cloudflare + Neon + aamarPay + PWA)
Week 7–8:   Soft launch → Facebook groups + WhatsApp → First 10–20 orders
Month 2–4:  Daily content → Fix problems → Build repeat buyers
Month 5+:   Scale what works → Invest from revenue → App comes naturally
```

---

## Total Launch Cost

| Item | Cost |
|------|------|
| Domain (.com, 1 year) | ~$11 (~৳1,200) |
| Hosting (Cloudflare Pages) | FREE |
| Database (Neon) | FREE |
| Image Storage (Cloudflare R2) | FREE |
| Auth (Supabase) | FREE |
| Email (Brevo) | FREE |
| Payment (aamarPay) | FREE setup — % per transaction |
| Analytics (PostHog) | FREE |
| SSL Certificate | FREE via Cloudflare |
| PWA / App layer | FREE |
| Trade License | Already collected |
| e-TIN | Already collected |
| **TOTAL TO LAUNCH** | **~৳1,200** |

---

*Varito Solutions | Chattogram, Bangladesh | 2026*
