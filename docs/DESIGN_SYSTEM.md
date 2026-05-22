# DESIGN_SYSTEM.md — Varito Solutions
## Design Tokens, Typography, Colors, Spacing | Gemini Flash Agent Reference

> **GEMINI AGENT:** Read this before writing a single line of CSS or JSX.
> Every design decision flows from this document.
> Never use a value that is not defined here.

---

## Brand Identity

**Brand Name:** Varito Solutions  
**Tagline:** আপনার বিশ্বস্ত অনলাইন দোকান (Your Trusted Online Store)  
**Tone:** Trustworthy, Modern, Clean, Accessible  
**Primary Audience:** Mobile Bangladeshi users, 18–45 age range  

---

## Color System

### CSS Variables (Add to `src/styles/globals.css`)

```css
:root {
  /* Primary — Premium Emerald Green (clean, natural, luxury) */
  --color-primary-50:  #ecfdf5;
  --color-primary-100: #d1fae5;
  --color-primary-200: #a7f3d0;
  --color-primary-300: #6ee7b7;
  --color-primary-400: #34d399;
  --color-primary-500: #10b981;  /* Main primary */
  --color-primary-600: #059669;  /* Primary hover */
  --color-primary-700: #047857;
  --color-primary-800: #065f46;
  --color-primary-900: #064e3b;

  /* Accent — Warm Orange (energy, action, CTA) */
  --color-accent-50:  #FFF7ED;
  --color-accent-100: #FFEDD5;
  --color-accent-200: #FED7AA;
  --color-accent-300: #FDBA74;
  --color-accent-400: #FB923C;
  --color-accent-500: #F97316;  /* Main accent */
  --color-accent-600: #EA580C;  /* Accent hover */
  --color-accent-700: #C2410C;

  /* Success — Green */
  --color-success-500: #22C55E;
  --color-success-600: #16A34A;

  /* Warning — Amber */
  --color-warning-500: #F59E0B;
  --color-warning-600: #D97706;

  /* Danger — Red */
  --color-danger-500: #EF4444;
  --color-danger-600: #DC2626;

  /* Neutral — Gray scale */
  --color-gray-50:  #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-300: #D1D5DB;
  --color-gray-400: #9CA3AF;
  --color-gray-500: #6B7280;
  --color-gray-600: #4B5563;
  --color-gray-700: #374151;
  --color-gray-800: #1F2937;
  --color-gray-900: #111827;

  /* Background */
  --color-bg-page:      #F9FAFB;  /* Page background */
  --color-bg-card:      #FFFFFF;  /* Card/surface */
  --color-bg-muted:     #F3F4F6;  /* Muted sections */

  /* Text */
  --color-text-primary:   #111827;  /* Main text */
  --color-text-secondary: #4B5563;  /* Secondary text */
  --color-text-muted:     #9CA3AF;  /* Placeholder, captions */
  --color-text-inverse:   #FFFFFF;  /* On dark bg */

  /* Border */
  --color-border:         #E5E7EB;
  --color-border-strong:  #D1D5DB;

  /* Special — Bangladesh Market */
  --color-cod-bg:    #FFF7ED;  /* COD badge background */
  --color-cod-text:  #C2410C;  /* COD badge text */
  --color-bkash-bg:  #FFE4EF;  /* bKash pink */
  --color-bkash-text: #BE185D; /* bKash text */
  --color-nagad-bg:  #FFF7ED;  /* Nagad orange */
  --color-nagad-text: #C2410C; /* Nagad text */
}
```

### Tailwind Config Extensions
Add to `tailwind.config.ts`:
```typescript
colors: {
  primary: { DEFAULT: 'var(--color-primary-500)', hover: 'var(--color-primary-600)' },
  accent:  { DEFAULT: 'var(--color-accent-500)',  hover: 'var(--color-accent-600)' },
  // ... map all CSS variables
}
```

---

## Typography

### Font Stack

```css
/* English: Plus Jakarta Sans (Google Fonts) */
--font-english: 'Plus Jakarta Sans', 'Segoe UI', system-ui, -apple-system, sans-serif;

/* Bangla: Hind Siliguri (Google Fonts) */
--font-bangla: 'Hind Siliguri', 'Kalpurush', sans-serif;
```

### Font Loading (`src/lib/fonts.ts`)
```typescript
import { Plus_Jakarta_Sans, Hind_Siliguri } from 'next/font/google'

export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const hindSiliguri = Hind_Siliguri({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['bengali', 'latin'],
  variable: '--font-hind',
  display: 'swap',
})
```

### Type Scale

| Token | Size | Weight | Use |
|-------|------|--------|-----|
| `text-display` | 2rem (32px) | 700 | Hero headlines |
| `text-h1` | 1.75rem (28px) | 700 | Page titles |
| `text-h2` | 1.5rem (24px) | 600 | Section titles |
| `text-h3` | 1.25rem (20px) | 600 | Card titles |
| `text-h4` | 1.125rem (18px) | 500 | Sub-sections |
| `text-body-lg` | 1.125rem (18px) | 400 | Large body text |
| `text-body` | 1rem (16px) | 400 | Default body — MINIMUM for readable content |
| `text-body-sm` | 0.875rem (14px) | 400 | Secondary info, labels |
| `text-caption` | 0.75rem (12px) | 400 | Captions ONLY — never main content |

