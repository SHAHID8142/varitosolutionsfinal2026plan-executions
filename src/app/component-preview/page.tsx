/**
 * @file page.tsx
 * @path /component-preview
 * @description Responsive component showcase for the Varito Solutions design system.
 *              Allows reviewing every UI component across 4 target breakpoints.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PriceTag } from "@/components/ui/price-tag"
import { RatingStars } from "@/components/ui/rating-stars"
import { QuantitySelector } from "@/components/ui/quantity-selector"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { EmptyState } from "@/components/ui/empty-state"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import {
  ProductCardSkeleton,
  ListItemSkeleton,
} from "@/components/ui/loading-skeleton"
import { ProductCard } from "@/components/shop/product-card"
import { CategoryCard } from "@/components/shop/category-card"
import { PaymentMethodSelector } from "@/components/shop/payment-method-selector"
import { OrderSummary } from "@/components/shop/order-summary"
import { ImageGallery } from "@/components/shop/image-gallery"
import { AddressForm } from "@/components/shop/address-form"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { SearchBar } from "@/components/layout/search-bar"
import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { AdminHeader } from "@/components/layout/admin-header"
import { AdminBreadcrumb } from "@/components/layout/admin-breadcrumb"
import { StatsCard } from "@/components/admin/stats-card"
import { OrderStatusBadge } from "@/components/admin/order-status-badge"
import { OrdersTable } from "@/components/admin/orders-table"
import { OrderTimeline } from "@/components/admin/order-timeline"
import { ProductsTable } from "@/components/admin/products-table"
import { ProductForm } from "@/components/admin/product-form"
import { CategoryTree } from "@/components/admin/category-tree"
import { ShoppingCart, Package, TrendingUp, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
// TYPES & CONSTANTS
// ─────────────────────────────────────────────

type Breakpoint = "mobile" | "tablet" | "desktop" | "wide" | "all"

const BREAKPOINTS = {
  mobile: 375,
  tablet: 768,
  desktop: 1280,
  wide: 1440,
} as const

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────

/**
 * Preview container that scales content to fit if necessary.
 */
