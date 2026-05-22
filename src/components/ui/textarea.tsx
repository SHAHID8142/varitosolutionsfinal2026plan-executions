/**
 * @file textarea.tsx
 * @description Standard multiline text input component with premium styling.
 *              Optimized for mobile-first forms.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="input"
      className={cn(
        "flex min-h-32 w-full rounded-xl border border-input bg-white px-4 py-3 text-base transition-all outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
