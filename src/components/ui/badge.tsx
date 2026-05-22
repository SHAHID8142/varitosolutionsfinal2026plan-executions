/**
 * @file badge.tsx
 * @description Small status indicator used for labels, product states,
 *              and payment methods. Optimized for readability.
 *
 * @variants default | secondary | destructive | outline | cod | bkash | nagad | verified | sale
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-lg px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-gray-100 text-gray-700",
        destructive: "bg-danger-500 text-white",
        outline: "border-gray-200 text-gray-700",
        cod: "bg-cod-bg text-cod-text border-cod-text/20",
        bkash: "bg-bkash-bg text-bkash-text",
        nagad: "bg-nagad-bg text-nagad-text border-nagad-text/20",
        verified: "bg-success-500 text-white",
        sale: "bg-accent text-accent-foreground",
        ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends useRender.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {}

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: BadgeProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
