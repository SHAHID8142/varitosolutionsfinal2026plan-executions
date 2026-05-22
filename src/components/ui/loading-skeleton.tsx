/**
 * @file loading-skeleton.tsx
 * @description Reusable skeleton loading states for different UI elements.
 *              Uses animated gray blocks to represent content loading.
 *
 * @variants product-card | list-item | page | text
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Skeleton for a product card in a grid.
 */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-100 p-3">
      {/* Image placeholder */}
      <Skeleton className="aspect-square w-full rounded-lg" />
      {/* Title placeholder */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      {/* Price placeholder */}
      <Skeleton className="h-6 w-1/3" />
      {/* Button placeholder */}
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  )
}

/**
 * Skeleton for a list item (e.g., search result or cart item).
 */
export function ListItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 border-b border-gray-100">
      <Skeleton className="size-20 rounded-lg shrink-0" />
      <div className="flex flex-col gap-2 flex-1 py-1">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <div className="mt-auto flex justify-between items-center">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton for a full page or large content area.
 */
export function PageSkeleton() {
  return (
    <div className="flex flex-col gap-8 p-4">
      {/* Hero/Banner placeholder */}
      <Skeleton className="h-48 w-full rounded-xl" />
      {/* Grid title */}
      <Skeleton className="h-8 w-48" />
      {/* Grid of cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

/**
 * Standard text line skeleton.
 */
export function TextSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn("h-4 w-full", className)} />
}
