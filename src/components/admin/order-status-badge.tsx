/**
 * @file order-status-badge.tsx
 * @description Color-coded status badge for orders in the Admin Panel.
 *              Standardizes status visualization across tables and detail pages.
 *              Updated with granular e-commerce workflow.
 *              Status colors use Tailwind semantic color tokens (not raw hex values);
 *              each status has its own distinct hue for quick visual scanning.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type OrderStatus = 
  | "pending" 
  | "approved"
  | "packing"
  | "shipping" 
  | "handover"
  | "delivered" 
  | "not_received"
  | "cancelled" 
  | "returned"
  | "refunded"

interface OrderStatusBadgeProps {
  status: OrderStatus
  className?: string
}

const STATUS_CONFIG: Record<OrderStatus, { label: string, className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-600 border-amber-100",
  },
  approved: {
    label: "Approved",
    className: "bg-blue-50 text-blue-600 border-blue-100",
  },
  packing: {
    label: "Packing",
    className: "bg-cyan-50 text-cyan-600 border-cyan-100",
  },
  shipping: {
    label: "Shipping",
    className: "bg-purple-50 text-purple-600 border-purple-100",
  },
  handover: {
    label: "Handover",
    className: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  delivered: {
    label: "Delivered",
    className: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  not_received: {
    label: "Not Received",
    className: "bg-orange-50 text-orange-600 border-orange-100",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-600 border-red-100",
  },
  returned: {
    label: "Returned",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
  refunded: {
    label: "Refunded",
    className: "bg-pink-50 text-pink-600 border-pink-100",
  },
}

/**
 * Renders a color-coded badge for a given order status.
 * Falls back to "pending" config if an unknown status is passed.
 */
export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "uppercase text-[10px] font-black tracking-widest px-2.5 py-0.5 rounded-full whitespace-nowrap",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  )
}
