/**
 * @file page.tsx
 * @path /product/[slug]
 * @description Product detail page — wired to GET /api/products/[slug].
 *              Includes image gallery, pricing, description, trust signals,
 *              and related products from the same category.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ShoppingCart,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Share2,
  Heart,
  MessageSquare,
  AlertCircle,
  LucideIcon
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/shop/product-card"
import { ProductCardSkeleton } from "@/components/ui/loading-skeleton"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { Badge } from "@/components/ui/badge"
import { ImageGallery } from "@/components/shop/image-gallery"
import { RatingStars } from "@/components/ui/rating-stars"
import { PriceTag } from "@/components/ui/price-tag"
import { QuantitySelector } from "@/components/ui/quantity-selector"
import { Separator } from "@/components/ui/separator"
import { ProductSchema } from "@/components/shop/product-schema"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { usePostHog } from "posthog-js/react"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface ApiProduct {
  id: string
  slug: string
  name: string
  nameBn: string
  description: string
  descriptionBn: string
  price: number
  salePrice: number | null
  discountPercent: number | null
  images: string[]
  stock: number
  unit: string
  minOrderQty: number
  sku: string
  category: {
    id: string
    name: string
    slug: string
  }
}

interface RelatedProduct {
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

interface TrustBadgeProps {
  icon: LucideIcon
  title: string
  description: string
}

function TrustBadge({ icon: Icon, title, description }: TrustBadgeProps) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
      <div className="size-10 rounded-lg bg-white flex items-center justify-center text-primary shrink-0 shadow-sm">
        <Icon className="size-6" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-black text-gray-900">{title}</span>
        <span className="text-xs text-gray-500 font-medium">{description}</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE EXPORT
// ─────────────────────────────────────────────

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const posthog = usePostHog()

  const [product, setProduct] = React.useState<ApiProduct | null>(null)
  const [related, setRelated] = React.useState<RelatedProduct[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [quantity, setQuantity] = React.useState(1)
  const [activeTab, setActiveTab] = React.useState<"description" | "specs" | "reviews">("description")
  const [isWishlisted, setIsWishlisted] = React.useState(false)

  React.useEffect(() => {
    if (!slug) return
    async function load() {
      try {
        const r = await fetch(`/api/products/${slug}`)
        if (!r.ok) throw new Error("not found")
        const json = await r.json()
        const p: ApiProduct = json.data
        setProduct(p)
        setQuantity(p.minOrderQty ?? 1)
        if (posthog) {
          posthog.capture("product_viewed", {
            product_id: p.id,
            product_name: p.name,
            product_slug: p.slug,
            category: p.category.name,
            price: p.salePrice ?? p.price,
          })
        }
        const relRes = await fetch(`/api/products?categorySlug=${p.category.slug}&limit=5`)
        const relJson = await relRes.json()
        if (relJson?.data) {
          setRelated(relJson.data.filter((item: RelatedProduct) => item.slug !== slug).slice(0, 4))
        }
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug, posthog])

  const handleAddToCart = () => {
    if (!product) return
    posthog?.capture("product_added_to_cart", {
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      category: product.category.name,
      price: product.salePrice ?? product.price,
      quantity,
    })
    toast.success(`${product.name} (${quantity} ${product.unit}${quantity > 1 ? "s" : ""}) added to cart!`)
  }

  const handleOrderNow = () => {
    toast.info("Redirecting to checkout...")
    window.location.href = "/checkout"
  }

  const toggleWishlist = () => {
    setIsWishlisted((prev) => {
      if (!prev) toast.success("Added to wishlist!")
      else toast.info("Removed from wishlist")
      return !prev
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product?.name ?? "", url: window.location.href }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {product && (
        <ProductSchema
          name={product.name}
          description={product.description}
          image={product.images[0] ?? ""}
          sku={product.sku}
          price={product.salePrice ?? product.price}
        />
      )}
      <Header />

      <main className="flex-1 bg-white">
        <div className="container mx-auto px-4 py-8">

          {loading ? (
            <div className="flex flex-col gap-8">
              <ProductCardSkeleton />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            </div>
          ) : error || !product ? (
            <div className="flex flex-col items-center gap-6 py-20 text-center">
              <AlertCircle className="size-16 text-red-400" />
              <h1 className="text-2xl font-black text-gray-900">Product Not Found</h1>
              <p className="text-gray-500">This product may have been removed or is unavailable.</p>
              <Link href="/products">
                <Button variant="primary" size="lg" className="rounded-xl font-black">Browse All Products</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Breadcrumb */}
              <Breadcrumb
                items={[
                  { label: "Categories", href: "/categories" },
                  { label: product.category.name, href: `/category/${product.category.slug}` },
                  { label: product.name },
                ]}
                className="mb-8"
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* LEFT: Image Gallery */}
                <div className="lg:col-span-6 xl:col-span-7">
                  <ImageGallery images={product.images.length ? product.images : [""]} />
                </div>

                {/* RIGHT: Product Info */}
                <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-8">

                  {/* Title & Reviews */}
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-2">
                      {product.discountPercent && (
                        <Badge variant="default" className="bg-accent">{product.discountPercent}% OFF</Badge>
                      )}
                      {product.stock > 0 ? (
                        <Badge variant="verified" className="bg-primary/5 text-primary border-primary/20 uppercase">In Stock</Badge>
                      ) : (
                        <Badge variant="destructive" className="uppercase">Out of Stock</Badge>
                      )}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                      {product.name}
                    </h1>
                    {product.nameBn && (
                      <p className="text-base text-gray-500 font-medium font-bangla">{product.nameBn}</p>
                    )}

                    <div className="flex items-center gap-4">
                      <RatingStars rating={4.5} totalReviews={0} size="md" />
                      <Separator orientation="vertical" className="h-4" />
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">SKU: {product.sku}</span>
                    </div>
                  </div>

                  {/* Price & Description */}
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1 p-6 rounded-2xl bg-primary/5 border border-primary/20/50">
                      <span className="text-xs font-bold text-primary uppercase tracking-widest">
                        {product.salePrice ? "Special Price" : "Price"}
                      </span>
                      <PriceTag price={product.price} salePrice={product.salePrice ?? undefined} size="lg" />
                    </div>

                    <p className="text-gray-600 leading-relaxed font-medium">
                      {product.description || "Premium quality product from Varito Solutions."}
                    </p>
                  </div>

                  {/* Add to Cart Actions */}
                  <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-black text-gray-900 uppercase tracking-wider">Quantity:</span>
                      <QuantitySelector
                        value={quantity}
                        onChange={setQuantity}
                      />
                      {product.minOrderQty > 1 && (
                        <span className="text-xs text-gray-400 font-bold">Min: {product.minOrderQty}</span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-2">
                      <Button onClick={handleAddToCart} disabled={product.stock === 0} size="lg" className="flex-1 py-7 text-lg shadow-xl shadow-primary/20 gap-3 font-black">
                        <ShoppingCart className="size-6" /> Add to Cart
                      </Button>
                      <Button onClick={handleOrderNow} disabled={product.stock === 0} variant="accent" size="lg" className="flex-1 py-7 text-lg shadow-xl shadow-orange-500/20 gap-3 font-black">
                        <Zap className="size-6" /> Order Now
                      </Button>
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-2">
                      <div className="flex gap-4">
                        <button
                          onClick={toggleWishlist}
                          className={cn(
                            "flex items-center gap-2 text-sm font-bold transition-colors",
                            isWishlisted ? "text-red-500" : "text-gray-500 hover:text-primary"
                          )}
                        >
                          <Heart className={cn("size-5", isWishlisted && "fill-current")} /> Wishlist
                        </button>
                        <button
                          onClick={handleShare}
                          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors"
                        >
                          <Share2 className="size-5" /> Share
                        </button>
                      </div>
                      <Badge variant="cod" className="px-3 h-8">COD Available</Badge>
                    </div>
                  </div>

                  {/* Trust Signals */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TrustBadge icon={Truck} title="Fast Delivery" description="Inside CTG 24h, Outside 48-72h" />
                    <TrustBadge icon={ShieldCheck} title="Official Warranty" description="Guaranteed authentic product" />
                    <TrustBadge icon={RotateCcw} title="Easy Returns" description="7 Days no-questions-asked" />
                    <TrustBadge icon={CheckCircle2} title="Verified Seller" description="Premium Varito Partner" />
                  </div>
                </div>
              </div>

              {/* Product Details Tabs */}
              <section className="mt-20">
                <div className="flex border-b border-gray-100 gap-8 mb-10 overflow-x-auto">
                  {(["description", "specs", "reviews"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "pb-4 text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2",
                        activeTab === tab ? "text-primary border-primary" : "text-gray-400 border-transparent hover:text-gray-900"
                      )}
                    >
                      {tab === "description" ? "Full Description" : tab === "specs" ? "Specifications" : "Customer Reviews"}
                    </button>
                  ))}
                </div>

                <div className="min-h-[300px]">
                  {activeTab === "description" && (
                    <div className="animate-in fade-in duration-300">
                      <p className="text-gray-600 leading-relaxed font-medium max-w-3xl">
                        {product.description || "No detailed description available for this product."}
                      </p>
                      {product.descriptionBn && (
                        <p className="text-gray-500 leading-relaxed font-medium font-bangla mt-4">
                          {product.descriptionBn}
                        </p>
                      )}
                    </div>
                  )}

                  {activeTab === "specs" && (
                    <div className="max-w-xl animate-in fade-in duration-300">
                      <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                        {[
                          { label: "Unit", value: product.unit },
                          { label: "Min. Order Qty", value: String(product.minOrderQty) },
                          { label: "SKU", value: product.sku },
                          { label: "Category", value: product.category.name },
                          { label: "Stock", value: product.stock > 0 ? `${product.stock} available` : "Out of stock" },
                        ].map((spec, i) => (
                          <div key={i} className="flex justify-between p-4 border-b border-gray-50 last:border-0 bg-white even:bg-gray-50/30">
                            <span className="text-sm font-bold text-gray-400">{spec.label}</span>
                            <span className="text-sm font-black text-gray-900">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-300">
                      <div className="size-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-6">
                        <MessageSquare className="size-8" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Verified Reviews Yet</h3>
                      <p className="text-gray-500 max-w-xs mx-auto mb-8 font-medium">Be the first to share your experience!</p>
                      <Button variant="outline" className="font-black uppercase tracking-widest rounded-xl px-8">Write a Review</Button>
                    </div>
                  )}
                </div>
              </section>

              {/* Related Products */}
              {related.length > 0 && (
                <section className="mt-24">
                  <div className="flex justify-between items-end mb-10">
                    <div className="flex flex-col gap-2">
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">You May Also Like</h2>
                      <p className="text-gray-500 font-medium">More from {product.category.name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                    {related.map((r) => (
                      <ProductCard
                        key={r.id}
                        id={r.id}
                        name={r.name}
                        nameBn={r.nameBn}
                        slug={r.slug}
                        image={r.images[0] ?? ""}
                        price={r.price}
                        salePrice={r.salePrice ?? undefined}
                        stock={r.stock}
                        isNew={r.isNew}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

        </div>
      </main>

      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </div>
  )
}
