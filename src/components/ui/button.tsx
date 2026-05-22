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
 * @updated  2026-05-22
 */

import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-base font-bold whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-600 transition-colors duration-300",
        secondary: "bg-white border-2 border-primary text-primary hover:bg-primary-50",
        accent: "bg-accent text-accent-foreground hover:bg-accent-600 transition-colors duration-300",
        outline: "border-2 border-border bg-transparent text-gray-700 hover:bg-gray-50",
        ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 gap-1.5 px-4 text-sm",
        md: "h-11 gap-2 px-6",
        lg: "h-[52px] gap-2.5 px-8 text-lg",
        icon: "size-11",
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
