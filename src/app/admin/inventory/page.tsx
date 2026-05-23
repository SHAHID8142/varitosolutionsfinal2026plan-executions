/**
 * @file page.tsx
 * @path /admin/inventory
 * @description Admin Inventory management page.
 *              Displays stock levels, quick adjustments, and movement history.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { Warehouse, Plus, History, Package } from "lucide-react"
import { InventoryLog } from "@/components/admin/inventory/inventory-log"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function AdminInventoryPage() {
  const [activeTab, setActiveTab] = React.useState<"log" | "stocktake">("log")

  return (
    <div className="flex flex-col gap-10">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
              <Warehouse className="size-6" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">Inventory</h1>
          </div>
          <p className="text-gray-500 font-medium">Track stock movements, process restocks, and audit inventory history.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="rounded-xl font-black shadow-lg shadow-primary/20">
            <Plus className="mr-2 size-4" /> Bulk Restock
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
        <button
          onClick={() => setActiveTab("log")}
          className={cn(
            "flex items-center gap-2 px-6 h-12 rounded-2xl transition-all font-black text-xs uppercase tracking-widest",
            activeTab === "log" ? "bg-primary text-white shadow-lg" : "text-gray-400 hover:text-gray-600"
          )}
        >
          <History className="size-4" /> Stock Movement Log
        </button>
        <button
          onClick={() => setActiveTab("stocktake")}
          className={cn(
            "flex items-center gap-2 px-6 h-12 rounded-2xl transition-all font-black text-xs uppercase tracking-widest",
            activeTab === "stocktake" ? "bg-primary text-white shadow-lg" : "text-gray-400 hover:text-gray-600"
          )}
        >
          <Package className="size-4" /> Digital Stocktake
        </button>
      </div>

      {/* Main Table Section */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === "log" ? (
          <InventoryLog />
        ) : (
          <div className="bg-white p-20 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center gap-4">
            <div className="size-20 rounded-3xl bg-gray-50 flex items-center justify-center text-gray-300">
              <Package className="size-10" />
            </div>
            <h2 className="text-xl font-black text-gray-900 uppercase">Coming Soon</h2>
            <p className="text-sm font-medium text-gray-400 max-w-xs">
              The digital stocktake feature for bulk inventory verification is currently under development.
            </p>
          </div>
        )}
      </section>

    </div>
  )
}
