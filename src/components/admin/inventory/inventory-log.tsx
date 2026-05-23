/**
 * @file inventory-log.tsx
 * @description Detailed log of stock adjustments and movements.
 *              Includes manual overrides and automatic sales deductions.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  User, 
  Filter,
  Search
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
// TYPES & MOCK DATA
// ─────────────────────────────────────────────

interface InventoryEntry {
  id: string
  product: string
  sku: string
  type: "addition" | "deduction" | "sale" | "return"
  amount: number
  previousStock: number
  newStock: number
  timestamp: string
  reason: string
  user: string
}

const MOCK_LOGS: InventoryEntry[] = [
  { id: "1", product: "Emerald Faucet", sku: "VR-SAN-001", type: "sale", amount: -2, previousStock: 14, newStock: 12, timestamp: "10 mins ago", reason: "Order #VR-2026-0001", user: "System" },
  { id: "2", product: "Packaging Tape", sku: "VR-PKG-005", type: "addition", amount: 50, previousStock: 100, newStock: 150, timestamp: "2 hours ago", reason: "Restock from supplier", user: "Shahid Admin" },
  { id: "3", product: "Bubble Wrap", sku: "VR-PKG-012", type: "deduction", amount: -5, previousStock: 13, newStock: 8, timestamp: "Yesterday", reason: "Damaged stock during handling", user: "Karim Manager" },
  { id: "4", product: "Kitchen Mixer", sku: "VR-SAN-002", type: "sale", amount: -1, previousStock: 5, newStock: 4, timestamp: "Yesterday", reason: "Order #VR-2026-0002", user: "System" },
  { id: "5", product: "Gold Mixer", sku: "VR-SAN-005", type: "return", amount: 1, previousStock: 1, newStock: 2, timestamp: "2 days ago", reason: "Customer return processed", user: "System" },
]

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export function InventoryLog() {
  const [search, setSearch] = React.useState("")

  return (
    <div className="flex flex-col gap-6">
      
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 max-w-md relative">
          <Search className="absolute left-4 size-4 text-gray-400" />
          <Input 
            placeholder="Search by product or SKU..." 
            className="pl-11 h-12 rounded-xl border-gray-100 bg-white shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 px-5 rounded-xl gap-2 font-bold border-gray-100 bg-white shadow-sm">
          <Filter className="size-4" /> Export Log
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product / SKU</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Adjustment</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock Change</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Details</th>
                <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-gray-900 truncate">{log.product}</span>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{log.sku}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      {log.amount > 0 ? (
                        <ArrowUpCircle className="size-4 text-primary" />
                      ) : (
                        <ArrowDownCircle className="size-4 text-red-500" />
                      )}
                      <span className={cn(
                        "text-sm font-black",
                        log.amount > 0 ? "text-primary" : "text-red-600"
                      )}>
                        {log.amount > 0 ? `+${log.amount}` : log.amount}
                      </span>
                      <Badge variant="outline" className="text-[8px] h-4 px-1 border-gray-200 text-gray-400 uppercase">
                        {log.type}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                      <span>{log.previousStock}</span>
                      <div className="w-4 h-px bg-gray-200" />
                      <span className="text-gray-900">{log.newStock}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-gray-600">{log.reason}</span>
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        <User className="size-2.5" /> {log.user}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="text-xs font-black text-gray-900">{log.timestamp}</span>
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
