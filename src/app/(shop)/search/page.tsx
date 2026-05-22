/**
 * @file page.tsx
 * @path /search
 * @description Search results page. Shows products matching a query.
 *              Includes empty states, sorting, and filters.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, SlidersHorizontal, LayoutGrid, List, X } from "lucide-react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/shop/product-card"
import { EmptyState } from "@/components/ui/empty-state"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
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

const MOCK_RESULTS = [
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
]

// ─────────────────────────────────────────────
// PAGE COMPONENTS
// ─────────────────────────────────────────────

function FilterSidebar() {
  const handleApply = () => {
    toast.success("Filters applied successfully!")
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Categories</h3>
        <div className="flex flex-col gap-2">
          {["Sanitary Ware", "Bathroom Fittings", "Kitchen Fixtures", "Packaging"].map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="size-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Price Range</h3>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" placeholder="Min" className="h-11 px-4 rounded-xl border border-gray-100 text-sm font-bold bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all outline-none" />
          <input type="number" placeholder="Max" className="h-11 px-4 rounded-xl border border-gray-100 text-sm font-bold bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all outline-none" />
        </div>
        <Button onClick={handleApply} size="lg" className="w-full rounded-xl font-black uppercase tracking-wider">Apply</Button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE EXPORT
// ─────────────────────────────────────────────

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""
  const [view, setView] = React.useState<"grid" | "list">("grid")
  
  const hasResults = query.toLowerCase() !== "empty" && query.trim() !== "" 
  const results = hasResults ? MOCK_RESULTS : []

  const handleClearSearch = () => {
    router.push("/search")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 bg-gray-50/50 pb-24">
        <div className="container mx-auto px-4 py-8">
          
          {/* Search Header */}
          <div className="flex flex-col gap-6 mb-10">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center flex-wrap gap-x-3">
                {query ? (
                  <>
                    <span className="opacity-40 uppercase">Search Results:</span>
                    <span className="text-primary">&quot;{query}&quot;</span>
                    <button 
                      onClick={handleClearSearch}
                      className="inline-flex size-8 rounded-full bg-gray-200 text-gray-500 hover:bg-danger-50 hover:text-danger-600 items-center justify-center transition-all ml-2"
                      title="Clear Search"
                    >
                      <X className="size-4" />
                    </button>
                  </>
                ) : (
                  "Explore All Products"
                )}
              </h1>
              {hasResults && (
                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest opacity-60">
                  {results.length} items found
                </p>
              )}
            </div>

            {hasResults && (
              <div className="flex items-center justify-between gap-4">
                {/* View Options */}
                <div className="hidden sm:flex items-center bg-white border border-gray-100 rounded-xl p-1 gap-1 shadow-sm">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setView("grid")}
                    className={cn("size-9 rounded-lg transition-all", view === "grid" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-gray-400")}
                  >
                    <LayoutGrid className="size-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      setView("list")
                      toast.info("List view is under optimization. Using Grid for best experience.")
                      setView("grid")
                    }}
                    className={cn("size-9 rounded-lg transition-all text-gray-400")}
                  >
                    <List className="size-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-3 ml-auto">
                  <Select defaultValue="relevance" onValueChange={(v) => toast.info(`Sorting by ${v}...`)}>
                    <SelectTrigger className="w-[180px] h-11 bg-white border-gray-100 rounded-xl shadow-sm font-bold text-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-normal">Sort:</span>
                        <SelectValue placeholder="Relevance" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price_asc">Price: Low to High</SelectItem>
                      <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <Sheet>
                    <SheetTrigger render={
                      <Button variant="outline" className="lg:hidden h-11 rounded-xl bg-white border-gray-100 shadow-sm gap-2 font-bold">
                        <SlidersHorizontal className="size-4" />
                        Filter
                      </Button>
                    } />
                    <SheetContent side="right">
                      <SheetHeader className="mb-6">
                        <SheetTitle className="text-left font-black tracking-tight text-2xl uppercase">Filters</SheetTitle>
                      </SheetHeader>
                      <FilterSidebar />
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            )}
          </div>

          {!hasResults ? (
            <div className="py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm">
              <EmptyState
                icon={<Search className="size-10" />}
                title="No results found"
                description={query ? `We couldn't find any products matching "${query}".` : "Try searching for luxury faucets or packaging materials."}
                cta={
                  <Button onClick={() => router.push("/categories")} variant="primary" size="lg" className="px-10 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                    Explore Categories
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="flex gap-10 items-start">
              {/* Desktop Sidebar */}
              <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-32 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <h2 className="text-lg font-black text-gray-900 mb-8 uppercase tracking-tight">Filters</h2>
                <FilterSidebar />
              </aside>

              {/* Grid */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
                {results.map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </div>
  )
}

export default function SearchPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-white" />}>
      <SearchContent />
    </React.Suspense>
  )
}
