/**
 * @file page.tsx
 * @path /category/[slug]
 * @description Category listing page. Shows products filtered by category.
 *              Includes sidebar filters (desktop) and sheet filters (mobile).
 *              Uses premium Emerald theme and Jakarta typography.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { SlidersHorizontal, LayoutGrid, List, X } from "lucide-react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/shop/product-card"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

// ─────────────────────────────────────────────
// SAMPLE DATA
// ─────────────────────────────────────────────

const PRODUCTS = [
  {
    id: "1",
    name: "Luxury Emerald Gold Faucet",
    slug: "luxury-emerald-gold-faucet",
    image: "https://placehold.co/400x400/10b981/white.png?text=Faucet+1",
    price: 4500,
    salePrice: 3800,
    stock: 12,
    isNew: true
  },
  {
    id: "2",
    name: "Classic Silver Basin Mixer",
    slug: "classic-silver-mixer",
    image: "https://placehold.co/400x400/10b981/white.png?text=Faucet+2",
    price: 2800,
    stock: 25
  },
  {
    id: "3",
    name: "Modern Matte Black Tap",
    slug: "matte-black-tap",
    image: "https://placehold.co/400x400/10b981/white.png?text=Faucet+3",
    price: 3500,
    salePrice: 2999,
    stock: 15,
    isNew: true
  },
  {
    id: "4",
    name: "Eco-Friendly Water Saver Faucet",
    slug: "eco-faucet",
    image: "https://placehold.co/400x400/10b981/white.png?text=Faucet+4",
    price: 1800,
    stock: 100
  },
  {
    id: "5",
    name: "Wall Mounted Luxury Tap",
    slug: "wall-mounted-tap",
    image: "https://placehold.co/400x400/10b981/white.png?text=Faucet+5",
    price: 5200,
    salePrice: 4500,
    stock: 5
  },
  {
    id: "6",
    name: "Automatic Sensor Faucet",
    slug: "sensor-faucet",
    image: "https://placehold.co/400x400/10b981/white.png?text=Faucet+6",
    price: 8500,
    stock: 10
  },
]

const CATEGORIES = [
  { name: "All Faucets", count: 150 },
  { name: "Kitchen Taps", count: 45 },
  { name: "Basin Mixers", count: 62 },
  { name: "Shower Heads", count: 38 },
  { name: "Bath Spouts", count: 12 },
]

// ─────────────────────────────────────────────
// PAGE COMPONENTS
// ─────────────────────────────────────────────

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 py-6 border-b border-gray-100 last:border-0">
      <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">{title}</h3>
      <div className="flex flex-col gap-2">
        {children}
      </div>
    </div>
  )
}

function SidebarFilters() {
  return (
    <div className="flex flex-col">
      <FilterSection title="Sub-Categories">
        {CATEGORIES.map((cat) => (
          <button key={cat.name} className="flex items-center justify-between text-sm text-gray-600 hover:text-primary transition-colors group">
            <span>{cat.name}</span>
            <span className="text-[10px] font-bold bg-gray-50 px-2 py-0.5 rounded-full text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
              {cat.count}
            </span>
          </button>
        ))}
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="flex flex-col gap-4 mt-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Min</span>
              <input type="number" placeholder="৳0" className="w-full h-10 px-3 rounded-lg border border-gray-100 text-sm focus:border-primary outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Max</span>
              <input type="number" placeholder="৳10k+" className="w-full h-10 px-3 rounded-lg border border-gray-100 text-sm focus:border-primary outline-none" />
            </div>
          </div>
          <Button size="sm" className="w-full">Apply Price</Button>
        </div>
      </FilterSection>

      <FilterSection title="Availability">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input type="checkbox" className="size-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">In Stock Only</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input type="checkbox" className="size-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">On Sale</span>
        </label>
      </FilterSection>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE EXPORT
// ─────────────────────────────────────────────

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  
  // Format slug for display
  const categoryName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 bg-gray-50/50">
        <div className="container mx-auto px-4 py-8">
          
          {/* Breadcrumb & Title */}
          <div className="flex flex-col gap-6 mb-8">
            <Breadcrumb
              items={[
                { label: "Categories", href: "/category" },
                { label: categoryName },
              ]}
            />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                  {categoryName}
                </h1>
                <p className="text-sm text-gray-500 font-medium">
                  Showing 1–{PRODUCTS.length} of 150 products
                </p>
              </div>

              {/* Sorting & View Options */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center bg-white border border-gray-100 rounded-xl p-1 gap-1">
                  <Button variant="ghost" size="icon" className="size-9 bg-gray-50 text-primary rounded-lg shadow-sm">
                    <LayoutGrid className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-9 text-gray-400 rounded-lg">
                    <List className="size-4" />
                  </Button>
                </div>
                
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px] h-11 bg-white border-gray-100 rounded-xl shadow-sm font-bold text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 font-normal">Sort:</span>
                      <SelectValue placeholder="Sort By" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>

                {/* Mobile Filter Trigger */}
                <Sheet>
                  <SheetTrigger 
                    render={
                      <Button variant="outline" className="lg:hidden h-11 rounded-xl bg-white border-gray-100 shadow-sm gap-2">
                        <SlidersHorizontal className="size-4" />
                        Filter
                      </Button>
                    }
                  />
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <SheetHeader className="mb-6">
                      <SheetTitle className="text-left font-black tracking-tight text-2xl">Filters</SheetTitle>
                    </SheetHeader>
                    <div className="overflow-y-auto h-[calc(100vh-120px)] pr-2 -mr-2">
                      <SidebarFilters />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
                      <Button className="w-full py-6 text-lg shadow-lg shadow-emerald-500/20">
                        Show {PRODUCTS.length} Results
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>

          <div className="flex gap-10 items-start">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-32 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-black text-gray-900">Filters</h2>
                <button className="text-[10px] font-bold text-primary uppercase tracking-wider hover:underline">Reset</button>
              </div>
              <SidebarFilters />
            </aside>

            {/* Product Grid */}
            <div className="flex-1 flex flex-col gap-10">
              {/* Active Filters (Chips) */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="h-8 gap-1.5 pl-3 pr-2 bg-white border-gray-100 text-gray-700 normal-case">
                  Price: Under ৳5000 <X className="size-3 text-gray-400 hover:text-danger-500 cursor-pointer" />
                </Badge>
                <Badge variant="secondary" className="h-8 gap-1.5 pl-3 pr-2 bg-white border-gray-100 text-gray-700 normal-case">
                  Brand: Luxury <X className="size-3 text-gray-400 hover:text-danger-500 cursor-pointer" />
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-8">
                {PRODUCTS.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    slug={product.slug}
                    image={product.image}
                    price={product.price}
                    salePrice={product.salePrice}
                    stock={product.stock}
                    isNew={product.isNew}
                  />
                ))}
              </div>

              {/* Load More */}
              <div className="flex flex-col items-center gap-4 py-12">
                <p className="text-sm text-gray-400 font-medium">You&apos;ve viewed 6 of 150 products</p>
                <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[4%]" />
                </div>
                <Button variant="outline" size="lg" className="mt-4 px-12 border-primary/20 text-primary hover:bg-primary-50 font-bold bg-white">
                  Load More Products
                </Button>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </div>
  )
}
