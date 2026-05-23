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
  TrendingUp, 
  AlertTriangle, 
  ArrowRight,
  Package,
} from "lucide-react"
import { StatsCard } from "@/components/admin/stats-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface DashboardData {
  today: {
    orders: number
    revenue: number
  }
  thisWeek: {
    orders: number
    revenue: number
    changePercent: number
  }
  thisMonth: {
    revenue: number
  }
  pendingOrders: number
  lowStockAlerts: {
    id: string
    name: string
    stock: number
    slug: string
  }[]
  recentOrders: {
    id: string
    orderNumber: string
    status: string
    paymentStatus: string
    total: number
    customerName: string
    createdAt: string
  }[]
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [data, setData] = React.useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchDashboard() {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("sb-access-token="))
          ?.split("=")[1]

        const response = await fetch("/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data")
        }

        const result = await response.json()
        setData(result.data)
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : "An unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 animate-pulse">
        <div className="h-20 bg-gray-200 rounded-2xl w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 h-96 bg-gray-200 rounded-3xl" />
          <div className="lg:col-span-4 h-96 bg-gray-200 rounded-3xl" />
        </div>
      </div>
    )
  }

  if (!data) return null

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
          value={`৳${data.today.revenue.toLocaleString()}`} 
          trend={data.thisWeek.changePercent >= 0 ? "up" : "down"} 
          trendValue={`${data.thisWeek.changePercent >= 0 ? "+" : ""}${data.thisWeek.changePercent}%`} 
          icon={TrendingUp} 
        />
        <StatsCard 
          label="Pending Orders" 
          value={data.pendingOrders.toString()} 
          trend={data.pendingOrders > 10 ? "up" : "down"} 
          trendValue={data.pendingOrders > 10 ? "Needs action" : "Managed"} 
          icon={ShoppingBag} 
        />
        <StatsCard 
          label="Today's Orders" 
          value={data.today.orders.toString()} 
          trend="up" 
          trendValue="Live" 
          icon={Package} 
        />
        <StatsCard 
          label="Low Stock Alerts" 
          value={data.lowStockAlerts.length.toString().padStart(2, '0')} 
          trend="neutral" 
          trendValue="Check inventory" 
          icon={AlertTriangle} 
          className={cn(data.lowStockAlerts.length > 0 && "border-red-100 bg-red-50/10")}
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
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.recentOrders.length > 0 ? (
                    data.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-black text-gray-900">#{order.orderNumber}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-gray-600">{order.customerName}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-black text-gray-900">৳{order.total.toLocaleString()}</span>
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-bold">
                        No orders yet.
                      </td>
                    </tr>
                  )}
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
              {data.lowStockAlerts.length > 0 ? (
                data.lowStockAlerts.map((prod) => (
                  <div key={prod.id} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-between group hover:border-red-200 transition-colors">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-black text-gray-900 line-clamp-1">{prod.name}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {prod.id}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">{prod.stock} Left</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-xs font-bold text-gray-400">All products in stock!</p>
                </div>
              )}
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
                Check pending orders frequently to ensure fast fulfillment for our Chattogram customers.
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

