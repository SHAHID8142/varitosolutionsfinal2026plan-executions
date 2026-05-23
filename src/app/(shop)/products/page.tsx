/**
 * @file page.tsx
 * @path /products
 * @description All products listing page — wired to GET /api/products.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

"use client"

import * as React from "react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { ProductCard } from "@/components/shop/product-card"
import { ProductCardSkeleton } from "@/components/ui/loading-skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { Package } from "lucide-react"

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

export default function AllProductsPage() {
  const [products, setProducts] = React.useState<ApiProduct[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch("/api/products?limit=48&sort=new")
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setProducts(json.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: "All Products" }]} className="mb-8" />
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase mb-10">All Products</h1>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm">
            <EmptyState
              icon={<Package className="size-10" />}
              title="No products yet"
              description="Check back soon — we're adding products daily."
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                slug={p.slug}
                name={p.name}
                nameBn={p.nameBn}
                image={p.images[0] ?? ""}
                price={p.price}
                salePrice={p.salePrice ?? undefined}
                stock={p.stock}
                isNew={p.isNew}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </div>
  )
}
