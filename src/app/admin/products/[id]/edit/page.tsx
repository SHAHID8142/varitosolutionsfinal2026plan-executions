/**
 * @file page.tsx
 * @path /admin/products/[id]/edit
 * @description Admin page for editing an existing product.
 *              Fetches product from GET /api/admin/products/[id] and pre-populates ProductForm.
 *
 * @owner    Gemini Design Agent / Claude Backend Agent
 * @updated  2026-05-24
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Edit3, AlertCircle, Loader2 } from "lucide-react"
import { ProductForm } from "@/components/admin/product-form"
import { Button } from "@/components/ui/button"
import { adminFetch } from "@/lib/admin-fetch"
import { toast } from "sonner"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface ProductDetail {
  id: string
  name: string
  nameBn: string | null
  sku: string | null
  slug: string
  categoryId: number | null
  price: number
  salePrice: number | null
  costPrice: number | null
  stock: number
  unit: string
  isActive: boolean
  images: string[]
  description: string | null
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

/** Admin product edit page — loads real product data before rendering the form. */
export default function EditProductPage() {
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = React.useState<ProductDetail | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [notFound, setNotFound] = React.useState(false)

  React.useEffect(() => {
    async function load() {
      const { data, error, status } = await adminFetch<ProductDetail>(`/api/admin/products/${productId}`)
      if (status === 404) { setNotFound(true); setLoading(false); return }
      if (error || !data) {
        toast.error(error ?? "Failed to load product")
        setLoading(false)
        return
      }
      setProduct(data)
      setLoading(false)
    }
    load()
  }, [productId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4 text-center">
        <AlertCircle className="size-12 text-red-400" />
        <h2 className="text-xl font-black text-gray-900">Product Not Found</h2>
        <Link href="/admin/products">
          <Button variant="outline" className="mt-2">Back to Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10">

      {/* Header Area */}
      <div className="flex flex-col gap-6">
        <Link
          href="/admin/products"
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors w-fit uppercase tracking-widest"
        >
          <ArrowLeft className="size-4" /> Back to Products
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                <Edit3 className="size-6" />
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">Edit Product</h1>
            </div>
            <p className="text-gray-500 font-medium">
              Editing: <span className="font-black text-gray-700">{product.name}</span>
            </p>
          </div>
        </div>
      </div>

      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* key forces remount with fresh defaultValues when product loads */}
        <ProductForm
          key={product.id}
          initialData={{
            id: product.id,
            name: product.name,
            sku: product.sku ?? undefined,
            price: product.price,
            costPrice: product.costPrice ?? undefined,
            stock: product.stock,
            images: product.images,
            status: product.isActive ? "active" : "inactive",
          }}
          isEditing
        />
      </section>

    </div>
  )
}
