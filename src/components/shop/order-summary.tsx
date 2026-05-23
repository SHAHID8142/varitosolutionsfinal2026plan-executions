/**
 * @file order-summary.tsx
 * @description Card component showing the breakdown of costs for an order.
 *              Includes subtotal, shipping, COD fee, and grand total.
 *              All prices use formatPrice() for ৳ symbol with comma formatting.
 *
 * @props subtotal | shipping | codFee | discount
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/format-price"
import { Separator } from "@/components/ui/separator"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface OrderSummaryProps {
  subtotal: number
  shipping: number
  codFee?: number
  discount?: number
  className?: string
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

/**
 * Order cost breakdown card.
 * Grand total is calculated server-side in production; this component
 * only provides the visual summary for user review before submission.
 */
export function OrderSummary({
  subtotal,
  shipping,
  codFee = 0,
  discount = 0,
  className,
}: OrderSummaryProps) {
  const total = subtotal + shipping + codFee - discount

  return (
    <div className={cn("rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm", className)}>
      <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>

      <div className="flex flex-col gap-4">
        {/* Subtotal */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Shipping Fee</span>
          <span className="font-semibold text-gray-900">{formatPrice(shipping)}</span>
        </div>

        {/* COD Fee — only shown when COD is selected */}
        {codFee > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">COD Charge</span>
            <span className="font-semibold text-gray-900">{formatPrice(codFee)}</span>
          </div>
        )}

        {/* Discount — only shown when a discount applies */}
        {discount > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-success-600">Discount</span>
            <span className="font-semibold text-success-600">-{formatPrice(discount)}</span>
          </div>
        )}

        <Separator className="my-2" />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-base font-bold text-gray-900">Grand Total</span>
          <span className="text-xl font-black text-primary">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Legal disclaimer — text-xs (12px) is acceptable for fine-print links */}
      <p className="mt-6 text-xs text-gray-400 text-center font-medium leading-relaxed">
        By placing this order, you agree to our{" "}
        <a href="/terms" className="underline hover:text-primary transition-colors">Terms & Conditions</a>{" "}
        and{" "}
        <a href="/returns" className="underline hover:text-primary transition-colors">Returns Policy</a>.
      </p>
    </div>
  )
}
