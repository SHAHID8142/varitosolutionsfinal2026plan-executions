/**
 * @file category-content.tsx
 * @path /category/[slug]
 * @description Category listing page — wired to GET /api/products?categorySlug=[slug].
 *              Includes sidebar filters (desktop) and sheet filters (mobile).
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { SlidersHorizontal, LayoutGrid, List, Package } from "lucide-react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/shop/product-card"
import { ProductCardSkeleton } from "@/components/ui/loading-skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { CategorySchema } from "@/components/shop/category-schema"
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
// TYPES
// ─────────────────────────────────────────────

interface ApiProduct {
  id: string
  slug: string
  name: string
  nameBn: string
  price: number
  salePrice: number | null
  images: string[]
  stock: number
  isNew: boolean
}

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

export default function CategoryContent() {
  const params = useParams()
  const slug = params.slug as string
  const [products, setProducts] = React.useState<ApiProduct[]>([])
  const [total, setTotal] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [sort, setSort] = React.useState("new")

  const categoryName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  React.useEffect(() => {
    if (!slug) return
    async function load() {
      try {
        const r = await fetch(`/api/products?categorySlug=${encodeURIComponent(slug)}&sort=${sort}&limit=24`)
        const json = await r.json()
        if (json.data) {
          setProducts(json.data)
          setTotal(json.total ?? json.data.length)
        }
      } catch {
        // keep previous state on error
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug, sort])

  return (
    <div className="flex flex-col min-h-screen">
      <CategorySchema
        name={categoryName}
        description={`Shop premium ${categoryName.toLowerCase()} in Bangladesh at Varito Solutions.`}
        url={`https://varitosolutions.com/category/${slug}`}
      />
      <Header />

      <main className="flex-1 bg-gray-50/50">
        <div className="container mx-auto px-4 py-8">

          {/* Breadcrumb & Title */}
          <div className="flex flex-col gap-6 mb-8">
            <Breadcrumb
              items={[
                { label: "Categories", href: "/categories" },
                { label: categoryName },
              ]}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                  {categoryName}
                </h1>
                <p className="text-sm text-gray-500 font-medium">
                  {loading ? "Loading..." : `${products.length} of ${total} products`}
                </p>
              </div>

              {/* Sorting & View Options */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center bg-white border border-gray-100 rounded-xl p-1 gap-1">
                  <Button variant="ghost" size="icon" aria-label="Grid view" className="size-9 bg-gray-50 text-primary rounded-lg shadow-sm">
                    <LayoutGrid className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="List view" className="size-9 text-gray-400 rounded-lg">
                    <List className="size-4" />
                  </Button>
                </div>

                <Select defaultValue="new" onValueChange={(v) => { if (v) setSort(v) }}>
                  <SelectTrigger className="w-[180px] h-11 bg-white border-gray-100 rounded-xl shadow-sm font-bold text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 font-normal">Sort:</span>
                      <SelectValue placeholder="Sort By" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Newest First</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
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
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                  {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
              ) : products.length === 0 ? (
                <div className="py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm">
                  <EmptyState
                    icon={<Package className="size-10" />}
                    title="No products in this category"
                    description="We haven't added products here yet. Check back soon!"
                  />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-8">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        nameBn={product.nameBn}
                        slug={product.slug}
                        image={product.images[0] ?? ""}
                        price={product.price}
                        salePrice={product.salePrice ?? undefined}
                        stock={product.stock}
                        isNew={product.isNew}
                      />
                    ))}
                  </div>

                  {products.length < total && (
                    <div className="flex flex-col items-center gap-4 py-12">
                      <p className="text-sm text-gray-400 font-medium">
                        You&apos;ve viewed {products.length} of {total} products
                      </p>
                      <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="bg-primary h-full transition-all" style={{ width: `${Math.round((products.length / total) * 100)}%` }} />
                      </div>
                    </div>
                  )}
                </>
              )}
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
