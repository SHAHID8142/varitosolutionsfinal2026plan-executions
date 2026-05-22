/**
 * @file category-card.tsx
 * @description Card component for displaying a product category.
 *              Includes an image, name, and product count.
 *
 * @props name | slug | image | productCount
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface CategoryCardProps {
  name: string
  nameBn?: string
  slug: string
  image: string
  productCount?: number
  className?: string
}

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
        "group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/40",
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
      <div className="text-center">
        <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
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
