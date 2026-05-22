/**
 * @file page.tsx
 * @path /admin/products/[id]/edit
 * @description Page for editing an existing product.
 *              Pre-populates the ProductForm with existing data.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Edit3 } from "lucide-react"
import { ProductForm } from "@/components/admin/product-form"

// ─────────────────────────────────────────────
// MOCK DATA (Synced with table)
// ─────────────────────────────────────────────

const MOCK_PRODUCT = {
  id: "1",
  name: "Luxury Emerald Gold Faucet",
  sku: "VR-SAN-001",
  category: "sanitary",
  price: 3800,
  costPrice: 2200,
  stock: 12,
  status: "active",
  images: ["https://placehold.co/400x400/10b981/white.png?text=Faucet"],
}

export default function EditProductPage() {
  return (
    <div className="flex flex-col gap-10">
      
      {/* Header Area */}
      <div className="flex flex-col gap-6">
        <Link 
          href="/admin/products" 
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-emerald-600 transition-colors w-fit uppercase tracking-widest"
        >
          <ArrowLeft className="size-4" /> Back to Products
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Edit3 className="size-6" />
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">Edit Product</h1>
            </div>
            <p className="text-gray-500 font-medium">Update the details, pricing or availability of your product.</p>
          </div>
        </div>
      </div>

      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <ProductForm initialData={MOCK_PRODUCT} isEditing />
      </section>

    </div>
  )
}
