# TECH STACK — Varito Solutions
### Complete Free Tech Stack Guide | Zero Budget

---

## Stack Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    VARITO SOLUTIONS STACK                   │
├─────────────────────────────────────────────────────────────┤
│  USER (Browser / PWA / Android TWA)                        │
│           ↓                                                  │
│  Cloudflare CDN + Pages (Hosting + SSL + DNS)              │
│           ↓                                                  │
│  Next.js 15 (Frontend + API Routes)                         │
│     ├── Tailwind CSS v4 + shadcn/ui (UI)                   │
│     ├── Serwist (PWA / Service Worker)                      │
│     └── PostHog (Analytics)                                 │
│           ↓                                                  │
│  Drizzle ORM → Neon PostgreSQL (Database)                   │
│  Supabase Auth (Authentication)                             │
│  Cloudflare R2 (Image Storage)                             │
│  aamarPay (Payments: bKash + Nagad + Cards)                │
│  Brevo (Transactional Email)                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Layer-by-Layer Guide

### 1. Framework — Next.js 15
- **Cost:** Free (MIT License)
- **Why:** SSR (Server-Side Rendering) = Google indexes your product pages immediately
- **Handles:** Frontend + Backend API routes in one project
- **Deploy to:** Cloudflare Pages
- **Docs:** https://nextjs.org/docs

```bash
npx create-next-app@latest varito-store \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

---

### 2. Styling — Tailwind CSS v4 + shadcn/ui
- **Cost:** Free
- **Tailwind:** Utility-first CSS, no custom CSS files needed
- **shadcn/ui:** Copy-paste components, you own the code (not a dependency)
- **Key components needed:** Button, Card, Dialog, Sheet, Input, Select, Badge, Carousel

```bash
npx shadcn@latest init
npx shadcn@latest add button card dialog sheet input select badge carousel
```

---

### 3. Hosting — Cloudflare Pages
- **Cost:** Free (unlimited bandwidth, 500 builds/month)
- **Why over Vercel:** Vercel free tier prohibits commercial use
- **Setup:**
  1. Go to cloudflare.com → Pages → Create a project
  2. Connect your GitHub repo
  3. Build command: `npm run build`
  4. Output directory: `.next`
  5. Add environment variables (Neon DB URL, aamarPay keys, etc.)
- **Auto-deploys:** Every `git push` to `main` triggers a build
- **SSL:** Automatic + free

**Environment variables to add in Cloudflare Pages dashboard:**
```
DATABASE_URL=postgresql://...neon.tech/varito
NEXTAUTH_SECRET=your-secret-here
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
CLOUDFLARE_R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com
CLOUDFLARE_R2_ACCESS_KEY=xxx
CLOUDFLARE_R2_SECRET_KEY=xxx
AAMARPAY_STORE_ID=xxx
AAMARPAY_SIGNATURE_KEY=xxx
BREVO_API_KEY=xkeysib-xxx
POSTHOG_KEY=phc_xxx
```

---

### 4. Database — Neon PostgreSQL
- **Cost:** Free (0.5GB, scale-to-zero, no credit card)
- **Why over PlanetScale:** PlanetScale removed free tier April 2024
- **Why over Supabase DB:** Neon has better free tier for scale-to-zero
- **Setup:**
  1. Go to neon.tech → Create account → New project
  2. Name it `varito-production`
  3. Copy the connection string (DATABASE_URL)
- **Docs:** https://neon.tech/docs

---

### 5. ORM — Drizzle ORM
- **Cost:** Free (MIT)
- **Why:** TypeScript-first, edge-compatible, works perfectly on Cloudflare
- **Config file:** `drizzle.config.ts`

```bash
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
```

```typescript
// drizzle.config.ts
export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
}
```

---

### 6. Authentication — Supabase Auth
- **Cost:** Free (50,000 MAU/month)
- **Why:** Built-in RLS (Row Level Security), OAuth providers, phone OTP
- **Setup:**
  1. Go to supabase.com → New project
  2. Enable Phone Auth (for Bangladeshi SMS OTP)
  3. Copy `SUPABASE_URL` and `SUPABASE_ANON_KEY`

```bash
npm install @supabase/supabase-js @supabase/ssr
```

---

### 7. Image Storage — Cloudflare R2
- **Cost:** Free (10GB storage, ZERO egress/bandwidth fees)
- **Why over Cloudinary:** R2 has no egress fees — critical for image-heavy e-commerce
- **Setup:**
  1. Cloudflare Dashboard → R2 → Create bucket `varito-products`
  2. Enable Public access for product images
  3. Note the endpoint URL and create API keys

```bash
npm install @aws-sdk/client-s3  # R2 is S3-compatible
```

---

### 8. Payments — aamarPay
- **Cost:** FREE setup (no monthly fee, no setup fee, only % per transaction)
- **Why:** Only zero-setup-fee full payment gateway in Bangladesh
- **Supports:** bKash, Nagad, Rocket, Visa, Mastercard, Internet Banking
- **Register:** https://aamarpay.com → Merchant Registration
- **Sandbox:** Available for testing before going live

**Payment flow:**
```
User clicks "Pay with bKash"
→ aamarPay generates payment URL
→ User redirected to bKash payment page
→ bKash confirms payment
→ aamarPay sends callback to your server
→ Your server marks order as paid
→ User sees confirmation page
```

---

### 9. Email — Brevo
- **Cost:** Free (300 emails/day = 9,000/month, unlimited contacts)
- **Why over SendGrid:** SendGrid removed permanent free tier May 27, 2025
- **Use for:** Order confirmations, shipping notifications, password reset
- **Register:** https://brevo.com

```bash
npm install @getbrevo/brevo
```

---

### 10. Analytics — PostHog
- **Cost:** Free (1M events/month + 5K session replays)
- **Tracks:** Page views, clicks, checkout drop-offs, funnel analysis
- **Register:** https://posthog.com

```bash
npm install posthog-js
```

---

### 11. PWA — Serwist
- **Cost:** Free
- **Why over next-pwa:** next-pwa is unmaintained; Serwist works with Next.js 15 App Router
- **Gives you:** Offline support, "Add to Home Screen", push notifications

```bash
npm install serwist next-pwa
npm install -D @serwist/next
```

**What users get after installing PWA:**
- App icon on Android home screen
- Full-screen mode (no browser bar)
- Offline product browsing (cached pages)
- Push notifications for orders, deals, flash sales

---

### 12. Search — PostgreSQL Full-Text Search
- **Cost:** Free (built into Neon)
- **When to upgrade:** When you have 10,000+ products (then consider Meilisearch)

```sql
-- Add search index to products
ALTER TABLE products ADD COLUMN search_vector tsvector;

