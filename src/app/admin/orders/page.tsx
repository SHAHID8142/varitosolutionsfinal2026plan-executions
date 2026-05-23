/**
 * @file page.tsx
 * @path /admin/orders
 * @description Admin Orders management page.
 *              Displays a filterable table of all customer orders.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { ShoppingBag, Download, Plus } from "lucide-react"
import { OrdersTable } from "@/components/admin/orders-table"
import { Button } from "@/components/ui/button"

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function AdminOrdersPage() {
  return (
    <div className="flex flex-col gap-10">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
              <ShoppingBag className="size-6" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">Orders</h1>
          </div>
          <p className="text-gray-500 font-medium">Manage and process all customer orders across your shop.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold border-gray-100 bg-white">
            <Download className="mr-2 size-4" /> Export CSV
          </Button>
          <Button className="rounded-xl font-black shadow-lg shadow-primary/20">
            <Plus className="mr-2 size-4" /> Create Manual Order
          </Button>
        </div>
      </div>

      {/* Main Table Section */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <OrdersTable />
      </section>

    </div>
  )
}
