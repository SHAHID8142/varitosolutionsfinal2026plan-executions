/**
 * @file order-summary.tsx
 * @description Card component showing the breakdown of costs for an order.
 *              Includes subtotal, shipping, COD fee, and grand total.
 *
 * @props subtotal | shipping | codFee | discount
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/format-price"
import { Separator } from "@/components/ui/separator"

interface OrderSummaryProps {
  subtotal: number
  shipping: number
  codFee?: number
  discount?: number
  className?: string
}

export function OrderSummary({
  subtotal,
  shipping,
  codFee = 0,
  discount = 0,
  className,
}: OrderSummaryProps) {
  const total = subtotal + shipping + codFee - discount

  return (
    <div className={cn("rounded-2xl border border-gray-100 bg-white p-6 shadow-sm", className)}>
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

        {/* COD Fee */}
        {codFee > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">COD Charge</span>
            <span className="font-semibold text-gray-900">{formatPrice(codFee)}</span>
          </div>
        )}

        {/* Discount */}
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

      <p className="mt-6 text-[10px] text-gray-400 text-center font-medium leading-relaxed">
        By placing this order, you agree to our <br />
        <a href="/terms" className="underline hover:text-primary">Terms & Conditions</a> and <br />
        <a href="/returns" className="underline hover:text-primary">Returns Policy</a>.
      </p>
    </div>
  )
}
