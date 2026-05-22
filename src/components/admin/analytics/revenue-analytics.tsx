/**
 * @file revenue-analytics.tsx
 * @description Revenue-focused analytics tab with line and bar charts.
 *              Visualizes total revenue, growth, and payment method distribution.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Wallet } from "lucide-react"

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

const REVENUE_DATA = [
  { date: "May 16", amount: 32000, orders: 42 },
  { date: "May 17", amount: 28500, orders: 38 },
  { date: "May 18", amount: 45000, orders: 55 },
  { date: "May 19", amount: 39000, orders: 48 },
  { date: "May 20", amount: 52000, orders: 62 },
  { date: "May 21", amount: 48000, orders: 58 },
  { date: "May 22", amount: 42500, orders: 50 },
]

const PAYMENT_METHODS = [
  { name: "COD", value: 65, color: "#f97316" },
  { name: "bKash", value: 25, color: "#be185d" },
  { name: "Nagad", value: 8, color: "#ea580c" },
  { name: "Card", value: 2, color: "#059669" },
]

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export function RevenueAnalytics() {
  return (
    <div className="flex flex-col gap-10">
      
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="size-6" />
            </div>
            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase">
              <TrendingUp className="size-3" /> +12.5%
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Revenue (7D)</span>
            <span className="text-3xl font-black text-gray-900 tracking-tight">৳2,87,000</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="size-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="size-6" />
            </div>
            <div className="flex items-center gap-1 text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase">
              <TrendingUp className="size-3" /> +4.2%
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Avg. Order Value</span>
            <span className="text-3xl font-black text-gray-900 tracking-tight">৳4,520</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="size-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Wallet className="size-6" />
            </div>
            <div className="flex items-center gap-1 text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded-lg uppercase">
              <TrendingDown className="size-3" /> -2%
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">COD Recovery Rate</span>
            <span className="text-3xl font-black text-gray-900 tracking-tight">92%</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Revenue Trend */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Revenue Trend (Last 7 Days)</h3>
          <div className="h-[400px] w-full bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                  tickFormatter={(val) => `৳${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 700 }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Payment Mix</h3>
          <div className="h-[400px] w-full bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={PAYMENT_METHODS} layout="vertical" margin={{ left: 0, right: 30 }}>
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 800, fill: '#374151' }}
                  width={60}
                />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={32}>
                  {PAYMENT_METHODS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 w-full mt-4">
              {PAYMENT_METHODS.map((method) => (
                <div key={method.name} className="flex items-center gap-2">
                  <div className="size-3 rounded-full" style={{ backgroundColor: method.color }} />
                  <span className="text-[10px] font-black text-gray-500 uppercase">{method.name} ({method.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
