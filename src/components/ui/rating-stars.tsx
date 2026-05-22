/**
 * @file rating-stars.tsx
 * @description Star rating component for displaying and collecting product reviews.
 *              Supports partial stars (fractional) for display and full stars for interaction.
 *
 * @example
 * <RatingStars rating={4.5} totalReviews={12} />
 * <RatingStars interactive onRate={(value) => setRating(value)} />
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import * as React from "react"
import { Star, StarHalf } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingStarsProps {
  rating?: number
  totalReviews?: number
  size?: "sm" | "md" | "lg"
  interactive?: boolean
  onRate?: (rating: number) => void
  className?: string
}

export function RatingStars({
  rating = 0,
  totalReviews,
  size = "md",
  interactive = false,
  onRate,
  className,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = React.useState(0)
  
  const iconSize = {
    sm: "size-3",
    md: "size-4",
    lg: "size-6",
  }[size]

  const renderStars = () => {
    const stars = []
    const displayRating = interactive && hoverRating > 0 ? hoverRating : rating

    for (let i = 1; i <= 5; i++) {
      const isFull = i <= Math.floor(displayRating)
      const isHalf = !isFull && i <= Math.ceil(displayRating) && displayRating % 1 !== 0

      stars.push(
        <div
          key={i}
          className={cn(
            "relative",
            interactive && "cursor-pointer transition-transform hover:scale-110 active:scale-95"
          )}
          onMouseEnter={() => interactive && setHoverRating(i)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          onClick={() => interactive && onRate?.(i)}
        >
          {isFull ? (
            <Star className={cn(iconSize, "fill-warning-500 text-warning-500")} />
          ) : isHalf ? (
            <StarHalf className={cn(iconSize, "fill-warning-500 text-warning-500")} />
          ) : (
            <Star className={cn(iconSize, "text-gray-200")} />
          )}
        </div>
      )
    }
    return stars
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {renderStars()}
      </div>
      
      {!interactive && totalReviews !== undefined && (
        <span className="text-xs text-gray-400 font-medium">
          ({totalReviews})
        </span>
      )}
    </div>
  )
}
