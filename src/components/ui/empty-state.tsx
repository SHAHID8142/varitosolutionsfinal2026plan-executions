/**
 * @file empty-state.tsx
 * @description Component for displaying a message when no data is available
 *              (e.g., empty cart, no search results, no orders).
 *
 * @example
 * <EmptyState
 *   icon={<SearchOff />}
 *   title="No results found"
 *   description="Try adjusting your filters or search term."
 *   cta={<Button>Clear Filters</Button>}
 * />
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import * as React from "react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description?: string
  cta?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  cta,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className
    )}>
      {/* Icon with subtle background */}
      <div className="size-20 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 mb-6">
        {React.isValidElement(icon) 
          ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { 
              className: "size-10"
            }) 
          : icon}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-gray-500 max-w-xs mb-8">
          {description}
        </p>
      )}

      {/* Call to Action */}
      {cta && (
        <div className="w-full max-w-[200px]">
          {cta}
        </div>
      )}
    </div>
  )
}
