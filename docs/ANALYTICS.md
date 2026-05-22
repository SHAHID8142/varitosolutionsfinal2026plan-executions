# ANALYTICS.md — Varito Solutions
## Analytics Architecture | PostHog + Custom Admin Analytics

> Two analytics layers:
> 1. **PostHog** — User behaviour, traffic, funnels (zero cost, self-hosted option)
> 2. **Custom DB Analytics** — Business metrics calculated from the orders/products DB
>
> **Gemini:** Integrate PostHog tracking calls in the right places (see §3).
> **Claude:** Build the custom analytics API routes (see §4).
> **Both:** Read this before touching anything analytics-related.

---

## 📊 1. What We Track and Why

| Metric | Source | Why It Matters |
|--------|--------|---------------|
| Page views by page | PostHog | Know which products/categories get traffic |
| Add to cart events | PostHog | Know which products people want |
| Cart abandonment rate | PostHog funnel | Know where we lose customers |
| Checkout funnel drop-off | PostHog funnel | Find the leaky step |
| Search queries | PostHog | Know what customers can't find |
| Device type (mobile/desktop) | PostHog | Confirm our mobile-first investment |
| Revenue by day/week/month | DB query | Core business health |
| Revenue by payment method | DB query | Know which payment methods are used |
| Order status funnel | DB query | Know fulfilment health |
| COD delivery success rate | DB query | Know what % of COD actually gets delivered |
| Top products by revenue | DB query | Know what to stock more of |
| Low-performing products | DB query | Know what to discontinue |
| Average order value | DB query | Track growth over time |
| New vs returning customers | DB query + PostHog | Know acquisition vs retention |
| Geographic distribution | DB query | Know which districts order most |
| Inventory turnover | DB query | Know stock management health |

---

## 🔧 2. PostHog Setup

### Installation
```bash
npm install posthog-js
```

### Provider Setup (`src/app/layout.tsx`)
```typescript
// PostHog is initialized once at root layout level
// Use the PostHog Next.js provider

import { PostHogProvider } from './posthog-provider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}
```

### PostHog Provider (`src/app/posthog-provider.tsx`)
```typescript
'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: 'https://eu.posthog.com',   // EU data residency
      capture_pageview: false,               // We capture manually (App Router)
      capture_pageleave: true,
      autocapture: false,                    // Be intentional about what we capture
      persistence: 'localStorage',
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
```

### Page View Tracking (`src/app/posthog-pageview.tsx`)
```typescript
// Track page views on route changes in App Router
'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = `${url}?${searchParams.toString()}`
      }
      posthog.capture('$pageview', { '$current_url': url })
    }
  }, [pathname, searchParams, posthog])

  return null
}
```

---

## 📍 3. Event Tracking Map (Gemini Implements These)

Add PostHog `.capture()` calls in the exact components listed below.

### Product Events
```typescript
// In ProductCard component — when "Add to Cart" is clicked
posthog.capture('product_added_to_cart', {
  product_id: product.id,
  product_name: product.name,
  product_slug: product.slug,
  category: product.category.name,
  price: product.salePrice ?? product.price,
  is_sale: !!product.salePrice,
})

// In ProductDetail page — when page loads
posthog.capture('product_viewed', {
  product_id: product.id,
  product_name: product.name,
  product_slug: product.slug,
  category: product.category.name,
  price: product.salePrice ?? product.price,
})

// In SearchBar — when user submits a search
posthog.capture('search_performed', {
  query: searchTerm,
  results_count: results.length,
})

// In SearchBar — when user clicks on a search result
posthog.capture('search_result_clicked', {
  query: searchTerm,
  product_id: clickedProduct.id,
  position: index,  // which result position (1 = first)
})
```

### Cart & Checkout Events
```typescript
// In CartPage — when page loads
posthog.capture('cart_viewed', {
  item_count: cart.items.length,
  cart_total: cart.total,
})

// In CartPage — when item is removed
posthog.capture('cart_item_removed', {
  product_id: item.productId,
  product_name: item.name,
})

// In CheckoutPage — when user proceeds from cart to checkout
posthog.capture('checkout_started', {
  item_count: cart.items.length,
  cart_total: cart.total,
  payment_method: 'not_selected',
})

// In CheckoutPage — when payment method is selected
posthog.capture('payment_method_selected', {
  method: selectedMethod,  // cod | bkash | nagad | card
  order_total: cart.total,
})

// In CheckoutPage — when form is submitted (order placed)
posthog.capture('order_placed', {
  order_id: order.orderNumber,
  total: order.total,
  payment_method: order.paymentMethod,
  item_count: order.items.length,
  district: order.address.district,
})

// In CheckoutPage — when form validation fails
posthog.capture('checkout_form_error', {
  field: fieldName,
  error: errorMessage,
})
```

