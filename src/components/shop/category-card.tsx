/**
 * @file category-card.tsx
 * @description Card component for displaying a product category.
 *              Includes an image, name, and product count.
 *              The entire card is a Link — meets touch target via min padding.
 *
 * @props name | slug | image | productCount
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface CategoryCardProps {
  name: string
  nameBn?: string
  slug: string
  image: string
  productCount?: number
  className?: string
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

/**
 * Category card linking to /category/[slug].
 * The min-h-[44px] on the text area ensures the card meets touch targets
 * even when the image is hidden (edge case).
 */
export function CategoryCard({
  name,
  slug,
  image,
  productCount,
  className,
}: CategoryCardProps) {
  return (
    <Link
      href={`/category/${slug}`}
      className={cn(
        "group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/40",
        className
      )}
    >
      {/* Image Circle */}
      <div className="relative size-20 overflow-hidden rounded-full bg-gray-50 md:size-24">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 80px, 96px"
        />
      </div>

      {/* Content */}
      <div className="text-center min-h-[44px] flex flex-col justify-center">
        <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors duration-200">
          {name}
        </h3>
        {productCount !== undefined && (
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            {productCount} Products
          </p>
        )}
      </div>
    </Link>
  )
}
