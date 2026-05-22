/**
 * @file product-analytics.tsx
 * @description Product performance analytics tab.
 *              Ranked products by revenue and units sold.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from "recharts"
import { Package, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

const TOP_PRODUCTS = [
  { name: "Emerald Faucet", revenue: 85000, units: 22 },
  { name: "Packaging Tape", revenue: 64200, units: 85 },
  { name: "Bubble Wrap", revenue: 42000, units: 120 },
  { name: "Kitchen Tap", revenue: 38500, units: 12 },
  { name: "Shower Set", revenue: 29000, units: 5 },
]

const LOW_STOCK = [
  { name: "Gold Mixer", sku: "VR-SAN-005", stock: 2 },
  { name: "50m Tape", sku: "VR-PKG-010", stock: 4 },
]

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export function ProductAnalytics() {
  return (
    <div className="flex flex-col gap-10">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Top Products Chart */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Top Products by Revenue</h3>
          <div className="h-[400px] w-full bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={TOP_PRODUCTS} layout="vertical" margin={{ left: 40, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: 800, fill: '#374151' }}
                  width={100}
                />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="revenue" fill="#10b981" radius={[0, 10, 10, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Stock Warnings</h3>
          <div className="flex flex-col gap-4">
            {LOW_STOCK.map((item) => (
              <div key={item.sku} className="p-6 rounded-[32px] bg-red-50 border border-red-100 flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-black text-gray-900">{item.name}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.sku}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="destructive" className="h-6 px-2">{item.stock} Left</Badge>
                  <AlertTriangle className="size-4 text-red-500" />
                </div>
              </div>
            ))}
            <div className="p-8 rounded-[40px] bg-gray-900 text-white flex flex-col gap-4 relative overflow-hidden mt-4">
              <Package className="absolute -right-8 -bottom-8 size-32 text-white/5 rotate-12" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 relative z-10">Inventory Health</span>
              <p className="text-sm font-bold relative z-10">85% of your catalog is in high-stock status.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
