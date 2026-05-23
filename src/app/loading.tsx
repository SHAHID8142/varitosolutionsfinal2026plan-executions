/**
 * @file loading.tsx
 * @description Global loading state for Varito Solutions.
 *              Displays a premium centered brand loader.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

import * as React from "react"
import { Package } from "lucide-react"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
      {/* Animated Brand Mark */}
      <div className="relative">
        {/* Outer pulse ring */}
        <div className="absolute inset-0 size-24 rounded-full bg-primary/10 animate-ping opacity-75" />
        
        {/* Inner container */}
        <div className="relative size-24 bg-primary rounded-3xl flex items-center justify-center shadow-xl shadow-primary/30">
          <Package className="size-12 text-white animate-bounce duration-1000" strokeWidth={1.5} />
        </div>
      </div>

      {/* Brand Text */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
          Varito <span className="text-primary">Solutions</span>
        </h2>
        <div className="flex items-center gap-1">
          <div className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
          <div className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
          <div className="size-1.5 rounded-full bg-primary animate-bounce" />
        </div>
      </div>

      {/* Footer text */}
      <p className="absolute bottom-12 text-gray-400 font-bold tracking-widest text-[10px] uppercase">
        Premium Sanitary & Packaging
      </p>
    </div>
  )
}
