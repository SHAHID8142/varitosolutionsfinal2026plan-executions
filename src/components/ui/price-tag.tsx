/**
 * @file price-tag.tsx
 * @description Component for displaying formatted BDT prices.
 *              Handles original price, sale price, and discount percentage badges.
 *
 * @variants sm | md | lg
 *
 * @example
 * <PriceTag price={1299} salePrice={999} size="md" />
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { formatPrice, calculateDiscount } from "@/lib/format-price"
import { Badge } from "@/components/ui/badge"

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

export interface PriceTagProps extends VariantProps<typeof priceTagVariants> {
  price: number
  salePrice?: number
  showDiscountBadge?: boolean
  className?: string
}

export function PriceTag({
  price,
  salePrice,
  size = "md",
  showDiscountBadge = true,
  className,
}: PriceTagProps) {
  const hasSale = salePrice && salePrice < price
  const discount = hasSale ? calculateDiscount(price, salePrice) : 0

  return (
    <div className={cn(priceTagVariants({ size, className }))}>
      {hasSale ? (
        <>
          <span className="font-black text-primary">
            {formatPrice(salePrice)}
          </span>
          <span className="text-gray-400 line-through decoration-danger-500/30 text-xs">
            {formatPrice(price)}
          </span>
          {showDiscountBadge && discount > 0 && (
            <Badge variant="sale" className="h-5 px-1.5 bg-accent/10 text-accent border-none">
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
