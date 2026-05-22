/**
 * @file page.tsx
 * @path /product/[slug]
 * @description Product detail page showcasing a single product.
 *              Includes image gallery, pricing, description, trust signals,
 *              and related products.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { 
  ShoppingCart, 
  Zap, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  CheckCircle2, 
  Share2, 
  Heart,
  Package,
  LucideIcon
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/shop/product-card"
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
// SAMPLE DATA
// ─────────────────────────────────────────────

const PRODUCT = {
  id: "1",
  name: "Luxury Emerald Gold Faucet - Dual Handle Bathroom Mixer",
  nameBn: "লাক্সারি এমারেল্ড গোল্ড কল - ডুয়াল হ্যান্ডেল বাথরুম মিক্সার",
  slug: "luxury-emerald-gold-faucet",
  images: [
    "https://placehold.co/800x800/10b981/white.png?text=Product+Image+1",
    "https://placehold.co/800x800/10b981/white.png?text=Product+Image+2",
    "https://placehold.co/800x800/10b981/white.png?text=Product+Image+3",
  ],
  price: 4500,
  salePrice: 3800,
  rating: 4.8,
  reviewsCount: 24,
  stock: 12,
  isNew: true,
  sku: "VR-SAN-001",
  unit: "Piece",
  category: "Sanitary Ware",
  description: "Experience the ultimate in bathroom luxury with our Emerald Gold Faucet. Crafted from high-grade brass with a premium emerald green finish and gold accents, this mixer tap combines elegant aesthetics with superior functionality.",
  features: [
    "High-grade solid brass construction for durability",
    "Multi-layer emerald green and gold plating (Anti-rust)",
    "Ceramic disc valve for leak-free performance",
    "Dual handle control for precise temperature adjustment",
    "Standard G1/2 connections for easy installation"
  ],
  specs: [
    { label: "Material", value: "Solid Brass" },
    { label: "Finish", value: "Emerald Green & Gold" },
    { label: "Valve Type", value: "Ceramic Disc" },
    { label: "Mounting", value: "Deck Mounted" },
    { label: "Warranty", value: "5 Years Replacement" },
  ]
}

const RELATED_PRODUCTS = [
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
]

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
  const [quantity, setQuantity] = React.useState(1)
  const [activeTab, setActiveTab] = React.useState<"description" | "specs" | "reviews">("description")
  const [isWishlisted, setIsWishlisted] = React.useState(false)
  const posthog = usePostHog()

  React.useEffect(() => {
    if (posthog) {
      posthog.capture('product_viewed', {
        product_id: PRODUCT.id,
        product_name: PRODUCT.name,
        product_slug: PRODUCT.slug,
        category: PRODUCT.category,
        price: PRODUCT.salePrice ?? PRODUCT.price,
      });
    }
  }, [posthog])

  const handleAddToCart = () => {
    posthog.capture('product_added_to_cart', {
      product_id: PRODUCT.id,
      product_name: PRODUCT.name,
      product_slug: PRODUCT.slug,
      category: PRODUCT.category,
      price: PRODUCT.salePrice ?? PRODUCT.price,
      quantity,
    });
    toast.success(`${PRODUCT.name} (${quantity} ${PRODUCT.unit}${quantity > 1 ? 's' : ''}) added to cart!`)
  }

  const handleOrderNow = () => {
    toast.info("Redirecting to checkout...")
    window.location.href = "/checkout"
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    if (!isWishlisted) {
      toast.success("Added to wishlist!")
    } else {
      toast.info("Removed from wishlist")
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: PRODUCT.name,
        url: window.location.href
      }).catch(() => {
        toast.info("Share link copied to clipboard!")
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ProductSchema
        name={PRODUCT.name}
        description={PRODUCT.description}
        image={PRODUCT.images[0]}
        sku={PRODUCT.sku}
        price={PRODUCT.salePrice || PRODUCT.price}
      />
      <Header />
      
      <main className="flex-1 bg-white">
        <div className="container mx-auto px-4 py-8">
          
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Categories", href: "/categories" },
              { label: PRODUCT.category, href: `/category/${PRODUCT.category.toLowerCase().replace(' ', '-')}` },
              { label: PRODUCT.name },
            ]}
            className="mb-8"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* LEFT: Image Gallery */}
            <div className="lg:col-span-6 xl:col-span-7">
              <ImageGallery images={PRODUCT.images} />
            </div>

            {/* RIGHT: Product Info */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-8">
              
              {/* Title & Reviews */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {PRODUCT.isNew && <Badge variant="default" className="bg-emerald-500">New Arrival</Badge>}
                  {PRODUCT.stock > 0 ? (
                    <Badge variant="verified" className="bg-emerald-50 text-emerald-600 border-emerald-100 uppercase">In Stock</Badge>
                  ) : (
                    <Badge variant="destructive" className="uppercase">Out of Stock</Badge>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                  {PRODUCT.name}
                </h1>
                
                <div className="flex items-center gap-4">
                  <RatingStars rating={PRODUCT.rating} totalReviews={PRODUCT.reviewsCount} size="md" />
                  <Separator orientation="vertical" className="h-4" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">SKU: {PRODUCT.sku}</span>
                </div>
              </div>

              {/* Price & Description */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1 p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Special Price</span>
                  <PriceTag price={PRODUCT.price} salePrice={PRODUCT.salePrice} size="lg" />
                </div>

                <p className="text-gray-600 leading-relaxed font-medium">
                  {PRODUCT.description}
                </p>
              </div>

              {/* Add to Cart Actions */}
              <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-gray-900 uppercase tracking-wider">Quantity:</span>
                  <QuantitySelector value={quantity} onChange={setQuantity} />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                  <Button onClick={handleAddToCart} size="lg" className="flex-1 py-7 text-lg shadow-xl shadow-emerald-500/20 gap-3 font-black">
                    <ShoppingCart className="size-6" /> Add to Cart
                  </Button>
                  <Button onClick={handleOrderNow} variant="accent" size="lg" className="flex-1 py-7 text-lg shadow-xl shadow-orange-500/20 gap-3 font-black">
                    <Zap className="size-6" /> Order Now
                  </Button>
                </div>

                <div className="flex items-center justify-between gap-4 mt-2">
                  <div className="flex gap-4">
                    <button 
                      onClick={toggleWishlist}
                      className={cn(
                        "flex items-center gap-2 text-sm font-bold transition-colors",
                        isWishlisted ? "text-danger-500" : "text-gray-500 hover:text-primary"
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
                <TrustBadge 
                  icon={Truck} 
                  title="Fast Delivery" 
                  description="Inside CTG 24h, Outside 48-72h" 
                />
                <TrustBadge 
                  icon={ShieldCheck} 
                  title="Official Warranty" 
                  description="5 Years on this product" 
                />
                <TrustBadge 
                  icon={RotateCcw} 
                  title="Easy Returns" 
                  description="7 Days no-questions-asked" 
                />
                <TrustBadge 
                  icon={CheckCircle2} 
                  title="Verified Seller" 
                  description="Premium Varito Partner" 
                />
              </div>

            </div>
          </div>

          {/* Product Details Tabs */}
          <section className="mt-20">
            <div className="flex border-b border-gray-100 gap-8 mb-10 overflow-x-auto no-scrollbar">
              <button 
                onClick={() => setActiveTab("description")}
                className={cn(
                  "pb-4 text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2",
                  activeTab === "description" ? "text-primary border-primary" : "text-gray-400 border-transparent hover:text-gray-900"
                )}
              >
                Full Description
              </button>
              <button 
                onClick={() => setActiveTab("specs")}
                className={cn(
                  "pb-4 text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2",
                  activeTab === "specs" ? "text-primary border-primary" : "text-gray-400 border-transparent hover:text-gray-900"
                )}
              >
                Specifications
              </button>
              <button 
                onClick={() => setActiveTab("reviews")}
                className={cn(
                  "pb-4 text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2",
                  activeTab === "reviews" ? "text-primary border-primary" : "text-gray-400 border-transparent hover:text-gray-900"
                )}
              >
                Customer Reviews ({PRODUCT.reviewsCount})
              </button>
            </div>

            <div className="min-h-[400px]">
              {activeTab === "description" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in duration-500">
                  <div className="lg:col-span-8">
                    <div className="prose prose-emerald max-w-none">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-2">
                        <Package className="text-primary size-5" /> Detailed Features
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 list-none p-0">
                        {PRODUCT.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-600 font-medium bg-gray-50/50 p-4 rounded-xl border border-gray-50">
                            <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="lg:col-span-4">
                    <div className="p-8 rounded-3xl bg-gray-900 text-white flex flex-col gap-6 relative overflow-hidden">
                      <div className="relative z-10">
                        <h4 className="text-xl font-black uppercase tracking-tight mb-2">Quality Guarantee</h4>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed">
                          Every product undergoes a 12-point quality check before dispatch. We guarantee authentic premium finish.
                        </p>
                      </div>
                      <ShieldCheck className="absolute -bottom-6 -right-6 size-32 text-white/5" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "specs" && (
                <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-tight">Technical Specs</h3>
                  <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    {PRODUCT.specs.map((spec, i) => (
                      <div key={i} className="flex justify-between p-4 border-b border-gray-50 last:border-0 bg-white even:bg-gray-50/30">
                        <span className="text-sm font-bold text-gray-400">{spec.label}</span>
                        <span className="text-sm font-black text-gray-900">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
                  <div className="size-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-6">
                    <MessageSquare className="size-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Verified Reviews Yet</h3>
                  <p className="text-gray-500 max-w-xs mx-auto mb-8 font-medium">Be the first to share your experience with this product!</p>
                  <Button variant="outline" className="font-black uppercase tracking-widest rounded-xl px-8">Write a Review</Button>
                </div>
              )}
            </div>
          </section>

          {/* Related Products */}
          <section className="mt-24">
            <div className="flex justify-between items-end mb-10">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">You May Also Like</h2>
                <p className="text-gray-500 font-medium">Complete your bathroom setup with these matching items</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {RELATED_PRODUCTS.map((product) => (
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
          </section>

        </div>
      </main>

      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </div>
  )
}

import { MessageSquare } from "lucide-react"
