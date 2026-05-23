/**
 * @file page.tsx
 * @path /
 * @description The main landing page for Varito Solutions.
 *              Showcases hero banner, category grid, and featured products.
 *              Assembled from premium validated components.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ArrowRight, Truck, ShieldCheck, Zap, Package } from "lucide-react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/shop/product-card"
import { CategoryCard } from "@/components/shop/category-card"
import { Badge } from "@/components/ui/badge"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { WhatsAppIcon } from "@/components/ui/icons/whatsapp"
import { toast } from "sonner"
import { OrganizationSchema } from "@/components/shop/organization-schema"

// ─────────────────────────────────────────────
// SAMPLE DATA
// ─────────────────────────────────────────────

const FEATURED_CATEGORIES = [
  { name: "Sanitary Ware", slug: "sanitary-ware", image: "https://placehold.co/200x200/10b981/white.png?text=Sanitary", count: 42 },
  { name: "Bathroom Fittings", slug: "bath-fittings", image: "https://placehold.co/200x200/10b981/white.png?text=Fittings", count: 128 },
  { name: "Kitchen Fixtures", slug: "kitchen", image: "https://placehold.co/200x200/10b981/white.png?text=Kitchen", count: 64 },
  { name: "Packaging Tapes", slug: "packaging-tape", image: "https://placehold.co/200x200/10b981/white.png?text=Tape", count: 32 },
  { name: "Bubble Wrap", slug: "bubble-wrap", image: "https://placehold.co/200x200/10b981/white.png?text=Bubble", count: 18 },
  { name: "Carton Boxes", slug: "cartons", image: "https://placehold.co/200x200/10b981/white.png?text=Cartons", count: 56 },
]

const NEW_ARRIVALS = [
  {
    id: "1",
    name: "Luxury Emerald Gold Faucet",
    slug: "luxury-emerald-gold-faucet",
    image: "https://placehold.co/400x400/10b981/white.png?text=Faucet",
    price: 4500,
    salePrice: 3800,
    stock: 12,
    isNew: true
  },
  {
    id: "2",
    name: "Premium Kitchen Mixer Tap",
    slug: "premium-kitchen-mixer",
    image: "https://placehold.co/400x400/10b981/white.png?text=Mixer",
    price: 3200,
    stock: 45
  },
  {
    id: "3",
    name: "Heavy Duty Packaging Tape (6 Pack)",
    slug: "packaging-tape-6-pack",
    image: "https://placehold.co/400x400/10b981/white.png?text=Tape+Pack",
    price: 850,
    salePrice: 720,
    stock: 150,
    isNew: true
  },
  {
    id: "4",
    name: "Anti-Rust Bathroom Shower Set",
    slug: "bathroom-shower-set",
    image: "https://placehold.co/400x400/10b981/white.png?text=Shower",
    price: 5800,
    salePrice: 5200,
    stock: 8
  },
]

// ─────────────────────────────────────────────
// PAGE COMPONENTS
// ─────────────────────────────────────────────

/**
 * Hero Section with main offer and CTA.
 */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-emerald-50 py-16 lg:py-24">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 size-96 rounded-full bg-emerald-100/50 blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 size-96 rounded-full bg-accent-100/30 blur-3xl" />

      <div className="container relative mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        <div className="flex flex-col gap-8 max-w-xl">
          <Badge variant="verified" className="w-fit bg-white text-emerald-600 border-emerald-100">
            Trusted by 5,000+ Customers
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 leading-tight uppercase">
            Premium <span className="text-primary">Sanitary Ware</span> & Packaging Solutions
          </h1>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            Upgrade your home with luxury bathroom fittings or secure your business shipments with 
            our high-quality packaging materials. Quality you can trust, delivered to your door.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/products" className="flex-1 sm:flex-none">
              <Button size="lg" className="w-full px-10 py-7 text-lg shadow-xl shadow-emerald-500/20 rounded-2xl">
                Shop Now <ArrowRight className="ml-2 size-5" />
              </Button>
            </Link>
            <Link href="/categories" className="flex-1 sm:flex-none">
              <Button variant="secondary" size="lg" className="w-full px-10 py-7 text-lg bg-white rounded-2xl">
                View Categories
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center gap-8 mt-4 pt-8 border-t border-emerald-100">
            <div className="flex items-center gap-2">
              <Truck className="size-5 text-emerald-500" />
              <span className="text-sm font-bold text-gray-700">Free Shipping*</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-emerald-500" />
              <span className="text-sm font-bold text-gray-700">Verified Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="size-5 text-emerald-500" />
              <span className="text-sm font-bold text-gray-700">Same Day Dispatch</span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-square lg:aspect-auto lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="https://placehold.co/800x600/10b981/white.png?text=Premium+Showcase"
            alt="Varito Solutions Showcase"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE EXPORT
// ─────────────────────────────────────────────

export default function HomeContent() {
  const handleWholesaleQuote = () => {
    toast.info("Opening wholesale request form...")
    window.location.href = "/contact"
  }

  return (
    <div className="flex flex-col min-h-screen">
      <OrganizationSchema />
      <Header />
      
      <main className="flex-1">
        <Hero />

        {/* Categories Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-10">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Shop by Category</h2>
                <p className="text-gray-500 font-medium">Explore our wide range of premium products</p>
              </div>
              <Link href="/categories" className="hidden sm:flex items-center gap-1 text-primary font-bold hover:underline uppercase tracking-wider text-sm">
                View All <ChevronRight className="size-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {FEATURED_CATEGORIES.map((cat) => (
                <CategoryCard
                  key={cat.slug}
                  name={cat.name}
                  slug={cat.slug}
                  image={cat.image}
                  productCount={cat.count}
                />
              ))}
            </div>
            
            <Link href="/categories" className="flex sm:hidden items-center justify-center gap-1 text-primary font-bold mt-8 py-4 border-2 border-primary-100 rounded-xl uppercase tracking-widest text-xs">
              View All Categories <ChevronRight className="size-4" />
            </Link>
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-10">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">New Arrivals</h2>
                <p className="text-gray-500 font-medium">Fresh stock just landed in our store</p>
              </div>
              <Link href="/products" className="hidden sm:flex items-center gap-1 text-primary font-bold hover:underline uppercase tracking-wider text-sm">
                Shop All <ChevronRight className="size-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {NEW_ARRIVALS.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Trust Banner */}
        <section className="py-20 bg-emerald-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 opacity-10 -translate-y-1/2 translate-x-1/4">
            <Package size={300} strokeWidth={1} />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl flex flex-col gap-8">
              <h2 className="text-3xl md:text-5xl font-black leading-tight uppercase tracking-tight">
                Bulk Orders for Construction or Business?
              </h2>
              <p className="text-emerald-50 text-lg md:text-xl font-medium opacity-90 leading-relaxed">
                We offer special wholesale pricing for developers, contractors, and retail shop owners. 
                Get direct delivery with the most competitive rates in Bangladesh.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <Button onClick={handleWholesaleQuote} size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 font-black px-10 h-16 rounded-2xl shadow-xl shadow-black/10 uppercase tracking-widest text-sm">
                  Get Wholesale Quote
                </Button>
                <a 
                  href="https://wa.me/8801814214220" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none"
                >
                  <Button variant="outline" size="lg" className="w-full border-white text-white hover:bg-white/10 font-black px-10 h-16 rounded-2xl gap-3 bg-white/5 uppercase tracking-widest text-sm">
                    <WhatsAppIcon className="size-6 fill-[#25D366]" /> Chat on WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </div>
  )
}
