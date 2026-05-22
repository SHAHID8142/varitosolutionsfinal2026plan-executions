/**
 * @file order-card.tsx
 * @description Card component for displaying an order summary in the customer's order history.
 *              Includes order ID, date, status badge, and total price.
 *
 * @props id | date | status | total | itemCount | thumbnail
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format-price"

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

interface OrderCardProps {
  id: string
  date: string
  status: OrderStatus
  total: number
  itemCount: number
  thumbnail?: string
  className?: string
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "outline" | "verified" | "destructive" }> = {
  pending: { label: "Pending", variant: "secondary" },
  processing: { label: "Processing", variant: "outline" },
  shipped: { label: "Shipped", variant: "default" },
  delivered: { label: "Delivered", variant: "verified" },
  cancelled: { label: "Cancelled", variant: "destructive" },
}

export function OrderCard({
  id,
  date,
  status,
  total,
  itemCount,
  thumbnail,
  className,
}: OrderCardProps) {
  const config = STATUS_CONFIG[status]

  return (
    <div className={cn(
      "group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all hover:shadow-md",
      className
    )}>
      {/* Order Icon or Thumbnail */}
      <div className="relative size-16 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-50 overflow-hidden shrink-0">
        {thumbnail ? (
          <Image src={thumbnail} alt="Order thumbnail" fill className="object-cover" sizes="64px" />
        ) : (
          <Package className="size-8 text-gray-300" />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-black text-gray-900 uppercase tracking-tight">Order #{id}</span>
          <Badge variant={config.variant} className="h-5 px-2 text-[9px] uppercase font-black">
            {config.label}
          </Badge>
        </div>
        <p className="text-xs text-gray-500 font-medium">
          Placed on {date} • {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
        </p>
      </div>

      {/* Price & Action */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-0 border-gray-50 mt-2 sm:mt-0">
        <div className="flex flex-col sm:items-end">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Grand Total</span>
          <span className="text-base font-black text-gray-900">{formatPrice(total)}</span>
        </div>
        
        <Link href={`/order/${id}`} className="shrink-0">
          <Button variant="ghost" size="sm" className="gap-2 font-bold text-primary group-hover:bg-primary-50">
            Details <ChevronRight className="size-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