### Navigation Events
```typescript
// In CategoryCard — when user clicks a category
posthog.capture('category_clicked', {
  category_id: category.id,
  category_name: category.name,
  source: 'homepage' | 'category_page' | 'menu',
})

// In Header — when WhatsApp button is clicked
posthog.capture('whatsapp_clicked', {
  source: 'header' | 'footer' | 'product_page',
})
```

### User Identity (when logged in)
```typescript
// In auth flow — after OTP verified
posthog.identify(user.id, {
  phone: user.phone,
  name: user.name,
})

// On logout
posthog.reset()
```

---

## 📡 4. Custom Admin Analytics API Routes (Claude Implements These)

All routes return data for the admin analytics dashboard.
All routes require admin auth. All aggregations run on the DB.

### `GET /api/admin/analytics/revenue`
```typescript
// Query params: period = 'today' | '7d' | '30d' | '90d' | 'custom'
//               dateFrom, dateTo (if period = 'custom')

// Response:
{
  data: {
    totalRevenue: number          // Sum of orders.total where status != 'cancelled'
    orderCount: number
    avgOrderValue: number
    comparison: {
      previousPeriod: number      // Same duration, previous period
      percentChange: number       // ((current - previous) / previous) * 100
    }
    byDay: [{
      date: string               // 'YYYY-MM-DD'
      revenue: number
      orderCount: number
    }]
    byPaymentMethod: [{
      method: string             // 'cod' | 'bkash' | 'nagad' | 'card'
      revenue: number
      count: number
      percentage: number
    }]
  }
}
```

### `GET /api/admin/analytics/orders`
```typescript
// Response:
{
  data: {
    funnel: {
      pending: number
      confirmed: number
      processing: number
      shipped: number
      delivered: number
      cancelled: number
    }
    cancellationRate: number        // (cancelled / total) * 100
    codDeliverySuccessRate: number  // (delivered COD / shipped COD) * 100
    avgFulfillmentDays: number      // avg days from confirmed to shipped
    byHour: [{                      // For heatmap
      hour: number                  // 0-23
      count: number
    }]
  }
}
```

### `GET /api/admin/analytics/products`
```typescript
// Query params: period = '7d' | '30d' | '90d' (default: 30d)

// Response:
{
  data: {
    topByRevenue: [{
      productId: number
      productName: string
      revenue: number
      units: number
    }]
    topByOrders: [{
      productId: number
      productName: string
      orderCount: number
      units: number
    }]
    lowPerforming: [{              // Ordered < 5 times in period
      productId: number
      productName: string
      orderCount: number
      stock: number
    }]
    outOfStock: [{
      productId: number
      productName: string
      lastStockDate: string        // When it last had stock
    }]
  }
}
```

### `GET /api/admin/analytics/customers`
```typescript
// Response:
{
  data: {
    total: number
    new: number                    // Registered in last 30 days
    returning: number              // Placed > 1 order
    repeatRate: number             // (returning / total) * 100
    topDistricts: [{
      district: string
      orderCount: number
      revenue: number
    }]
    topCustomers: [{               // By lifetime value
      userId: string
      phone: string
      name: string
      orderCount: number
      totalSpent: number
    }]
  }
}
```

### `GET /api/admin/analytics/inventory`
```typescript
// Response:
{
  data: {
    totalProducts: number
    inStock: number
    lowStock: number               // < threshold (default 10)
    outOfStock: number
    totalStockValue: number        // Sum(stock * cost_price) — Super Admin only
    lowStockProducts: [{
      productId: number
      name: string
      stock: number
      threshold: number
    }]
  }
}
```

---

## 🎯 5. PostHog Funnels to Set Up (After Go-Live)

In the PostHog dashboard, create these funnels manually:

### Checkout Funnel
```
Step 1: product_viewed
Step 2: product_added_to_cart
Step 3: cart_viewed
Step 4: checkout_started
Step 5: order_placed
```

### Search to Order Funnel
```
Step 1: search_performed
Step 2: search_result_clicked
Step 3: product_added_to_cart
Step 4: order_placed
```

---

## 📋 6. Analytics Admin Dashboard Layout (Gemini Builds)

```
/admin/analytics
├── Tab: Revenue          ← Line chart + total cards
├── Tab: Orders           ← Funnel + heatmap + cancellation rate
├── Tab: Products         ← Top products table + low performers
├── Tab: Customers        ← Map + top customers table
└── Tab: Inventory        ← Stock summary + low stock list

Date range picker (global): Today | 7 Days | 30 Days | 90 Days | Custom
```

**Charts library:** `recharts` (lightweight, works well with Next.js)
```bash
npm install recharts
```

---

## ⚙️ 7. Environment Variables Needed
```bash
# PostHog (client-safe)
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com

# If using PostHog server-side API for admin analytics
POSTHOG_PERSONAL_API_KEY=phx_xxxxxxxxxxxxxxxx
POSTHOG_PROJECT_ID=12345
```

---

*Analytics is how we know if the business is healthy. Both agents contribute.*
*Gemini: events. Claude: DB aggregations. Inspector: verify both are wired correctly.*
