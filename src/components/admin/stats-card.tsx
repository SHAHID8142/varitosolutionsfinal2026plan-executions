/**
 * @file stats-card.tsx
 * @description Metric card for admin dashboard.
 *              Displays a single business metric with optional trend indicator.
 *
 * @props label | value | trend | trendValue | icon
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

// No hooks or browser APIs — server component is safe here
import * as React from "react"
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface StatsCardProps {
  label: string
  value: string | number
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  icon: LucideIcon
  className?: string
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

/**
 * Admin dashboard metric card.
 * Shows an icon, a trend indicator, a label, and the current value.
 * Icon area uses primary color tokens for hover transition.
 */
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
      "group bg-white p-6 rounded-2xl border border-[var(--color-border)] shadow-sm transition-all duration-200 hover:shadow-xl hover:shadow-gray-200/40",
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        {/* Icon uses primary color tokens for consistency with design system */}
        <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-6" />
        </div>

        {trend && trendValue && (
          <div className={cn(
            "flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
            trend === "up" && "bg-primary/10 text-primary",
            trend === "down" && "bg-destructive/10 text-destructive",
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
