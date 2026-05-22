/**
 * @file coupon-table.tsx
 * @description Advanced table for managing discount coupons.
 *              Includes usage tracking, expiry dates, and quick status toggles.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { 
  Ticket, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  XCircle,
  Copy,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// ─────────────────────────────────────────────
// TYPES & MOCK DATA
// ─────────────────────────────────────────────

interface Coupon {
  id: string
  code: string
  type: "percentage" | "fixed"
  value: number
  usageCount: number
  maxUsage: number
  expiryDate: string
  status: "active" | "expired" | "disabled"
}

const MOCK_COUPONS: Coupon[] = [
  { id: "1", code: "VARITO20", type: "percentage", value: 20, usageCount: 45, maxUsage: 100, expiryDate: "2026-06-30", status: "active" },
  { id: "2", code: "WELCOME10", type: "percentage", value: 10, usageCount: 120, maxUsage: 500, expiryDate: "2026-12-31", status: "active" },
  { id: "3", code: "OFF500", type: "fixed", value: 500, usageCount: 12, maxUsage: 50, expiryDate: "2026-05-15", status: "expired" },
  { id: "4", code: "EID2026", type: "percentage", value: 15, usageCount: 0, maxUsage: 200, expiryDate: "2026-04-20", status: "disabled" },
]

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export function CouponTable() {
  const [search, setSearch] = React.useState("")

  const filteredCoupons = MOCK_COUPONS.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase())
  )

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success(`Coupon code ${code} copied!`)
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 max-w-md relative">
          <Search className="absolute left-4 size-4 text-gray-400" />
          <Input 
            placeholder="Search by coupon code..." 
            className="pl-11 h-12 rounded-xl border-gray-100 bg-white shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Coupon Code</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Discount</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Usage</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Ticket className="size-5" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-gray-900 tracking-wider">{coupon.code}</span>
                          <button onClick={() => copyCode(coupon.code)} className="text-gray-300 hover:text-gray-600 transition-colors">
                            <Copy className="size-3" />
                          </button>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                          <Clock className="size-2.5" /> Expires {coupon.expiryDate}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Badge className="bg-gray-900 text-white border-none rounded-lg h-7 px-3 font-black text-xs">
                      {coupon.type === "percentage" ? `${coupon.value}%` : `৳${coupon.value.toLocaleString()}`}
                    </Badge>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5 w-32">
                      <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>{coupon.usageCount} used</span>
                        <span>{coupon.maxUsage}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            (coupon.usageCount / coupon.maxUsage) > 0.8 ? "bg-amber-500" : "bg-emerald-500"
                          )} 
                          style={{ width: `${(coupon.usageCount / coupon.maxUsage) * 100}%` }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Badge 
                      variant={coupon.status === "active" ? "verified" : "outline"}
                      className={cn(
                        "uppercase text-[9px] font-black tracking-widest",
                        coupon.status === "expired" && "bg-red-50 text-red-500 border-red-100",
                        coupon.status === "disabled" && "bg-gray-100 text-gray-400 border-gray-200"
                      )}
                    >
                      {coupon.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-gray-100">
                        <Eye className="size-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-9 w-9 rounded-xl hover:bg-gray-100 flex items-center justify-center outline-none transition-colors">
                            <MoreHorizontal className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
                          <DropdownMenuItem className="rounded-xl font-bold h-10 cursor-pointer">
                            <CheckCircle2 className="mr-2 size-4 text-emerald-500" /> Activate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-xl font-bold h-10 cursor-pointer">
                            <XCircle className="mr-2 size-4 text-red-500" /> Disable
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="rounded-xl font-bold h-10 cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700">
                            <Trash2 className="mr-2 size-4" /> Delete Coupon
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
