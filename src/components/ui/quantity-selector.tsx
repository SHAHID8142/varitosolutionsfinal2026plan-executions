/**
 * @file quantity-selector.tsx
 * @description Input component for adjusting product quantity.
 *              Includes minus/plus buttons and a numeric input.
 *              Enforces minimum and maximum limits.
 *              Touch targets meet the 44×44px minimum on mobile.
 *
 * @example
 * <QuantitySelector value={1} onChange={(val) => setVal(val)} min={1} max={10} />
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

/**
 * Quantity selector with decrement/increment buttons.
 * Buttons use size="icon" (44×44px) to meet mobile touch target requirements.
 */
export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1)
  }

  const handleIncrement = () => {
    if (value < max) onChange(value + 1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10)
    if (isNaN(val)) return
    // Clamp to valid range before propagating
    if (val >= min && val <= max) onChange(val)
  }

  return (
    <div className={cn("flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-[var(--color-border)] w-fit", className)}>
      {/* 44×44px touch target for decrement */}
      <Button
        variant="ghost"
        size="icon"
        className="size-11 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
        onClick={handleDecrement}
        disabled={value <= min}
        aria-label="Decrease quantity"
        type="button"
      >
        <Minus className="size-4" />
      </Button>

      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        className="w-10 text-center bg-transparent font-bold text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        min={min}
        max={max}
        aria-label="Quantity"
      />

      {/* 44×44px touch target for increment */}
      <Button
        variant="ghost"
        size="icon"
        className="size-11 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
        onClick={handleIncrement}
        disabled={value >= max}
        aria-label="Increase quantity"
        type="button"
      >
        <Plus className="size-4" />
      </Button>
    </div>
  )
}
