/**
 * @file category-schema.tsx
 * @description JSON-LD structured data for Category SEO.
 *              Helps search engines understand category hierarchy and products.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

import * as React from "react"

interface CategorySchemaProps {
  name: string
  description: string
  url: string
  image?: string
}

export function CategorySchema({
  name,
  description,
  url,
  image,
}: CategorySchemaProps) {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "CollectionPage",
    "name": name,
    "description": description,
    "url": url,
    "image": image ? [image] : undefined,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": 0, // Placeholder
      "itemListElement": [] // Placeholder for products
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
