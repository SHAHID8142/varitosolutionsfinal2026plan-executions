# ENV_VARS.md — Varito Solutions
## Environment Variables Reference | All Agents

> NEVER commit .env.local to git — it's in .gitignore
> Share keys via password manager (Bitwarden free) between computers
> Production keys go into Cloudflare Pages environment variables panel

---

## Local Development: `.env.local`

```bash
# ─── DATABASE ─────────────────────────────────────────────
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/varito?sslmode=require
# Get from: neon.tech → Your project → Connection string

# ─── SUPABASE AUTH ────────────────────────────────────────
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
# Get from: supabase.com → Project → Settings → API

# ─── CLOUDFLARE R2 (Image Storage) ────────────────────────
CLOUDFLARE_R2_ENDPOINT=https://ACCOUNT_ID.r2.cloudflarestorage.com
CLOUDFLARE_R2_ACCESS_KEY_ID=xxx
CLOUDFLARE_R2_SECRET_ACCESS_KEY=xxx
CLOUDFLARE_R2_BUCKET=varito-products
CLOUDFLARE_R2_PUBLIC_URL=https://pub-xxx.r2.dev
# Get from: Cloudflare Dashboard → R2 → Manage R2 API Tokens

# ─── AAMARPAY (Payment Gateway) ───────────────────────────
AAMARPAY_STORE_ID=your-store-id
AAMARPAY_SIGNATURE_KEY=your-signature-key
AAMARPAY_MODE=sandbox
# sandbox or live
# Get from: aamarpay.com → Merchant Dashboard → API Settings
# Sandbox URL: https://sandbox.aamarpay.com
# Live URL: https://secure.aamarpay.com

# ─── BREVO (Email) ────────────────────────────────────────
BREVO_API_KEY=xkeysib-xxxxx
BREVO_SENDER_EMAIL=noreply@yourdomain.com
BREVO_SENDER_NAME=Varito Solutions
# Get from: brevo.com → Settings → API Keys

# ─── POSTHOG (Analytics) ──────────────────────────────────
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
# Get from: posthog.com → Project → Settings → Project API Key
# Note: NEXT_PUBLIC_ prefix = exposed to browser (safe for PostHog)

# ─── APP ──────────────────────────────────────────────────
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Production: https://yourdomain.com

# ─── OPTIONAL: SMS (for order confirmations) ──────────────
# BD SMS providers (free tier or very cheap):
# - Twilio (free trial, then paid)
# - BulkSMSBD (local BD provider)
# - SSL Wireless (BD provider)
# BD_SMS_API_KEY=xxx
# BD_SMS_SENDER_ID=VARITO
```

---

## How to Share Keys Between Computers

1. **Install Bitwarden** (free password manager) on all computers
2. Create a "Secure Note" named "Varito Solutions .env.local"
3. Paste the entire `.env.local` content into the note
4. When setting up a new computer:
   - Pull code from GitHub
   - Open Bitwarden → copy the env note
   - Create `.env.local` in project root
   - Paste content

**Never:**
- Email env keys
- Share via WhatsApp
- Commit to GitHub (it's in .gitignore automatically)

---

## Production: Cloudflare Pages Environment Variables

Set in: Cloudflare Dashboard → Pages → Your Project → Settings → Environment Variables

Add ALL variables from `.env.local` EXCEPT:
- `NEXT_PUBLIC_APP_URL` → change to `https://yourdomain.com`
- `AAMARPAY_MODE` → change from `sandbox` to `live`

---

## .gitignore (Verify These Are Listed)

```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

---

## Generating Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate a random key (general purpose)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

*Keep this file updated when new services are added.*
*Never put actual key values in this file — only variable names.*
