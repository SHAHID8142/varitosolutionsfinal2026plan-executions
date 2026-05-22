/**
 * @file customer-analytics.tsx
 * @description Customer behavior and geographic analytics tab.
 *              Visualizes new vs returning and top districts.
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
  PieChart,
  Pie,
  Cell
} from "recharts"

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

const CUSTOMER_TYPE = [
  { name: "New", value: 350, color: "#10b981" },
  { name: "Returning", value: 898, color: "#3b82f6" },
]

const TOP_DISTRICTS = [
  { name: "Dhaka", count: 450 },
  { name: "Chattogram", count: 280 },
  { name: "Gazipur", count: 120 },
  { name: "Narayanganj", count: 95 },
  { name: "Sylhet", count: 82 },
]

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export function CustomerAnalytics() {
  return (
    <div className="flex flex-col gap-10">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Geographic Breakdown */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Orders by District</h3>
          <div className="h-[400px] w-full bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={TOP_DISTRICTS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: 800, fill: '#374151' }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
                <Tooltip cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[12, 12, 0, 0]} barSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Mix */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Customer Retention</h3>
          <div className="h-[400px] w-full bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={CUSTOMER_TYPE}
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CUSTOMER_TYPE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-gray-900 leading-none">72%</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Repeat Rate</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
