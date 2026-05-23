/**
 * @file home-content.tsx
 * @path /
 * @description Homepage client component. Fetches live banners, categories,
 *              products, and flash deal from the API on mount.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
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
import { FlashDealCountdown } from "@/components/admin/flash-deal-countdown"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { OrganizationSchema } from "@/components/shop/organization-schema"
import { toast } from "sonner"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface ApiBanner {
  id: number
  title: string | null
  subtitle: string | null
  image: string
  ctaText: string | null
  ctaUrl: string | null
}

interface ApiCategory {
  id: number
  name: string
  slug: string
  image: string | null
  _count?: { products: number }
}

interface ApiProduct {
  id: number
  name: string
  slug: string
  images: string[]
  price: string
  salePrice: string | null
  stock: number
  createdAt: string
}

interface ApiFlashDeal {
  id: number
  flashPrice: string
  endsAt: string
  maxQty: number | null
  soldQty: number
  product: {
    name: string
    slug: string
    images: string[]
    price: string
  }
}

// ─────────────────────────────────────────────
// HERO BANNER SECTION
// ─────────────────────────────────────────────

/**
 * Hero section — shows first active hero banner from the API.
 * Falls back to a static default if the API has no banners yet.
 */
function Hero({ banner }: { banner: ApiBanner | null }) {
  const bgImage = banner?.image ?? "https://placehold.co/800x600/10b981/white.png?text=Premium+Showcase"
  const title = banner?.title ?? "Premium Sanitary Ware & Packaging Solutions"
  const ctaUrl = banner?.ctaUrl ?? "/products"
  const ctaText = banner?.ctaText ?? "Shop Now"

  return (
    <section className="relative overflow-hidden bg-primary/5 py-16 lg:py-24">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 size-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 size-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="container relative mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        <div className="flex flex-col gap-8 max-w-xl">
          <Badge variant="verified" className="w-fit bg-white text-primary border-primary/20">
            Trusted by 5,000+ Customers
          </Badge>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 leading-tight uppercase">
            {banner ? title : <>Premium <span className="text-primary">Sanitary Ware</span> &amp; Packaging Solutions</>}
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed">
            {banner?.subtitle ?? "Upgrade your home with luxury bathroom fittings or secure your business shipments with our high-quality packaging materials. Quality you can trust, delivered to your door."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={ctaUrl} className="flex-1 sm:flex-none">
              <Button size="lg" className="w-full px-10 py-7 text-lg shadow-xl shadow-primary/20 rounded-2xl">
                {ctaText} <ArrowRight className="ml-2 size-5" />
              </Button>
            </Link>
            <Link href="/categories" className="flex-1 sm:flex-none">
              <Button variant="secondary" size="lg" className="w-full px-10 py-7 text-lg bg-white rounded-2xl">
                View Categories
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-8 mt-4 pt-8 border-t border-primary/20">
            <div className="flex items-center gap-2">
              <Truck className="size-5 text-primary" />
              <span className="text-sm font-bold text-gray-700">Free Shipping*</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              <span className="text-sm font-bold text-gray-700">Verified Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="size-5 text-primary" />
              <span className="text-sm font-bold text-gray-700">Same Day Dispatch</span>
            </div>
          </div>
        </div>

        <div className="relative aspect-square lg:aspect-auto lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src={bgImage}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// FLASH DEAL SECTION
// ─────────────────────────────────────────────

/**
 * Flash deal strip — only rendered when there is an active deal.
 */
function FlashDealStrip({ deal }: { deal: ApiFlashDeal }) {
  const thumbnail = deal.product.images[0] ?? "https://placehold.co/200x200/10b981/white.png?text=Deal"
  const originalPrice = Number(deal.product.price)
  const flashPrice = Number(deal.flashPrice)
  const discountPct = Math.round((1 - flashPrice / originalPrice) * 100)
  const progress = deal.maxQty ? Math.round((deal.soldQty / deal.maxQty) * 100) : 0

  return (
    <section className="py-6 bg-accent/5 border-y border-accent/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white rounded-3xl shadow-sm border border-accent/20">

          {/* Label */}
          <div className="flex items-center gap-2 shrink-0">
            <Zap className="size-5 text-accent fill-accent" />
            <span className="text-sm font-black text-accent uppercase tracking-widest">Flash Deal</span>
          </div>

          {/* Product */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="relative size-12 rounded-xl overflow-hidden shrink-0 border border-gray-100">
              <Image src={thumbnail} alt={deal.product.name} fill className="object-cover" sizes="48px" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-black text-gray-900 truncate">{deal.product.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-accent">৳{flashPrice.toLocaleString()}</span>
                <span className="text-xs text-gray-400 line-through">৳{originalPrice.toLocaleString()}</span>
                <Badge className="bg-accent text-white border-none text-[9px] font-black px-1.5">{discountPct}% OFF</Badge>
              </div>
            </div>
          </div>

          {/* Progress */}
          {deal.maxQty && (
            <div className="flex flex-col gap-1 w-32 shrink-0">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-[10px] font-bold text-gray-500">{deal.soldQty}/{deal.maxQty} sold</span>
            </div>
          )}

          {/* Countdown */}
          <FlashDealCountdown targetDate={deal.endsAt} className="shrink-0" />

          {/* CTA */}
          <Link href={`/products/${deal.product.slug}`} className="shrink-0">
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-white font-black rounded-xl px-6 h-11 shadow-lg shadow-accent/20">
              Grab Deal
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE EXPORT
// ─────────────────────────────────────────────

/** Homepage — fetches banners, categories, products, and flash deal on mount. */
export default function HomeContent() {
  const [heroBanner, setHeroBanner] = React.useState<ApiBanner | null>(null)
  const [flashDeal, setFlashDeal] = React.useState<ApiFlashDeal | null>(null)
  const [categories, setCategories] = React.useState<ApiCategory[]>([])
  const [products, setProducts] = React.useState<ApiProduct[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadHomeData() {
      try {
        const [bannersRes, flashRes, catsRes, prodsRes] = await Promise.allSettled([
          fetch("/api/banners?position=hero").then(r => r.json()),
          fetch("/api/flash-deal").then(r => r.json()),
          fetch("/api/categories?featured=true&limit=6").then(r => r.json()),
          fetch("/api/products?sort=newest&limit=8").then(r => r.json()),
        ])

        if (bannersRes.status === "fulfilled" && bannersRes.value.data?.length) {
          setHeroBanner(bannersRes.value.data[0])
        }
        if (flashRes.status === "fulfilled" && flashRes.value.data) {
          setFlashDeal(flashRes.value.data)
        }
        if (catsRes.status === "fulfilled" && catsRes.value.data?.length) {
          setCategories(catsRes.value.data)
        }
        if (prodsRes.status === "fulfilled" && prodsRes.value.data?.length) {
          setProducts(prodsRes.value.data)
        }
      } catch {
        // API unavailable — static fallback data shows
      } finally {
        setLoading(false)
      }
    }
    loadHomeData()
  }, [])

  const handleWholesaleQuote = () => {
    toast.info("Opening wholesale request form...")
    window.location.href = "/contact"
  }

  // ── Fallback static data (shown while loading or if API returns nothing) ──
  const displayCategories: ApiCategory[] = categories.length ? categories : [
    { id: 1, name: "Sanitary Ware", slug: "sanitary-ware", image: "https://placehold.co/200x200/10b981/white.png?text=Sanitary" },
    { id: 2, name: "Bathroom Fittings", slug: "bath-fittings", image: "https://placehold.co/200x200/10b981/white.png?text=Fittings" },
    { id: 3, name: "Kitchen Fixtures", slug: "kitchen", image: "https://placehold.co/200x200/10b981/white.png?text=Kitchen" },
    { id: 4, name: "Packaging Tapes", slug: "packaging-tape", image: "https://placehold.co/200x200/10b981/white.png?text=Tape" },
    { id: 5, name: "Bubble Wrap", slug: "bubble-wrap", image: "https://placehold.co/200x200/10b981/white.png?text=Bubble" },
    { id: 6, name: "Carton Boxes", slug: "cartons", image: "https://placehold.co/200x200/10b981/white.png?text=Cartons" },
  ]

  const displayProducts: ApiProduct[] = products.length ? products : [
    { id: 1, name: "Premium Ceramic Wall Tile 30x60", slug: "premium-ceramic-wall-tile-30x60", images: ["https://placehold.co/400x400/10b981/white.png?text=Tile"], price: "1200", salePrice: "999", stock: 500, createdAt: new Date().toISOString() },
    { id: 2, name: "Luxury Shower Panel Set", slug: "luxury-shower-panel-set", images: ["https://placehold.co/400x400/10b981/white.png?text=Shower"], price: "25000", salePrice: "22000", stock: 25, createdAt: new Date().toISOString() },
    { id: 3, name: "Budget Bathroom Faucet", slug: "budget-bathroom-faucet", images: ["https://placehold.co/400x400/10b981/white.png?text=Faucet"], price: "850", salePrice: "750", stock: 150, createdAt: new Date().toISOString() },
    { id: 4, name: "Corrugated Box 30x20x15 cm", slug: "corrugated-box-30x20x15", images: ["https://placehold.co/400x400/10b981/white.png?text=Box"], price: "45", salePrice: null, stock: 5000, createdAt: new Date().toISOString() },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <OrganizationSchema />
      <Header />

      <main className="flex-1">
        <Hero banner={heroBanner} />

        {/* Flash Deal Strip — only renders when a live deal exists */}
        {flashDeal && <FlashDealStrip deal={flashDeal} />}

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

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, i) => <LoadingSkeleton key={i} className="h-32 rounded-2xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                {displayCategories.map((cat) => (
                  <CategoryCard
                    key={cat.slug}
                    name={cat.name}
                    slug={cat.slug}
                    image={cat.image ?? "https://placehold.co/200x200/10b981/white.png?text=" + cat.name}
                    productCount={cat._count?.products}
                  />
                ))}
              </div>
            )}

            <Link href="/categories" className="flex sm:hidden items-center justify-center gap-1 text-primary font-bold mt-8 py-4 border-2 border-primary/10 rounded-xl uppercase tracking-widest text-xs">
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

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                {Array.from({ length: 4 }).map((_, i) => <LoadingSkeleton key={i} className="h-72 rounded-2xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                {displayProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={String(product.id)}
                    name={product.name}
                    slug={product.slug}
                    image={product.images[0] ?? "https://placehold.co/400x400/10b981/white.png?text=Product"}
                    price={Number(product.price)}
                    salePrice={product.salePrice ? Number(product.salePrice) : undefined}
                    stock={product.stock}
                    isNew={true}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Wholesale CTA */}
        <section className="py-20 bg-primary text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 opacity-10 -translate-y-1/2 translate-x-1/4">
            <Package size={300} strokeWidth={1} />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl flex flex-col gap-8">
              <h2 className="text-3xl md:text-5xl font-black leading-tight uppercase tracking-tight">
                Bulk Orders for Construction or Business?
              </h2>
              <p className="text-white/90 text-lg md:text-xl font-medium leading-relaxed">
                We offer special wholesale pricing for developers, contractors, and retail shop owners.
                Get direct delivery with the most competitive rates in Bangladesh.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <Button onClick={handleWholesaleQuote} size="lg" className="bg-white text-primary hover:bg-primary/5 font-black px-10 h-16 rounded-2xl shadow-xl shadow-black/10 uppercase tracking-widest text-sm">
                  Get Wholesale Quote
                </Button>
                <a href="https://wa.me/8801814214220" target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
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
