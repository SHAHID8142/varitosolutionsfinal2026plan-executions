/**
 * @file image-gallery.tsx
 * @description Product image gallery with main image preview and thumbnails.
 *              Optimized for mobile-first interaction.
 *              Thumbnail buttons are 64×64px (above 44px minimum touch target).
 *
 * @props images (string array)
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface ImageGalleryProps {
  images: string[]
  className?: string
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

/**
 * Product image gallery with main image and thumbnail strip.
 * Navigation arrows appear on hover (desktop) and are always accessible via aria-label.
 */
export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0)

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Main Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 group">
        <Image
          src={images[activeIndex]}
          alt={`Product image ${activeIndex + 1}`}
          fill
          className="object-contain p-4 transition-all duration-500"
          priority
          sizes="(max-width: 768px) 100vw, 600px"
        />

        {/* Navigation Arrows (visible on hover) */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handlePrev}
              aria-label="Previous image"
            >
              <ChevronLeft className="size-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleNext}
              aria-label="Next image"
            >
              <ChevronRight className="size-6" />
            </Button>
          </>
        )}

        {/* Zoom Button (Visual only for now) */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm shadow-sm"
          aria-label="Zoom image"
        >
          <Maximize2 className="size-5" />
        </Button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={cn(
                "relative aspect-square size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                activeIndex === index
                  ? "border-primary ring-2 ring-primary-100"
                  : "border-transparent bg-gray-50 opacity-70 hover:opacity-100 hover:border-gray-200"
              )}
            >
              <Image
                src={img}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover p-1"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