**Rule: Never use `text-caption` (12px) for any clickable or critical information.**

---

## Spacing System

Use Tailwind's default spacing scale (4px base):

| Token | Value | Use |
|-------|-------|-----|
| `space-1` | 4px | Tight internal spacing |
| `space-2` | 8px | Icon-to-text gaps |
| `space-3` | 12px | Form field internal |
| `space-4` | 16px | Default padding |
| `space-5` | 20px | Card padding |
| `space-6` | 24px | Section inner spacing |
| `space-8` | 32px | Between sections |
| `space-12` | 48px | Major section gaps |
| `space-16` | 64px | Page top/bottom padding |

---

## Component Design Rules (Premium Upgrade)

### Cards
```
Background: var(--color-bg-card) = white
Border: 1px solid var(--color-border)
Border radius: 16px (rounded-2xl)
Shadow: shadow-sm (default), hover:shadow-xl (interactive)
Padding: 16px (p-4)
Hover: transition-all duration-300 hover:-translate-y-1
```

### Buttons
```
Primary: bg-primary-500, text-white, hover:bg-primary-600
Secondary: bg-white, border border-primary-500, text-primary-500
Accent (CTA): bg-accent-500, text-white, hover:bg-accent-600
Ghost: transparent, text-gray-700, hover:bg-gray-100
Danger: bg-danger-500, text-white

Height: 44px minimum (touch target — critical for mobile)
Border radius: 12px (rounded-xl)
Font weight: 600

CRITICAL RULE: **NEVER USE GRADIENTS** for buttons, backgrounds, or text. Solid colors only for a premium, clean look. (Plus Jakarta Sans)
```

### Form Inputs
```
Height: 44px minimum
Border: 1px solid var(--color-border)
Border radius: 12px (rounded-xl)
Focus: border-primary-500, ring-4 ring-primary-100
Background: white
```

### Glassmorphism (Layout Elements)
```
Top Header & Bottom Navigation:
Background: rgba(255, 255, 255, 0.8)
Backdrop blur: blur(12px)
Border: 1px solid rgba(229, 231, 235, 0.5)
```

---

## Layout Grid

### Mobile (Default — Mobile First)
```
Container: 100% width
Padding: 16px horizontal (px-4)
Grid: 2 columns for product cards
```

### Tablet (md: 768px+)
```
Container: max-w-2xl
Grid: 3 columns for product cards
```

### Desktop (lg: 1024px+)
```
Container: max-w-6xl
Grid: 4 columns for product cards
```

---

## Bangladesh-Specific UI Rules

### Price Display
```
Format: ৳ [amount] (BDT symbol, comma-separated thousands)
Example: ৳1,299
Sale: Show original strikethrough + new price + discount %
COD surcharge: Show as "+৳40 COD চার্জ" (always visible, never hidden)
```

### Payment Badges
```
COD: Orange badge — "ক্যাশ অন ডেলিভারি"
bKash: Pink badge with bKash color #E2136E
Nagad: Orange badge with Nagad color #F37121
```

### Trust Signals
```
Always show on product page:
- "ফেরত নীতি" (Return Policy) badge — 7 days
- "যাচাইকৃত ব্যবসা" (Verified Business) badge
- Phone number prominently in header
- WhatsApp button fixed bottom-right
```

### Loading States
```
Use skeleton loading (gray animated blocks), never spinners alone
Product card skeleton: image placeholder + 3 text line placeholders
Target: content appears within 1.5 seconds on 3G
```

---

## Icon System

Use **Lucide React** (included with shadcn/ui):
```bash
# Already available via shadcn — no separate install needed
import { ShoppingCart, Heart, Search, Menu, Phone } from 'lucide-react'
```

Key icons to use:
- Cart: `ShoppingCart`
- Search: `Search`
- Menu: `Menu`
- Phone: `Phone`
- WhatsApp: Custom SVG (WhatsApp official icon)
- Home: `Home`
- User: `User`
- Order: `Package`
- Back: `ChevronLeft`
- Filter: `SlidersHorizontal`

---

## Animation Rules

```css
/* Transitions — subtle only */
transition-duration: 150ms (fast) / 200ms (default) / 300ms (slow)
transition-timing: ease-in-out

/* Hover effects */
.interactive:hover { transform: translateY(-1px); }  /* Very subtle lift */

/* Never use: */
/* - Spinning loading animations on content */
/* - Large scale transforms */
/* - Animations that block interaction */
```

---

## Accessibility Requirements

- **Color contrast:** Minimum 4.5:1 for body text, 3:1 for large text
- **Touch targets:** Minimum 44×44px for all interactive elements
- **Focus ring:** Always visible (ring-2 ring-primary-200)
- **Screen reader:** All images have `alt` text, icons have `aria-label`
- **Error messages:** Announced via `role="alert"` or `aria-live`

---

*Varito Solutions Design System | Gemini Flash Agent Reference | 2026*
