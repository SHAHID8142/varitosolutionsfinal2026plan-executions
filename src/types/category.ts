/**
 * @file category.ts
 * @description Shared category type definitions for API responses.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-22
 */

export interface CategoryNode {
  id: number
  name: string
  nameBn: string | null
  slug: string
  image: string | null
  productCount: number
  children?: CategoryNode[]
}
