/**
 * @file price-tag.tsx
 * @description Component for displaying formatted BDT prices.
 *              Handles original price, sale price, and discount percentage badges.
 *              Always shows ৳ symbol with comma-separated thousands via formatPrice().
 *
 * @variants sm | md | lg
 *
 * @example
 * <PriceTag price={1299} salePrice={999} size="md" />
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { formatPrice, calculateDiscount } from "@/lib/format-price"
import { Badge } from "@/components/ui/badge"

// ─────────────────────────────────────────────
// VARIANTS
// ─────────────────────────────────────────────

const priceTagVariants = cva("flex items-center gap-2 font-bangla", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface PriceTagProps extends VariantProps<typeof priceTagVariants> {
  price: number
  salePrice?: number
  showDiscountBadge?: boolean
  className?: string
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

/**
 * Displays a formatted BDT price with optional sale price and discount badge.
 * Uses formatPrice() to ensure ৳ symbol and comma-separated thousands.
 */
export function PriceTag({
  price,
  salePrice,
  size = "md",
  showDiscountBadge = true,
  className,
}: PriceTagProps) {
  const hasSale = salePrice !== undefined && salePrice < price
  const discount = hasSale ? calculateDiscount(price, salePrice as number) : 0

  return (
    <div className={cn(priceTagVariants({ size, className }))}>
      {hasSale ? (
        <>
          {/* Sale price is highlighted in brand primary color */}
          <span className="font-black text-primary">
            {formatPrice(salePrice as number)}
          </span>
          {/* Strikethrough original price — muted to reduce visual noise */}
          <span className="text-gray-400 line-through text-xs">
            {formatPrice(price)}
          </span>
          {showDiscountBadge && discount > 0 && (
            <Badge variant="sale" className="h-5 px-1.5">
              -{discount}%
            </Badge>
          )}
        </>
      ) : (
        <span className="font-black text-gray-900">
          {formatPrice(price)}
        </span>
      )}
    </div>
  )
}
