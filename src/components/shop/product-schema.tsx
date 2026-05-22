/**
 * @file product-schema.tsx
 * @description JSON-LD structured data for Product SEO.
 *              Helps search engines understand product details, pricing, and availability.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import * as React from "react"

interface ProductSchemaProps {
  name: string
  description: string
  image: string
  sku: string
  price: number
  currency?: string
  availability?: string
}

export function ProductSchema({
  name,
  description,
  image,
  sku,
  price,
  currency = "BDT",
  availability = "https://schema.org/InStock",
}: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": name,
    "image": [image],
    "description": description,
    "sku": sku,
    "offers": {
      "@type": "Offer",
      "url": typeof window !== "undefined" ? window.location.href : "",
      "priceCurrency": currency,
      "price": price,
      "availability": availability,
      "itemCondition": "https://schema.org/NewCondition",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
