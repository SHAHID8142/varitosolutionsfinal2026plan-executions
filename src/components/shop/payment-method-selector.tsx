/**
 * @file payment-method-selector.tsx
 * @description Component for selecting a payment method during checkout.
 *              Options: COD (default), bKash, Nagad, Card.
 *              COD is listed first and is the default selection per BD market norms.
 *              Shows appropriate brand colors and logos.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

// Needs "use client" because of onClick event handlers on interactive buttons
"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { BkashIcon } from "@/components/ui/icons/bkash"
import { NagadIcon } from "@/components/ui/icons/nagad"
import { VisaIcon } from "@/components/ui/icons/visa"
import { CodIcon } from "@/components/ui/icons/cod"

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
    icon: CodIcon,
    badge: { label: "+৳40 Fee", variant: "cod" as const },
  },
  {
    id: "bkash",
    label: "bKash",
    labelBn: "বিকাশ",
    description: "Fast & secure mobile payment",
    icon: BkashIcon,
    badge: { label: "0% Fee", variant: "verified" as const },
  },
  {
    id: "nagad",
    label: "Nagad",
    labelBn: "নগদ",
    description: "Convenient mobile payment",
    icon: NagadIcon,
    badge: { label: "0% Fee", variant: "verified" as const },
  },
  {
    id: "card",
    label: "Card Payment",
    labelBn: "কার্ড পেমেন্ট",
    description: "Visa, Mastercard, etc.",
    icon: VisaIcon,
    badge: { label: "via aamarPay", variant: "outline" as const },
  },
] as const

/**
 * Controlled payment method selector.
 * COD is the first option and default per Bangladesh market norms (COD-dominant).
 * Each method button meets 44px touch target height via py-4 padding.
 */
export function PaymentMethodSelector({
  selected = "cod",
  onChange,
  className,
}: PaymentMethodSelectorProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {METHODS.map((method) => {
        const isActive = selected === method.id
        const Icon = method.icon

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
            {/* Brand Icon */}
            <div className="size-10 rounded-lg overflow-hidden shrink-0 shadow-sm border border-gray-100 bg-white flex items-center justify-center p-1">
               <Icon className="size-full" />
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
              <span className="text-xs text-gray-500 font-medium line-clamp-1">
                {method.description}
              </span>
            </div>

            {/* Selection Circle */}
            <div className={cn(
              "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
              isActive ? "border-primary bg-primary" : "border-gray-300"
            )}>
              {isActive && <Check className="size-4 text-white stroke-[3px]" />}
            </div>
          </button>
        )
      })}
    </div>
  )
}
