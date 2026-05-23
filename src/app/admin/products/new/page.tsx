/**
 * @file page.tsx
 * @path /admin/products/new
 * @description Page for creating a new product in the admin panel.
 *              Uses the unified ProductForm component.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, PackagePlus } from "lucide-react"
import { ProductForm } from "@/components/admin/product-form"

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-10">
      
      {/* Header Area */}
      <div className="flex flex-col gap-6">
        <Link 
          href="/admin/products" 
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors w-fit uppercase tracking-widest"
        >
          <ArrowLeft className="size-4" /> Back to Products
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                <PackagePlus className="size-6" />
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">New Product</h1>
            </div>
            <p className="text-gray-500 font-medium">Enter product information to add it to your online catalogue.</p>
          </div>
        </div>
      </div>

      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <ProductForm />
      </section>

    </div>
  )
}
