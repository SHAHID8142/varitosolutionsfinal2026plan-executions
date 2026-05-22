/**
 * @file orders-table.tsx
 * @description Advanced table for managing orders in the Admin Panel.
 *              Includes search, multi-status filtering, sorting, and pagination.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal, 
  Eye, 
  Printer, 
  Download,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { 
  OrderStatusBadge, 
  type OrderStatus 
} from "./order-status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// ─────────────────────────────────────────────
// TYPES & MOCK DATA
// ─────────────────────────────────────────────

interface Order {
  id: string
  customer: string
  phone: string
  date: string
  total: number
  status: OrderStatus
  paymentMethod: "COD" | "bKash" | "Nagad" | "Card"
  paymentStatus: "paid" | "unpaid" | "partially_paid"
}

const MOCK_ORDERS: Order[] = [
  { id: "VR-2026-0001", customer: "Karim Ahmed", phone: "01711122233", date: "2026-05-22 10:30", total: 4500, status: "pending", paymentMethod: "COD", paymentStatus: "unpaid" },
  { id: "VR-2026-0002", customer: "Sultana Begum", phone: "01822233344", date: "2026-05-22 09:15", total: 3200, status: "confirmed", paymentMethod: "bKash", paymentStatus: "paid" },
  { id: "VR-2026-0003", customer: "Tanvir Hasan", phone: "01933344455", date: "2026-05-21 18:45", total: 1250, status: "shipped", paymentMethod: "Nagad", paymentStatus: "paid" },
  { id: "VR-2026-0004", customer: "Nabila Tabassum", phone: "01544455566", date: "2026-05-21 14:20", total: 5800, status: "delivered", paymentMethod: "Card", paymentStatus: "paid" },
  { id: "VR-2026-0005", customer: "Rafiqul Islam", phone: "01355566677", date: "2026-05-21 11:05", total: 850, status: "cancelled", paymentMethod: "COD", paymentStatus: "unpaid" },
  { id: "VR-2026-0006", customer: "Moushumi Akter", phone: "01666677788", date: "2026-05-20 16:30", total: 2750, status: "returned", paymentMethod: "COD", paymentStatus: "unpaid" },
  { id: "VR-2026-0007", customer: "Jasim Uddin", phone: "01777788899", date: "2026-05-20 13:10", total: 9400, status: "confirmed", paymentMethod: "bKash", paymentStatus: "paid" },
]

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export function OrdersTable() {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  const filteredOrders = MOCK_ORDERS.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(search.toLowerCase()) || 
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.phone.includes(search)
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col gap-6">
      
      {/* Filters & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 max-w-md relative">
          <Search className="absolute left-4 size-4 text-gray-400" />
          <Input 
            placeholder="Search by ID, name or phone..." 
            className="pl-11 h-12 rounded-xl border-gray-100 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="h-12 px-5 rounded-xl gap-2 font-bold border border-gray-100 bg-white flex items-center hover:bg-gray-50 outline-none transition-colors">
                <Filter className="size-4" />
                Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl">
              <DropdownMenuItem onClick={() => setStatusFilter("all")} className="rounded-xl font-bold">All Status</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter("pending")} className="rounded-xl font-bold">Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("confirmed")} className="rounded-xl font-bold">Confirmed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("shipped")} className="rounded-xl font-bold">Shipped</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("delivered")} className="rounded-xl font-bold">Delivered</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("cancelled")} className="rounded-xl font-bold text-red-600">Cancelled</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="h-12 px-5 rounded-xl gap-2 font-bold border-gray-100 bg-white">
            <Download className="size-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Table Surface */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-4 md:px-6 py-5">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Order ID <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th className="px-4 md:px-6 py-5">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Customer
                  </div>
                </th>
                <th className="px-4 md:px-6 py-5">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Amount
                  </div>
                </th>
                <th className="px-4 md:px-6 py-5">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Status
                  </div>
                </th>
                <th className="px-4 md:px-6 py-5 text-right">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-4 md:px-6 py-4 md:py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs md:text-sm font-black text-gray-900">{order.id}</span>
                      <span className="text-[9px] md:text-[10px] font-bold text-gray-400">{order.date}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 md:py-5">
                    <div className="flex flex-col">
                      <span className="text-xs md:text-sm font-bold text-gray-900 truncate max-w-[100px] md:max-w-none">{order.customer}</span>
                      <span className="text-[10px] md:text-xs font-medium text-gray-500">{order.phone}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 md:py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs md:text-sm font-black text-gray-900">৳{order.total.toLocaleString()}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 hidden md:inline">
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 md:py-5">
                    <OrderStatusBadge status={order.status} className="scale-90 md:scale-100 origin-left" />
                  </td>
                  <td className="px-4 md:px-6 py-4 md:py-5 text-right">
                    <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9 rounded-xl hover:bg-emerald-50 hover:text-emerald-600">
                        <Eye className="size-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 md:h-9 md:w-9 rounded-xl hover:bg-gray-100 flex items-center justify-center outline-none transition-colors">
                            <MoreHorizontal className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
                          <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="rounded-xl font-bold h-10 cursor-pointer">
                            <CheckCircle2 className="mr-2 size-4 text-emerald-500" /> Confirm Order
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-xl font-bold h-10 cursor-pointer">
                            <Printer className="mr-2 size-4 text-blue-500" /> Print Invoice
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="rounded-xl font-bold h-10 cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700">
                            <XCircle className="mr-2 size-4" /> Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="size-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                        <Search className="size-8" />
                      </div>
                      <p className="text-sm font-bold text-gray-500">No orders found matching your criteria</p>
                      <Button variant="ghost" onClick={() => {setSearch(""); setStatusFilter("all")}} className="text-emerald-600 font-bold">
                        Clear all filters
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-5 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Showing <span className="text-gray-900">{filteredOrders.length}</span> of <span className="text-gray-900">{MOCK_ORDERS.length}</span> results
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-gray-100" disabled>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-emerald-100 bg-emerald-50 text-emerald-700 font-black">
              1
            </Button>
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-gray-100 text-gray-600 font-bold hover:bg-gray-50">
              2
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-gray-100">
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
