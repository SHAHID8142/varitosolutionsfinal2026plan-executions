/**
 * @file page.tsx
 * @path /admin/customers
 * @description Admin Customers management page.
 *              Displays a filterable table of all registered customers.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { Users, Download, UserPlus } from "lucide-react"
import { CustomerTable } from "@/components/admin/customers-table"
import { Button } from "@/components/ui/button"

export default function AdminCustomersPage() {
  return (
    <div className="flex flex-col gap-10">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="size-6" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">Customers</h1>
          </div>
          <p className="text-gray-500 font-medium">View and manage your customer base, order history, and account statuses.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold border-gray-100 bg-white shadow-sm">
            <Download className="mr-2 size-4" /> Export List
          </Button>
          <Button className="rounded-xl font-black shadow-lg shadow-emerald-500/20">
            <UserPlus className="mr-2 size-4" /> Add Customer
          </Button>
        </div>
      </div>

      {/* Main Table Section */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CustomerTable />
      </section>

    </div>
  )
}
