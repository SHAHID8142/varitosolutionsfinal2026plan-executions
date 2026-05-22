/**
 * @file quantity-selector.tsx
 * @description Input component for adjusting product quantity.
 *              Includes minus/plus buttons and a numeric input.
 *              Enforces minimum and maximum limits.
 *
 * @example
 * <QuantitySelector value={1} onChange={(val) => setVal(val)} min={1} max={10} />
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
}

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
    const val = parseInt(e.target.value)
    if (isNaN(val)) return
    if (val >= min && val <= max) onChange(val)
  }

  return (
    <div className={cn("flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100 w-fit", className)}>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 rounded-md bg-white border border-gray-200"
        onClick={handleDecrement}
        disabled={value <= min}
        aria-label="Decrease quantity"
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
      />

      <Button
        variant="ghost"
        size="icon"
        className="size-8 rounded-md bg-white border border-gray-200"
        onClick={handleIncrement}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="size-4" />
      </Button>
    </div>
  )
}
