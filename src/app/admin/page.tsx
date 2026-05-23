/**
 * @file page.tsx
 * @path /admin
 * @description Admin Dashboard overview page.
 *              Displays key business metrics, recent orders, and performance charts.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight,
  Package,
} from "lucide-react"
import { StatsCard } from "@/components/admin/stats-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

const RECENT_ORDERS = [
  { id: "VR-0001", customer: "Karim Ahmed", date: "2 mins ago", total: 4500, status: "pending", payment: "COD" },
  { id: "VR-0002", customer: "Sultana Begum", date: "15 mins ago", total: 3200, status: "confirmed", payment: "bKash" },
  { id: "VR-0003", customer: "Tanvir Hasan", date: "45 mins ago", total: 1250, status: "shipped", payment: "Nagad" },
  { id: "VR-0004", customer: "Nabila Tabassum", date: "2 hours ago", total: 5800, status: "delivered", payment: "Card" },
  { id: "VR-0005", customer: "Rafiqul Islam", date: "5 hours ago", total: 850, status: "pending", payment: "COD" },
]

const LOW_STOCK_PRODUCTS = [
  { name: "Premium Kitchen Mixer Tap", sku: "VR-SAN-002", stock: 4, category: "Sanitary" },
  { name: "Bubble Wrap (50 Meter)", sku: "VR-PKG-012", stock: 8, category: "Packaging" },
  { name: "Luxury Emerald Gold Faucet", sku: "VR-SAN-001", stock: 2, category: "Sanitary" },
]

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">Dashboard</h1>
          <p className="text-sm md:text-base text-gray-500 font-medium">Welcome back, here&apos;s what&apos;s happening with Varito Solutions today.</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="outline" className="flex-1 md:flex-none h-11 md:h-12 rounded-xl font-bold border-gray-200 bg-white">
            Export Report
          </Button>
          <Button className="flex-1 md:flex-none h-11 md:h-12 rounded-xl font-black shadow-lg shadow-primary/20">
            New Product +
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          label="Today's Revenue" 
          value="৳42,500" 
          trend="up" 
          trendValue="+12.5%" 
          icon={TrendingUp} 
        />
        <StatsCard 
          label="Pending Orders" 
          value="18" 
          trend="down" 
          trendValue="-2 today" 
          icon={ShoppingBag} 
        />
        <StatsCard 
          label="Total Customers" 
          value="1,248" 
          trend="up" 
          trendValue="+45 this week" 
          icon={Users} 
        />
        <StatsCard 
          label="Low Stock Alerts" 
          value="07" 
          trend="neutral" 
          trendValue="Needs Action" 
          icon={AlertTriangle} 
          className="border-red-100 bg-red-50/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Recent Orders</h2>
            <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/5">
              View All Orders <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {RECENT_ORDERS.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-black text-gray-900">{order.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-600">{order.customer}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-gray-400">{order.date}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-black text-gray-900">৳{order.total}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant={
                            order.status === "delivered" ? "verified" : 
                            order.status === "pending" ? "outline" : 
                            "default"
                          }
                          className={cn(
                            "uppercase text-[10px]",
                            order.status === "pending" && "border-amber-200 text-amber-600 bg-amber-50",
                            order.status === "confirmed" && "border-primary/30 text-primary bg-primary/5"
                          )}
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                          <ArrowRight className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Alerts / Secondary info */}
        <div className="lg:col-span-4 flex flex-col gap-10">
          
          {/* Inventory Alerts */}
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Inventory Alerts</h2>
            <div className="flex flex-col gap-4">
              {LOW_STOCK_PRODUCTS.map((prod) => (
                <div key={prod.sku} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-between group hover:border-red-200 transition-colors">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-black text-gray-900 line-clamp-1">{prod.name}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{prod.sku}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">{prod.stock} Left</Badge>
                    <span className="text-[10px] font-bold text-gray-400">{prod.category}</span>
                  </div>
                </div>
              ))}
              <Button variant="secondary" className="w-full rounded-xl bg-gray-100 border-none font-bold text-xs h-12 uppercase tracking-widest">
                Manage Inventory
              </Button>
            </div>
          </div>

          {/* Quick Actions / Tips */}
          <div className="p-8 rounded-[40px] bg-emerald-950 text-white flex flex-col gap-6 relative overflow-hidden">
            <div className="relative z-10 flex flex-col gap-4">
              <Badge className="w-fit bg-primary text-emerald-950 font-black border-none uppercase tracking-widest text-[9px]">Admin Pro Tip</Badge>
              <h3 className="text-xl font-black uppercase tracking-tight">Bulk Order Efficiency</h3>
              <p className="text-primary/20/60 text-sm font-medium leading-relaxed">
                You have 5 orders waiting for the same &quot;Emerald Faucet&quot; SKU. Print their labels together to save processing time.
              </p>
              <Button className="mt-2 bg-white text-emerald-950 hover:bg-primary/5 font-black rounded-xl h-12 uppercase tracking-widest text-xs">
                View Pending
              </Button>
            </div>
            <Package className="absolute -bottom-10 -right-10 size-48 text-primary/30 rotate-12" />
          </div>

        </div>

      </div>

    </div>
  )
}