CREATE INDEX products_search_idx ON products USING gin(search_vector);

-- Update trigger
CREATE FUNCTION products_search_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    to_tsvector('english', coalesce(NEW.name, '')) ||
    to_tsvector('simple', coalesce(NEW.name_bn, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## CI/CD Pipeline — GitHub Actions + Cloudflare Pages

**Auto-deploy on every push to `main`:**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      # Cloudflare Pages auto-deploys via GitHub integration
      # No manual step needed — just connect repo in CF dashboard
```

---

## Future: Mobile App Path (No Conflicts)

### Path 1 — TWA (Phase 4, $25)
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://yourdomain.com/manifest.webmanifest
bubblewrap build
# Upload .aab to Google Play Console
```

### Path 2 — React Native (Phase 5)
```bash
npx create-expo-app@latest varito-mobile
# Your Next.js API routes = same backend
# React Native calls your existing /api/* endpoints
# No backend changes needed
```

---

## Cost Summary

| Service | Free Tier | When Paid Needed |
|---------|-----------|------------------|
| Cloudflare Pages | Unlimited bandwidth | Almost never |
| Neon PostgreSQL | 0.5GB | >0.5GB data |
| Cloudflare R2 | 10GB images | >10GB |
| Supabase Auth | 50K users/month | >50K |
| Brevo Email | 9K emails/month | >9K/month |
| aamarPay | No setup fee | % per transaction always |
| PostHog | 1M events/month | >1M events |
| **Total fixed cost** | **৳0/month** | — |

---

*Varito Solutions Tech Stack | May 2026*
