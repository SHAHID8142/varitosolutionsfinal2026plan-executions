/**
 * @file product-card.tsx
 * @description Card component for displaying a single product in grid or list views.
 *              Optimized for mobile-first display at 375px minimum width.
 *              Shows image, name, price, and CTA.
 *              CTA button meets 44px touch target minimum (size="md" = h-11).
 *
 * @props id | name | slug | image | price | salePrice | stock | isNew
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import { PriceTag } from "@/components/ui/price-tag"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { usePostHog } from "posthog-js/react"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface ProductCardProps {
  id: string
  name: string
  nameBn?: string
  slug: string
  image: string
  price: number
  salePrice?: number
  stock: number
  isNew?: boolean
  className?: string
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

/**
 * Product card for grid and list views.
 * Fires a PostHog event on add-to-cart click.
 * Out-of-stock products are visually muted and the CTA is disabled.
 */
export function ProductCard({
  id,
  name,
  slug,
  image,
  price,
  salePrice,
  stock,
  isNew,
  className,
}: ProductCardProps) {
  const isOutOfStock = stock <= 0
  const posthog = usePostHog()

  return (
    <div className={cn(
      "group relative flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/40",
      className
    )}>
      {/* Image Container */}
      <Link href={`/product/${slug}`} className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
        <Image
          src={image}
          alt={name}
          fill
          className={cn(
            "object-cover transition-transform duration-300 group-hover:scale-110",
            isOutOfStock && "opacity-50 grayscale"
          )}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />

        {/* Status Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && <Badge variant="default" className="text-[10px] h-5">New</Badge>}
          {salePrice !== undefined && salePrice < price && (
            <Badge variant="sale" className="text-[10px] h-5">Sale</Badge>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Badge variant="destructive" className="px-3 py-1 text-sm font-bold">
              Out of Stock
            </Badge>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="flex flex-col gap-1.5 flex-1">
        <Link href={`/product/${slug}`}>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold text-gray-900 hover:text-primary transition-colors duration-200">
            {name}
          </h3>
        </Link>

        <PriceTag price={price} salePrice={salePrice} size="md" className="mt-auto" />
      </div>

      {/* Action Button — size="md" = h-11 (44px) meets touch target minimum */}
      <Button
        variant="accent"
        size="md"
        className="w-full gap-2 text-sm"
        disabled={isOutOfStock}
        onClick={(e) => {
          e.preventDefault()
          posthog?.capture("product_added_to_cart", {
            product_id: id,
            product_name: name,
            product_slug: slug,
            price: salePrice ?? price,
            is_sale: salePrice !== undefined && salePrice < price,
          })
          toast.success(`${name} added to cart!`)
        }}
      >
        <ShoppingCart className="size-4" />
        Add to Cart
      </Button>
    </div>
  )
}
