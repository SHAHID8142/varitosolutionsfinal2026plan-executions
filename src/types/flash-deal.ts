/**
 * @file flash-deal.ts
 * @description Type definitions for Flash Deals.
 *              Used in admin management and homepage display.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

import { ProductListItem } from "./product"

export interface FlashDeal {
  id: number
  productId: number
  product?: ProductListItem
  flashPrice: number
  startsAt: string | Date
  endsAt: string | Date
  maxQty: number | null
  soldQty: number
  isActive: boolean
  createdBy?: string
  createdAt: string | Date
}

export type FlashDealStatus = "active" | "scheduled" | "expired" | "deactivated"
