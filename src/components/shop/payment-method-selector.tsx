/**
 * @file payment-method-selector.tsx
 * @description Component for selecting a payment method during checkout.
 *              Options: COD (default), bKash, Nagad, Card.
 *              Shows appropriate brand colors and logos.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type PaymentMethod = "cod" | "bkash" | "nagad" | "card"

interface PaymentMethodSelectorProps {
  selected?: PaymentMethod
  onChange?: (method: PaymentMethod) => void
  className?: string
}

const METHODS = [
  {
    id: "cod",
    label: "Cash on Delivery",
    labelBn: "ক্যাশ অন ডেলিভারি",
    description: "Pay when you receive the product",
    badge: { label: "+৳40 Fee", variant: "cod" as const },
  },
  {
    id: "bkash",
    label: "bKash",
    labelBn: "বিকাশ",
    description: "Fast & secure mobile payment",
    badge: { label: "0% Fee", variant: "verified" as const },
  },
  {
    id: "nagad",
    label: "Nagad",
    labelBn: "নগদ",
    description: "Convenient mobile payment",
    badge: { label: "0% Fee", variant: "verified" as const },
  },
  {
    id: "card",
    label: "Card Payment",
    labelBn: "কার্ড পেমেন্ট",
    description: "Visa, Mastercard, etc.",
    badge: { label: "via aamarPay", variant: "outline" as const },
  },
] as const

export function PaymentMethodSelector({
  selected = "cod",
  onChange,
  className,
}: PaymentMethodSelectorProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {METHODS.map((method) => {
        const isActive = selected === method.id

        return (
          <button
            key={method.id}
            type="button"
            onClick={() => onChange?.(method.id)}
            className={cn(
              "relative flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all",
              isActive
                ? "border-primary bg-primary-50/50 ring-4 ring-primary-100"
                : "border-gray-100 bg-white hover:border-gray-200"
            )}
          >
            {/* Selection Circle */}
            <div className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
              isActive ? "border-primary bg-primary" : "border-gray-300"
            )}>
              {isActive && <Check className="size-3 text-white stroke-[3px]" />}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">{method.label}</span>
                {method.badge && (
                  <Badge variant={method.badge.variant} className="text-[10px] h-5 px-1.5">
                    {method.badge.label}
                  </Badge>
                )}
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {method.description}
              </span>
            </div>

            {/* Bangla Label (Subtle) */}
            <span className="hidden sm:block text-xs font-bangla text-gray-400">
              {method.labelBn}
            </span>
          </button>
        )
      })}
    </div>
  )
}
