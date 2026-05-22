# LAUNCH CHECKLIST — Varito Solutions
### Pre-launch verification | Go through every item before going live

---

## Phase 1 — Technical Setup

### Domain & Hosting
- [ ] Domain registered (Namecheap/Porkbun)
- [ ] Domain added to Cloudflare (nameservers updated)
- [ ] SSL certificate active (padlock shows in browser)
- [ ] Cloudflare Pages project created and linked to GitHub repo
- [ ] Custom domain connected in Cloudflare Pages

### Accounts Configured
- [ ] Neon DB project created (`varito-production`), connection string saved
- [ ] Cloudflare R2 bucket created (`varito-products`), public access enabled
- [ ] Supabase project created, keys saved
- [ ] Brevo domain email verified (info@yourdomain.com)
- [ ] aamarPay sandbox keys tested, production keys ready
- [ ] PostHog project created, tracking script added
- [ ] All API keys added to Cloudflare Pages environment variables

---

## Phase 2 — Website Build

### Pages
- [ ] Homepage — hero, categories, featured products
- [ ] Category listing page with filters
- [ ] Product detail page
- [ ] Cart page (COD surcharge visible)
- [ ] Checkout page (guest checkout works, COD is default)
- [ ] Order confirmation page
- [ ] My Orders page
- [ ] About Us / Contact page (phone number visible in header)
- [ ] Returns & Refund Policy page
- [ ] Search results page
- [ ] Admin dashboard (product CRUD, order management)

### Payments
- [ ] COD payment works end-to-end
- [ ] bKash payment works (aamarPay sandbox test)
- [ ] Nagad payment works (aamarPay sandbox test)
- [ ] Card payment works (aamarPay sandbox test)
- [ ] COD surcharge (৳40) shown clearly in cart and checkout
- [ ] Order confirmation email sent via Brevo after payment

### Trust & Compliance
- [ ] Phone number visible in header on all pages
- [ ] Return policy badge on every product card
- [ ] "Verified Business" or "Varito Guarantee" trust badge
- [ ] Returns Policy page live and linked in footer
- [ ] HTTPS active (required by law + trust)
- [ ] Business address visible on Contact page
- [ ] Legal business name in footer

---

## Phase 3 — UX Quality

### Mobile Testing
- [ ] Tested on real Android phone (not just desktop browser)
- [ ] Tested on 4GB RAM phone (target device)
- [ ] Tested on Chrome DevTools → Slow 3G speed
- [ ] Bottom navigation works correctly (Home, Categories, Search, Cart, Profile)
- [ ] All touch targets are at least 44×44px (buttons are tappable)
- [ ] Text is at minimum 16px body size
- [ ] No horizontal scroll on mobile

### Product Photos
- [ ] All products have white background photos
- [ ] Minimum 4 photos per product (front, back, detail, in-use)
- [ ] Photos are at least 1000×1000px resolution
- [ ] Zoom works on product page
- [ ] Photos load fast (served via Cloudflare R2)

### Checkout Flow
- [ ] Guest checkout works without creating account
- [ ] Address input has District → Thana → Area hierarchy dropdowns
- [ ] COD is the first option shown
- [ ] Order total shown before confirmation (no hidden fees)
- [ ] SMS sent within 60 seconds of order confirmation
- [ ] Order number generated and shown to customer

---

## Phase 4 — Performance

### Speed Tests
- [ ] Google PageSpeed Insights score: >70 on Mobile
- [ ] Lighthouse score: >75 on Mobile
- [ ] First Contentful Paint (FCP): <3 seconds on 3G
- [ ] All images are WebP or next-gen format
- [ ] Images are lazy-loaded

### PWA
- [ ] Web App Manifest (`manifest.json`) configured
- [ ] Service Worker registered via Serwist
- [ ] "Add to Home Screen" prompt appears on Android Chrome
- [ ] App icon shows correctly when installed
- [ ] Offline page shows when user loses connection
- [ ] App opens in full-screen mode when launched from home screen

---

## Phase 5 — Analytics & Monitoring

- [ ] PostHog tracking active — pageviews recording
- [ ] PostHog funnels set up (Homepage → Category → Product → Checkout → Confirmation)
- [ ] PostHog session recording enabled
- [ ] Brevo transactional email logs working
- [ ] Cloudflare Analytics showing traffic
- [ ] Admin dashboard shows real-time orders

---

## Phase 6 — Social & Marketing

### Before Launch Day
- [ ] Facebook Business Page created and populated with 5+ posts
- [ ] WhatsApp Business account set up with catalogue
- [ ] TikTok account created
- [ ] Instagram account created
- [ ] All social accounts link to website in bio

### Launch Day
- [ ] Post announcement on Facebook Page
- [ ] Post on WhatsApp Status
- [ ] Post in 3+ Chattogram Facebook buy/sell groups
- [ ] Post in 2+ F-commerce seller groups (for packaging products)
- [ ] Post first TikTok video

### B2B Packaging Outreach
- [ ] Post in "F-Commerce Seller Bangladesh" Facebook groups
- [ ] Create WhatsApp Broadcast list for bulk buyers
- [ ] Set up bulk pricing for packaging materials (order 50+ pieces = special rate)

---

## LAUNCH — Go/No-Go

Only go live when ALL of these are checked:

| Item | Status |
|------|--------|
| SSL active | [ ] |
| COD payment works | [ ] |
| bKash payment works (test) | [ ] |
| Guest checkout works | [ ] |
| SMS confirmation works | [ ] |
| Mobile tested on real phone | [ ] |
| Returns Policy page live | [ ] |
| Phone number in header | [ ] |
| White background product photos | [ ] |
| Admin dashboard can see orders | [ ] |

**If all 10 are checked: LAUNCH 🚀**

---

*Varito Solutions | Launch Checklist | 2026*
