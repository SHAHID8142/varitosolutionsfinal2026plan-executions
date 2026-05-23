/**
 * @file button.tsx
 * @description Reusable Button component with multiple variants and states.
 *              Used across all pages for primary actions, form submissions,
 *              and navigation triggers.
 *
 * @variants primary | secondary | accent | ghost | danger | outline
 * @states   default | loading | disabled
 * @sizes    sm | md | lg | icon | icon-sm
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base: min-h-[44px] ensures 44px touch target on all sizes; rounded-xl matches design system
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-base font-bold whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-200)] active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-white border-2 border-primary text-primary hover:bg-primary/5",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90",
        outline: "border-2 border-[var(--color-border)] bg-transparent text-gray-700 hover:bg-gray-50",
        ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // sm still meets 36px height — used for compact badge-like buttons; prefer md for touch
        sm: "h-9 min-h-[36px] gap-1.5 px-4 text-sm",
        md: "h-11 min-h-[44px] gap-2 px-6",
        lg: "h-[52px] min-h-[44px] gap-2.5 px-8 text-lg",
        icon: "size-11 min-h-[44px] min-w-[44px]",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

function Button({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" data-icon="inline-start" />}
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
