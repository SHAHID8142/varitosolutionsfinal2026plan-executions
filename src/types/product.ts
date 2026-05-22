/**
 * @file product.ts
 * @description Shared product type definitions for API responses.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-22
 */

export interface ProductListItem {
  id: number
  slug: string
  name: string
  nameBn: string | null
  price: number
  salePrice: number | null
  images: string[]
  stock: number
  category: { id: number; name: string; slug: string } | null
  isNew: boolean
  discountPercent: number | null
}

export interface ProductDetail extends ProductListItem {
  description: string | null
  descriptionBn: string | null
  unit: string
  minOrderQty: number
  sku: string
  category: {
    id: number
    name: string
    slug: string
    parent?: { id: number; name: string; slug: string } | null
  } | null
}
