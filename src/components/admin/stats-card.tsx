/**
 * @file stats-card.tsx
 * @description Metric card for admin dashboard.
 *              Displays a single business metric with optional trend indicator.
 *
 * @props label | value | trend | trendValue | icon
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface StatsCardProps {
  label: string
  value: string | number
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  icon: LucideIcon
  className?: string
}

export function StatsCard({
  label,
  value,
  trend,
  trendValue,
  icon: Icon,
  className,
}: StatsCardProps) {
  return (
    <div className={cn(
      "group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/40",
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-colors group-hover:bg-emerald-600 group-hover:text-white">
          <Icon className="size-6" />
        </div>
        
        {trend && trendValue && (
          <div className={cn(
            "flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
            trend === "up" && "bg-emerald-50 text-emerald-600",
            trend === "down" && "bg-red-50 text-red-600",
            trend === "neutral" && "bg-gray-50 text-gray-500"
          )}>
            {trend === "up" && <ArrowUpRight className="size-3" />}
            {trend === "down" && <ArrowDownRight className="size-3" />}
            {trendValue}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</span>
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{value}</h3>
      </div>
    </div>
  )
}
