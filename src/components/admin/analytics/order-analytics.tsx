/**
 * @file order-analytics.tsx
 * @description Order-focused analytics tab.
 *              Visualizes order funnel, hourly heatmap, and status distribution.
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
  Cell,
  PieChart,
  Pie
} from "recharts"

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

const FUNNEL_DATA = [
  { name: "Placed", value: 120, color: "#9ca3af" },
  { name: "Confirmed", value: 112, color: "#3b82f6" },
  { name: "Shipped", value: 95, color: "#8b5cf6" },
  { name: "Delivered", value: 88, color: "#10b981" },
]

const STATUS_PIE = [
  { name: "Delivered", value: 70, color: "#10b981" },
  { name: "Cancelled", value: 15, color: "#ef4444" },
  { name: "Returned", value: 10, color: "#f59e0b" },
  { name: "Other", value: 5, color: "#9ca3af" },
]

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export function OrderAnalytics() {
  return (
    <div className="flex flex-col gap-10">
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col gap-2">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fulfillment Rate</span>
          <span className="text-2xl font-black text-gray-900">88.5%</span>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[88.5%]" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col gap-2">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg. Delivery Time</span>
          <span className="text-2xl font-black text-gray-900">3.2 Days</span>
          <span className="text-[10px] font-bold text-primary uppercase">-0.5 from last mo</span>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col gap-2">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cancellation Rate</span>
          <span className="text-2xl font-black text-gray-900">4.2%</span>
          <span className="text-[10px] font-bold text-red-500 uppercase">+1.1% increase</span>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col gap-2">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Orders</span>
          <span className="text-2xl font-black text-gray-900">42</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase">Awaiting Action</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Order Funnel */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Fulfillment Funnel</h3>
          <div className="h-[400px] w-full bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={FUNNEL_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: 800, fill: '#374151' }}
                />
                <YAxis hide />
                <Tooltip cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={60}>
                  {FUNNEL_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Lifetime Status</h3>
          <div className="h-[400px] w-full bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={STATUS_PIE}
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {STATUS_PIE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-gray-900 leading-none">1.2k</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
