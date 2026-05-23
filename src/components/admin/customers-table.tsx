/**
 * @file customer-table.tsx
 * @description Advanced table for managing customers in the Admin Panel.
 *              Includes search by name/phone, filtering by status, and 
 *              high-level metrics for each customer.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  Ban, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  User,
  ShoppingBag,
  Calendar
} from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// ─────────────────────────────────────────────
// TYPES & MOCK DATA
// ─────────────────────────────────────────────

interface Customer {
  id: string
  name: string
  phone: string
  email: string
  orderCount: number
  totalSpent: number
  lastOrderDate: string
  status: "active" | "banned"
  joinedDate: string
}

const MOCK_CUSTOMERS: Customer[] = [
  { id: "1", name: "Karim Ahmed", phone: "01711122233", email: "karim.ahmed@example.com", orderCount: 12, totalSpent: 45200, lastOrderDate: "2026-05-20", status: "active", joinedDate: "2026-01-15" },
  { id: "2", name: "Sultana Begum", phone: "01822233344", email: "sultana.b@example.com", orderCount: 5, totalSpent: 12400, lastOrderDate: "2026-05-22", status: "active", joinedDate: "2026-02-10" },
  { id: "3", name: "Tanvir Hasan", phone: "01933344455", email: "tanvir.h@example.com", orderCount: 2, totalSpent: 3500, lastOrderDate: "2026-04-12", status: "active", joinedDate: "2026-04-01" },
  { id: "4", name: "Nabila Tabassum", phone: "01544455566", email: "nabila.t@example.com", orderCount: 0, totalSpent: 0, lastOrderDate: "Never", status: "active", joinedDate: "2026-05-18" },
  { id: "5", name: "Rafiqul Islam", phone: "01355566677", email: "rafiq.i@example.com", orderCount: 8, totalSpent: 28900, lastOrderDate: "2026-05-05", status: "banned", joinedDate: "2026-01-20" },
]

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

/** Advanced table for managing customers with search and status filtering. */
export function CustomerTable() {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")

  const filteredCustomers = MOCK_CUSTOMERS.filter(cust => {
    const matchesSearch = 
      cust.name.toLowerCase().includes(search.toLowerCase()) || 
      cust.phone.includes(search) ||
      cust.email.toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || cust.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const toggleStatus = (id: string, currentStatus: string) => {
    const action = currentStatus === "active" ? "banned" : "activated"
    toast.success(`Customer account ${action} successfully`)
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Filters Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 max-w-md relative">
          <Search className="absolute left-4 size-4 text-gray-400" />
          <Input 
            placeholder="Search name, phone or email..." 
            className="pl-11 h-12 rounded-xl border-gray-100 bg-white shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
          {["all", "active", "banned"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all",
                statusFilter === status
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table Surface */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-4 md:px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-4 md:px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stats</th>
                <th className="px-4 md:px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Activity</th>
                <th className="px-4 md:px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-4 md:px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-4 md:px-6 py-4 md:py-5">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="size-8 md:size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-[10px] md:text-xs shrink-0">
                        {cust.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs md:text-sm font-black text-gray-900 truncate max-w-[100px] md:max-w-none">{cust.name}</span>
                        <span className="text-[10px] md:text-xs font-medium text-gray-400 truncate">{cust.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 md:py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-gray-700">
                        <ShoppingBag className="size-3 text-primary" />
                        <span>{cust.orderCount} <span className="hidden md:inline">Orders</span></span>
                      </div>
                      <span className="text-[9px] md:text-[10px] font-black text-gray-900">৳{cust.totalSpent.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 md:py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-bold text-gray-500">
                        <Calendar className="size-2.5 md:size-3" />
                        <span className="truncate max-w-[60px] md:max-w-none">{cust.lastOrderDate}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 md:py-5">
                    <Badge 
                      variant={cust.status === "active" ? "verified" : "destructive"}
                      className="uppercase text-[8px] md:text-[9px] font-black tracking-widest px-1 md:px-2 h-4 md:h-5"
                    >
                      {cust.status}
                    </Badge>
                  </td>
                  <td className="px-4 md:px-6 py-4 md:py-5 text-right">
                    <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/customers/${cust.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9 rounded-xl hover:bg-gray-100">
                          <Eye className="size-4" />
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 md:h-9 md:w-9 rounded-xl hover:bg-gray-100 flex items-center justify-center outline-none transition-colors">
                            <MoreHorizontal className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
                          <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="rounded-xl font-bold h-10 cursor-pointer" onClick={() => toggleStatus(cust.id, cust.status)}>
                            {cust.status === "active" ? (
                              <><Ban className="mr-2 size-4 text-red-500" /> Ban Customer</>
                            ) : (
                              <><CheckCircle2 className="mr-2 size-4 text-primary" /> Unban Customer</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="rounded-xl font-bold h-10 cursor-pointer">
                            View Full History
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="size-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                        <User className="size-8" />
                      </div>
                      <p className="text-sm font-bold text-gray-500">No customers found</p>
                      <Button variant="ghost" onClick={() => {setSearch(""); setStatusFilter("all")}} className="text-primary font-bold">
                        Clear filters
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-5 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Showing <span className="text-gray-900">{filteredCustomers.length}</span> of <span className="text-gray-900">{MOCK_CUSTOMERS.length}</span> customers
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-gray-100 bg-white" disabled>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-primary/20 bg-primary/5 text-primary font-black">
              1
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-gray-100 bg-white">
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
