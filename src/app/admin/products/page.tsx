/**
 * @file page.tsx
 * @path /admin/products
 * @description Admin Products management page.
 *              Displays a comprehensive table of all products in the catalogue.
 *              Allows for quick stock/price updates and navigation to add/edit forms.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { Package, Plus, Download } from "lucide-react"
import { ProductsTable } from "@/components/admin/products-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function AdminProductsPage() {
  return (
    <div className="flex flex-col gap-10">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
              <Package className="size-6" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">Products</h1>
          </div>
          <p className="text-gray-500 font-medium">Manage your inventory, pricing, and product visibility from this central hub.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold border-gray-100 bg-white shadow-sm">
            <Download className="mr-2 size-4" /> Export Catalogue
          </Button>
          <Link href="/admin/products/new">
            <Button className="rounded-xl font-black shadow-lg shadow-primary/20">
              <Plus className="mr-2 size-4" /> Add New Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Table Section */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <ProductsTable />
      </section>

    </div>
  )
}