function PreviewBox({
  width,
  label,
  children,
}: {
  width: number
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
        {label} ({width}px)
      </div>
      <div
        className="border border-dashed border-gray-200 bg-white overflow-hidden rounded-lg shadow-sm"
        style={{ width: "100%", maxWidth: `${width}px` }}
      >
        <div style={{ width: `${width}px`, minHeight: "100px" }} className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}

function ComponentSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-6 py-12 border-t border-gray-100 first:border-0">
      <h2 className="text-2xl font-bold text-gray-900 px-4">{title}</h2>
      <div className="flex flex-col gap-10">
        {children}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────

export default function ComponentPreviewPage() {
  const [activeBreakpoint, setActiveBreakpoint] = React.useState<Breakpoint>("all")
  const [quantity, setQuantity] = React.useState(1)
  const [paymentMethod, setPaymentMethod] = React.useState<"cod" | "bkash" | "nagad" | "card">("cod")

  const renderResponsive = (children: React.ReactNode) => {
    if (activeBreakpoint === "all") {
      return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 px-4">
          <PreviewBox width={BREAKPOINTS.mobile} label="Mobile">
            {children}
          </PreviewBox>
          <PreviewBox width={BREAKPOINTS.tablet} label="Tablet">
            {children}
          </PreviewBox>
          <PreviewBox width={BREAKPOINTS.desktop} label="Desktop">
            {children}
          </PreviewBox>
          <PreviewBox width={BREAKPOINTS.wide} label="Wide">
            {children}
          </PreviewBox>
        </div>
      )
    }

    return (
      <div className="flex justify-center px-4">
        <PreviewBox
          width={BREAKPOINTS[activeBreakpoint as keyof typeof BREAKPOINTS]}
          label={activeBreakpoint.charAt(0).toUpperCase() + activeBreakpoint.slice(1)}
        >
          {children}
        </PreviewBox>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Sticky Header with Breakpoint Switcher */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Package className="text-primary size-6" />
            <h1 className="text-lg font-bold">Varito Component Showcase</h1>
          </div>
          
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            {(["mobile", "tablet", "desktop", "wide", "all"] as Breakpoint[]).map((b) => (
              <button
                key={b}
                onClick={() => setActiveBreakpoint(b)}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                  activeBreakpoint === b
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                {b.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8">

        {/* PREMIUM FEATURES */}
        <ComponentSection title="✨ Premium UI Features">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
            <div className="flex flex-col gap-4">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Premium Primary & Accent</span>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="lg">Primary Emerald</Button>
                <Button variant="accent" size="lg">Accent Orange</Button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Glassmorphism</span>
              <div className="relative h-32 rounded-2xl overflow-hidden bg-primary p-6 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4 text-white font-bold shadow-xl">
                  Backdrop Blur Effect
                </div>
              </div>
            </div>
          </div>
        </ComponentSection>
        
        {/* BUTTONS */}
        <ComponentSection title="🧩 Button Component">
          {renderResponsive(
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="accent">Accent / CTA</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium (Default)</Button>
                <Button size="lg">Large</Button>
                <Button size="icon"><ShoppingCart /></Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button loading>Processing</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          )}
        </ComponentSection>

        {/* BADGES */}
        <ComponentSection title="🏷️ Badge Component">
          {renderResponsive(
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="sale">Sale -20%</Badge>
              <Badge variant="verified">Verified</Badge>
              <Badge variant="cod">COD Available</Badge>
              <Badge variant="bkash">bKash</Badge>
              <Badge variant="nagad">Nagad</Badge>
            </div>
          )}
        </ComponentSection>

        {/* PRICE TAGS */}
        <ComponentSection title="💰 PriceTag Component">
          {renderResponsive(
            <div className="flex flex-col gap-6">
              <PriceTag price={1500} size="lg" />
              <PriceTag price={1500} salePrice={1200} size="lg" />
              <PriceTag price={550} salePrice={499} size="md" />
              <PriceTag price={120} size="sm" />
            </div>
          )}
        </ComponentSection>

        {/* FORMS & INPUTS */}
        <ComponentSection title="📝 Forms & Inputs">
          {renderResponsive(
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-400">Quantity Selector</span>
                <QuantitySelector value={quantity} onChange={setQuantity} />
              </div>
            </div>
          )}
        </ComponentSection>

        {/* NAVIGATION */}
        <ComponentSection title="🧭 Navigation">
          {renderResponsive(
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-400">Breadcrumb</span>
                <Breadcrumb
                  items={[
                    { label: "Products", href: "/products" },
                    { label: "Bath Fittings", href: "/category/bath" },
                    { label: "Luxury Gold Faucet" },
                  ]}
                />
              </div>
            </div>
          )}
        </ComponentSection>

        {/* RATING STARS */}
        <ComponentSection title="⭐ RatingStars Component">
          {renderResponsive(
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-400">Display mode</span>
                <RatingStars rating={4.5} totalReviews={12} size="lg" />
                <RatingStars rating={3} totalReviews={128} size="md" />
                <RatingStars rating={5} totalReviews={5} size="sm" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-400">Interactive mode</span>
                <RatingStars interactive size="lg" />
              </div>
            </div>
          )}
        </ComponentSection>

        {/* LAYOUT */}
        <ComponentSection title="🏗️ Layout Components">
          <div className="flex flex-col gap-12">
            <div>
              <span className="text-xs text-gray-400 mb-4 block px-4">Full Header (Sticky in actual use)</span>
              <Header />
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 px-4">
              <PreviewBox width={BREAKPOINTS.mobile} label="Mobile Header (Search collapsed)">
                <Header />
              </PreviewBox>
              <PreviewBox width={BREAKPOINTS.mobile} label="Mobile Bottom Navigation">
                <div className="relative h-24 bg-gray-100">
                  <BottomNav />
                </div>
              </PreviewBox>
            </div>

            <div className="px-4">
              <span className="text-xs text-gray-400 mb-4 block">Search Bar</span>
              <div className="max-w-md">
                <SearchBar />
              </div>
            </div>

            <div>
              <span className="text-xs text-gray-400 mb-4 block px-4">Footer</span>
              <Footer />
            </div>
          </div>
        </ComponentSection>

        {/* SHOP CARDS */}
        <ComponentSection title="🛍️ Shop Cards">
          {renderResponsive(
            <div className="flex flex-col gap-10">
              <div className="w-full max-w-[280px]">
                <span className="text-xs text-gray-400 mb-2 block">Product Card</span>
                <ProductCard
                  id="1"
                  name="Luxury Emerald Bathroom Faucet"
                  slug="luxury-emerald-faucet"
                  image="https://placehold.co/400x400/10b981/white.png?text=Faucet"
                  price={4500}
                  salePrice={3800}
                  stock={15}
                  isNew={true}
                />
              </div>
              <div className="w-full max-w-[160px]">
                <span className="text-xs text-gray-400 mb-2 block">Category Card</span>
                <CategoryCard
                  name="Sanitary Ware"
                  slug="sanitary-ware"
                  image="https://placehold.co/200x200/10b981/white.png?text=Sanitary"
                  productCount={42}
                />
              </div>
            </div>
          )}
        </ComponentSection>

        {/* CHECKOUT */}
        <ComponentSection title="💳 Checkout Components">
          {renderResponsive(
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              <div className="flex-1 w-full">
                <span className="text-xs text-gray-400 mb-4 block">Payment Method Selector</span>
                <PaymentMethodSelector selected={paymentMethod} onChange={setPaymentMethod} />
              </div>
              <div className="w-full lg:w-[380px] shrink-0">
                <span className="text-xs text-gray-400 mb-4 block">Order Summary</span>
                <OrderSummary subtotal={12450} shipping={120} codFee={40} discount={500} />
              </div>
            </div>
          )}
        </ComponentSection>

        {/* PRODUCT DETAILS */}
        <ComponentSection title="🛒 Product Detail Components">
          {renderResponsive(
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              <div className="w-full lg:w-1/2">
                <span className="text-xs text-gray-400 mb-4 block">Image Gallery</span>
                <ImageGallery
                  images={[
                    "https://placehold.co/600x600/10b981/white.png?text=Product+1",
                    "https://placehold.co/600x600/10b981/white.png?text=Product+2",
                    "https://placehold.co/600x600/10b981/white.png?text=Product+3",
                  ]}
                />
              </div>
            </div>
          )}
        </ComponentSection>

        {/* FORMS & ADDRESS */}
        <ComponentSection title="📋 Address & Forms">
          {renderResponsive(
            <div className="max-w-2xl">
              <AddressForm />
            </div>
          )}
        </ComponentSection>

        {/* ADMIN UI */}
        <ComponentSection title="⚙️ Admin UI Components">
          <div className="flex flex-col gap-12 px-4">
            <div>
              <span className="text-xs text-gray-400 mb-4 block">Admin Sidebar (Collapsible)</span>
              <div className="relative h-[600px] border border-gray-100 rounded-2xl overflow-hidden bg-gray-50">
                <AdminSidebar />
                <div className="pl-72 pt-4 pr-4">
                  <AdminHeader />
                  <div className="p-8">
                    <AdminBreadcrumb />
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 min-h-[300px]">
                      Sidebar Context Preview
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs text-gray-400 mb-4 block">Stats Cards</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard label="Revenue" value="৳45,200" trend="up" trendValue="+12%" icon={TrendingUp} />
                <StatsCard label="Orders" value="128" trend="down" trendValue="-2%" icon={ShoppingCart} />
                <StatsCard label="Alerts" value="05" trend="neutral" trendValue="Action Needed" icon={Clock} />
              </div>
            </div>

            <div>
              <span className="text-xs text-gray-400 mb-4 block">Order Status Badges</span>
              <div className="flex flex-wrap gap-4">
                <OrderStatusBadge status="pending" />
                <OrderStatusBadge status="approved" />
                <OrderStatusBadge status="shipping" />
                <OrderStatusBadge status="delivered" />
                <OrderStatusBadge status="cancelled" />
                <OrderStatusBadge status="returned" />
              </div>
            </div>

            <div>
              <span className="text-xs text-gray-400 mb-4 block">Order History Timeline</span>
              <div className="bg-white p-8 rounded-[40px] border border-gray-100 max-w-lg">
                <OrderTimeline 
                  events={[
                    { status: "pending", title: "Order Placed", description: "Customer placed the order.", timestamp: "10:30 AM", user: "System" },
                    { status: "approved", title: "Confirmed", description: "Order confirmed by staff.", timestamp: "11:15 AM", user: "Staff" },
                    { status: "note", title: "Staff Note", description: "Customer requested extra packaging.", timestamp: "11:20 AM", user: "Staff" }
                  ]} 
                />
              </div>
            </div>

            <div>
              <span className="text-xs text-gray-400 mb-4 block">Category Tree</span>
              <div className="bg-white p-8 rounded-[40px] border border-gray-100 max-w-2xl">
                <CategoryTree />
              </div>
            </div>
            
            <div>
              <span className="text-xs text-gray-400 mb-4 block">Orders Table Preview</span>
              <OrdersTable />
            </div>

            <div>
              <span className="text-xs text-gray-400 mb-4 block">Products Table Preview</span>
              <ProductsTable />
            </div>

            <div>
              <span className="text-xs text-gray-400 mb-4 block">Product Form (Multi-step)</span>
              <ProductForm />
            </div>
          </div>
        </ComponentSection>

        {/* LOADING STATES */}
        <ComponentSection title="⌛ Loading Skeletons">
          {renderResponsive(
            <div className="flex flex-col gap-10">
              <div className="w-full max-w-sm">
                <span className="text-xs text-gray-400 mb-2 block">Product Card Skeleton</span>
                <ProductCardSkeleton />
              </div>
              <div>
                <span className="text-xs text-gray-400 mb-2 block">List Item Skeleton</span>
                <ListItemSkeleton />
              </div>
            </div>
          )}
        </ComponentSection>

        {/* EMPTY STATES */}
        <ComponentSection title="📭 Empty States">
          {renderResponsive(
            <EmptyState
              icon={<ShoppingCart />}
              title="Your cart is empty"
              description="Looks like you haven't added anything to your cart yet. Explore our products and find something you love!"
              cta={<Button>Start Shopping</Button>}
            />
          )}
        </ComponentSection>

        <WhatsAppButton />

      </main>
    </div>
  )
}
