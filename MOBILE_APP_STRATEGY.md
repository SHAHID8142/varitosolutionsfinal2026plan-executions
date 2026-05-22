# MOBILE APP STRATEGY — Varito Solutions
### PWA → Play Store → React Native | Zero Conflicts | 2026

---

## The Core Answer

> **"If I build this website now with Next.js, will there be any conflict when converting to a mobile app later?"**

**No conflict. Zero. Here is the exact why:**

Your Next.js website has two parts:
1. **Frontend** — What users see (pages, components)
2. **Backend API** — `/api/*` routes that handle orders, payments, products

When you build the mobile app later, you will **replace part 1** (build a React Native frontend) but **keep part 2 exactly as-is** (same API). The app just calls your existing API. Nothing breaks.

---

## The 4-Stage Evolution

### Stage 1 — Now: Next.js Website + PWA
**Timeline:** Phase 2–3 (Week 3–8)
**Cost:** ৳0

```
User on Android → Opens Chrome → Goes to varitosolutions.com
Chrome shows "Add to Home Screen" prompt
User taps → App icon appears on home screen
App opens full-screen, no browser bar
Push notifications work for deals, order updates
Offline browsing works for cached product pages
```

**What Serwist (PWA library) adds to your Next.js site:**
- `manifest.json` — app name, icon, theme color
- `sw.js` — service worker for caching + push notifications
- "Add to Home Screen" prompt on Android Chrome

**Users cannot tell the difference** between your PWA and a "real app" on Android.

---

### Stage 2 — ~500 Orders/Month: Google Play Store via TWA
**Timeline:** Phase 4
**Cost:** $25 one-time (Google Play registration)

**Trusted Web Activity (TWA)** = your website rendered inside a shell that looks native on Android.

```bash
# Install Bubblewrap (free Google tool)
npm install -g @bubblewrap/cli

# Initialize with your site's manifest
bubblewrap init --manifest https://varitosolutions.com/manifest.webmanifest

# Build the APK/AAB
bubblewrap build

# Upload .aab file to Google Play Console
```

**What you get:**
- Your app appears in Google Play Store search
- "Install" button just like any real app
- Full-screen experience, no browser bar
- All your existing website features work
- **Zero new code** — same website, just wrapped

**Requirements to pass Google Play review:**
- PWA Lighthouse score > 80 (you'll hit this)
- HTTPS active (Cloudflare handles this)
- `assetlinks.json` file on your domain (Bubblewrap generates it)
- Closed testing phase: 20 testers for 14 days (ask friends/family)

---

### Stage 3 — ~৳5L/Month: React Native App
**Timeline:** Phase 5
**Cost:** $2,000–5,000 (BD freelancer) or self-built

**Why React Native (not Flutter):**
- Language: JavaScript/TypeScript — **same as your Next.js website**
- You already know the language, share business logic
- Largest BD developer pool for future hiring
- Native performance, full device access

**The key insight — shared backend:**
```
Your Next.js website calls:          Your React Native app calls:
POST /api/orders                     POST /api/orders         ← SAME
GET /api/products                    GET /api/products        ← SAME
POST /api/payment/initiate           POST /api/payment/initiate ← SAME
GET /api/orders/[id]                 GET /api/orders/[id]     ← SAME

You change NOTHING in your backend. Just add a new frontend.
```

**MVP React Native features (Phase 5):**
- Product browsing and search
- Cart + COD/bKash checkout (calls your existing API)
- Order tracking
- Push notifications (more control than PWA)
- Biometric login (fingerprint)
- Camera: scan product barcode (future)

---

### Stage 4 — ~৳20L+/Month: iOS App Store
**Cost:** $99/year (Apple Developer Program)
**Same codebase:** React Native compiles for both Android and iOS

---

## What NOT to Do

| Approach | Problem | Verdict |
|----------|---------|---------|
| **Capacitor** (wrap Next.js in WebView) | Breaks SSR, Server Components, Server Actions | AVOID |
| **Build app before website** | No SEO, no organic traffic, no analytics | AVOID |
| **Build app on Day 1** | Splits resources, no product-market fit yet | AVOID |
| **iOS first** | ~5-8% BD market share, $99/year + Mac required | Later |
| **React Native now (zero budget)** | Need >৳5L/month revenue to justify | Wait |

---

## Tech Compatibility Matrix

| Technology | Website Now | TWA (Stage 2) | React Native (Stage 3) |
|-----------|-------------|--------------|----------------------|
| Next.js 15 | ✅ Core | ✅ Same code | N/A (separate frontend) |
| Neon PostgreSQL | ✅ Core | ✅ Same DB | ✅ Same DB via API |
| aamarPay | ✅ Payments | ✅ Same | ✅ Same API endpoints |
| Supabase Auth | ✅ Auth | ✅ Same | ✅ SDK available for RN |
| Cloudflare R2 | ✅ Images | ✅ Same | ✅ Same image URLs |
| Brevo Email | ✅ Email | ✅ Same | ✅ Same |
| PostHog | ✅ Web | ✅ Same | ✅ React Native SDK |

**Every single tool works at every stage. No replacements. No rewrites.**

---

## PWA Capabilities Reference (2025)

| Feature | Android Chrome | iOS Safari |
|---------|--------------|------------|
| Add to Home Screen | ✅ Auto prompt | ⚠️ Manual (Share → Add) |
| Full-screen mode | ✅ | ✅ |
| Push Notifications | ✅ | ✅ (iOS 16.4+, must be installed) |
| Offline browsing | ✅ | ✅ |
| Background sync | ✅ | ⚠️ Limited |
| Camera access | ✅ | ✅ |
| Geolocation | ✅ | ✅ |
| Biometric login | ✅ (WebAuthn) | ✅ |

**Bangladesh iOS market: ~5–8%** → Android PWA covers 92–95% of your users perfectly.

---

## Summary Timeline

```
Week 7–8     → Website live + PWA active = App-like experience
Month 3–4    → 200–300 orders/month, fine-tune
Month 5–6    → 500 orders/month → Bubblewrap → Play Store ($25)
Month 8–12   → ৳5L+/month → React Native app decision
Year 2+      → iOS App Store if iOS users growing
```

---

*Varito Solutions Mobile Strategy | Zero conflicts guaranteed | 2026*
