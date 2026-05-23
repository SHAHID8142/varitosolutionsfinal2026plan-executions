/**
 * @file page.tsx
 * @path /admin/coupons
 * @description Admin Coupons management page.
 *              Allows creation and tracking of discount codes.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { Ticket, Plus, Download } from "lucide-react"
import { CouponTable } from "@/components/admin/coupons/coupon-table"
import { Button } from "@/components/ui/button"

export default function AdminCouponsPage() {
  return (
    <div className="flex flex-col gap-10">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
              <Ticket className="size-6" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">Coupons</h1>
          </div>
          <p className="text-gray-500 font-medium">Create and manage marketing discount codes to drive sales.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold border-gray-100 bg-white shadow-sm">
            <Download className="mr-2 size-4" /> Export Report
          </Button>
          <Button className="rounded-xl font-black shadow-lg shadow-primary/20">
            <Plus className="mr-2 size-4" /> Create Coupon
          </Button>
        </div>
      </div>

      {/* Main Table Section */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CouponTable />
      </section>

    </div>
  )
}
