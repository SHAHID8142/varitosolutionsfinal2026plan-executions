/**
 * @file flash-deals-table.tsx
 * @description Table for displaying and managing Flash Deals in the admin panel.
 *              Shows active, scheduled, and past deals.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { MoreHorizontal, Edit, Trash2, Power, PowerOff, Zap, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { FlashDeal, FlashDealStatus } from "@/types/flash-deal"
import { toast } from "sonner"

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export function FlashDealsTable({ deals }: { deals: FlashDeal[] }) {
  const getStatus = (deal: FlashDeal): FlashDealStatus => {
    if (!deal.isActive) return "deactivated"
    const now = new Date()
    const start = new Date(deal.startsAt)
    const end = new Date(deal.endsAt)

    if (now < start) return "scheduled"
    if (now > end) return "expired"
    return "active"
  }

  const getStatusBadge = (status: FlashDealStatus) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-500 text-white border-transparent">Active</Badge>
      case "scheduled":
        return <Badge className="bg-blue-500 text-white border-transparent">Scheduled</Badge>
      case "expired":
        return <Badge variant="outline" className="text-gray-400 border-gray-200">Expired</Badge>
      case "deactivated":
        return <Badge variant="destructive" className="bg-red-50 text-red-600 border-red-100">Deactivated</Badge>
    }
  }

  const handleToggleActive = (id: number, currentStatus: boolean) => {
    toast.success(`Flash deal ${currentStatus ? "deactivated" : "activated"} successfully`)
  }

  const handleDelete = (id: number) => {
    toast.error("Flash deal deleted")
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Flash Price</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Schedule</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sales</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-6 py-5 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {deals.map((deal) => {
              const status = getStatus(deal)
              return (
                <tr key={deal.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                        <Zap size={20} strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-900 line-clamp-1">{deal.product?.name || "Product Deleted"}</span>
                        <span className="text-xs text-gray-400 font-bold tracking-tight">ID: #{deal.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-emerald-600">৳{deal.flashPrice}</span>
                      <span className="text-xs text-gray-400 font-bold line-through">৳{deal.product?.price}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-gray-700">Start: {new Date(deal.startsAt).toLocaleString()}</span>
                      <span className="text-xs font-bold text-gray-500">End: {new Date(deal.endsAt).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-black text-gray-900">{deal.soldQty} / {deal.maxQty || "∞"} sold</span>
                      {deal.maxQty && (
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full" 
                            style={{ width: `${Math.min(100, (deal.soldQty / deal.maxQty) * 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {getStatusBadge(status)}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="size-10 rounded-xl hover:bg-gray-100 flex items-center justify-center outline-none transition-colors">
                        <MoreHorizontal className="size-5 text-gray-400" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 rounded-2xl border-gray-100 shadow-xl p-2">
                        <DropdownMenuItem className="rounded-xl h-11 font-bold cursor-pointer" onClick={() => window.location.href = `/admin/flash-deals/${deal.id}/edit`}>
                          <Edit className="mr-2 size-4 text-gray-400" /> Edit Deal
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl h-11 font-bold cursor-pointer" onClick={() => handleToggleActive(deal.id, deal.isActive)}>
                          {deal.isActive ? (
                            <>
                              <PowerOff className="mr-2 size-4 text-red-400" /> Deactivate Deal
                            </>
                          ) : (
                            <>
                              <Power className="mr-2 size-4 text-emerald-400" /> Activate Deal
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-50 my-1" />
                        <DropdownMenuItem className="rounded-xl h-11 font-bold cursor-pointer" onClick={() => window.open(`/product/${deal.product?.slug}`, '_blank')}>
                          <ExternalLink className="mr-2 size-4 text-gray-400" /> View Product
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-50 my-1" />
                        <DropdownMenuItem className="rounded-xl h-11 font-bold cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => handleDelete(deal.id)}>
                          <Trash2 className="mr-2 size-4" /> Delete Permanently
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      {deals.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-center gap-4">
          <div className="size-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-200">
            <Zap size={40} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">No Flash Deals Found</h3>
            <p className="text-gray-500 font-medium">Create your first timed promotion to boost sales.</p>
          </div>
          <Link href="/admin/flash-deals/new">
            <Button className="mt-4 rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-xs">
              Create Deal
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
