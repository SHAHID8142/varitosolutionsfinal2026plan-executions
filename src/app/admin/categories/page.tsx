/**
 * @file page.tsx
 * @path /admin/categories
 * @description Admin Categories management page.
 *              Displays category hierarchy and provides tools for
 *              creation, editing, and organization.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { Folders, Plus, Info, Search } from "lucide-react"
import { CategoryTree } from "@/components/admin/category-tree"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminCategoriesPage() {
  return (
    <div className="flex flex-col gap-10">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Folders className="size-6" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">Categories</h1>
          </div>
          <p className="text-gray-500 font-medium">Organize your products into logical groups for better customer navigation.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="rounded-xl font-black shadow-lg shadow-emerald-500/20">
            <Plus className="mr-2 size-4" /> New Category
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Search & Tree */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input 
              placeholder="Filter categories..." 
              className="pl-11 h-12 rounded-xl border-gray-100 bg-white shadow-sm" 
            />
          </div>

          <section className="bg-white p-6 md:p-8 rounded-[40px] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CategoryTree />
          </section>
        </div>

        {/* Right: Info / Helper */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <section className="bg-emerald-950 p-8 rounded-[40px] text-white flex flex-col gap-6 relative overflow-hidden">
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Info className="size-5 text-emerald-400" />
                <h3 className="text-sm font-black uppercase tracking-widest">Hierarchy Guide</h3>
              </div>
              <ul className="flex flex-col gap-4">
                <li className="flex gap-3">
                  <div className="size-5 rounded-full bg-emerald-800 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">1</div>
                  <p className="text-xs font-medium text-emerald-100/60 leading-relaxed">Drag and drop rows to reorder how they appear in the customer menu.</p>
                </li>
                <li className="flex gap-3">
                  <div className="size-5 rounded-full bg-emerald-800 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">2</div>
                  <p className="text-xs font-medium text-emerald-100/60 leading-relaxed">Deactivating a parent category will hide all its subcategories from the store.</p>
                </li>
                <li className="flex gap-3">
                  <div className="size-5 rounded-full bg-emerald-800 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">3</div>
                  <p className="text-xs font-medium text-emerald-100/60 leading-relaxed">Categories with products cannot be deleted. Move products first.</p>
                </li>
              </ul>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Quick Tip</h3>
            <p className="text-sm font-bold text-gray-700 leading-relaxed">
              Use clean, keyword-rich slugs for your categories to improve SEO ranking for local searches like &quot;Sanitary items in BD&quot;.
            </p>
          </section>
        </div>

      </div>

    </div>
  )
}
