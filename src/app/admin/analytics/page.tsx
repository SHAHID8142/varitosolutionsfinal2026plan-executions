/**
 * @file page.tsx
 * @path /admin/analytics
 * @description Admin Analytics dashboard.
 *              Modular tab-based view for Revenue, Orders, and Products.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { BarChart3, TrendingUp, ShoppingBag, Package, Calendar, Users } from "lucide-react"
import { RevenueAnalytics } from "@/components/admin/analytics/revenue-analytics"
import { OrderAnalytics } from "@/components/admin/analytics/order-analytics"
import { ProductAnalytics } from "@/components/admin/analytics/product-analytics"
import { CustomerAnalytics } from "@/components/admin/analytics/customer-analytics"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = React.useState<"revenue" | "orders" | "products" | "customers">("revenue")

  const tabs = [
    { id: "revenue", label: "Revenue", icon: TrendingUp },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "products", label: "Products", icon: Package },
    { id: "customers", label: "Customers", icon: Users },
  ]

  return (
    <div className="flex flex-col gap-10">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BarChart3 className="size-6" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">Analytics</h1>
          </div>
          <p className="text-gray-500 font-medium">Business intelligence and performance tracking for Varito Solutions.</p>
        </div>
        
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <Calendar className="size-4 text-gray-400 ml-2" />
          <Button variant="ghost" size="sm" className="rounded-xl font-bold text-emerald-600 bg-emerald-50">Last 7 Days</Button>
          <Button variant="ghost" size="sm" className="rounded-xl font-bold text-gray-400 hover:text-gray-600">30 Days</Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-4 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "revenue" | "orders" | "products" | "customers")}
              className={cn(
                "flex items-center gap-3 px-8 h-14 rounded-2xl transition-all duration-300 shrink-0",
                isActive 
                  ? "bg-emerald-600 text-white font-black shadow-lg shadow-emerald-200" 
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-600 font-bold"
              )}
            >
              <Icon className="size-5" />
              <span className="text-sm uppercase tracking-widest">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <main className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[600px]">
        {activeTab === "revenue" && <RevenueAnalytics />}
        {activeTab === "orders" && <OrderAnalytics />}
        {activeTab === "products" && <ProductAnalytics />}
        {activeTab === "customers" && <CustomerAnalytics />}
      </main>

    </div>
  )
}
