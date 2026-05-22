/**
 * @file order-timeline.tsx
 * @description Vertical timeline showing the history of an order.
 *              Displays status changes, timestamps, and optional admin notes.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import * as React from "react"
import { CheckCircle2, Clock, Truck, Package, XCircle, RotateCcw, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { type OrderStatus } from "./order-status-badge"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface TimelineEvent {
  status: OrderStatus | "note"
  title: string
  description?: string
  timestamp: string
  user?: string
}

interface OrderTimelineProps {
  events: TimelineEvent[]
  className?: string
}

const STATUS_ICONS = {
  pending: Clock,
  confirmed: CheckCircle2,
  shipped: Truck,
  delivered: Package,
  cancelled: XCircle,
  returned: RotateCcw,
  note: User,
}

const STATUS_COLORS = {
  pending: "text-amber-500 bg-amber-50 border-amber-100",
  confirmed: "text-blue-500 bg-blue-50 border-blue-100",
  shipped: "text-purple-500 bg-purple-50 border-purple-100",
  delivered: "text-emerald-500 bg-emerald-50 border-emerald-100",
  cancelled: "text-red-500 bg-red-50 border-red-100",
  returned: "text-gray-500 bg-gray-50 border-gray-100",
  note: "text-gray-900 bg-gray-100 border-gray-200",
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export function OrderTimeline({ events, className }: OrderTimelineProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {events.map((event, index) => {
        const Icon = STATUS_ICONS[event.status] || Clock
        const isLast = index === events.length - 1

        return (
          <div key={index} className="flex gap-4 group">
            {/* Left Line & Icon */}
            <div className="flex flex-col items-center">
              <div className={cn(
                "size-10 rounded-xl border flex items-center justify-center shrink-0 z-10",
                STATUS_COLORS[event.status]
              )}>
                <Icon className="size-5" />
              </div>
              {!isLast && (
                <div className="w-0.5 flex-1 bg-gray-100 my-1 group-hover:bg-emerald-100 transition-colors" />
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 pb-10">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-gray-900">{event.title}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{event.timestamp}</span>
              </div>
              {event.description && (
                <p className="text-xs font-medium text-gray-500 leading-relaxed bg-gray-50/50 p-3 rounded-xl border border-gray-50 mt-1">
                  {event.description}
                </p>
              )}
              {event.user && (
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="size-4 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="size-2.5 text-gray-500" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">by {event.user}</span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
