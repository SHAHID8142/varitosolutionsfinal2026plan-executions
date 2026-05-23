/**
 * @file cart-item.tsx
 * @description Component for a single item in the shopping cart.
 *              Includes image, name, price, quantity selector, and remove action.
 *              Uses formatPrice() for all BDT values for consistent ৳ formatting.
 *
 * @props id | name | price | image | quantity | onQuantityChange | onRemove
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

// Needs "use client" because onQuantityChange and onRemove are event handler props
"use client"

import * as React from "react"
import Image from "next/image"
import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/format-price"
import { PriceTag } from "@/components/ui/price-tag"
import { QuantitySelector } from "@/components/ui/quantity-selector"
import { Button } from "@/components/ui/button"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface CartItemProps {
  id: string
  name: string
  price: number
  salePrice?: number
  image: string
  quantity: number
  onQuantityChange: (newQty: number) => void
  onRemove: () => void
  className?: string
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

/**
 * Single line item in the shopping cart.
 * Line total is calculated client-side for display; server recalculates at order creation.
 */
export function CartItem({
  name,
  price,
  salePrice,
  image,
  quantity,
  onQuantityChange,
  onRemove,
  className,
}: CartItemProps) {
  return (
    <div className={cn(
      "flex gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all hover:shadow-md",
      className
    )}>
      {/* Product Image */}
      <div className="relative size-20 sm:size-24 shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-50">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 80px, 96px"
        />
      </div>

      {/* Info & Actions */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-1">
            {name}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-gray-400 hover:text-danger-500 hover:bg-danger-50 shrink-0"
            onClick={onRemove}
            aria-label="Remove item"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        <PriceTag price={price} salePrice={salePrice} size="sm" className="mt-1" />

        <div className="mt-auto pt-2 flex justify-between items-end">
          <QuantitySelector
            value={quantity}
            onChange={onQuantityChange}
            className="scale-90 origin-left"
          />
          
          <div className="text-right flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</span>
            <span className="text-sm font-black text-gray-900">
              {formatPrice((salePrice ?? price) * quantity)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
