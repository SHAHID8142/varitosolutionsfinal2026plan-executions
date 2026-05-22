/**
 * @file cod.tsx
 * @description Custom SVG component for the Cash on Delivery icon.
 *              Used in payment selection and footer.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import * as React from "react"
import { Banknote } from "lucide-react"

export function CodIcon({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center bg-orange-100 text-orange-600 rounded-lg ${className}`}>
      <Banknote className="size-full p-1" />
    </div>
  )
}
