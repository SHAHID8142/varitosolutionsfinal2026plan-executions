/**
 * @file page.tsx
 * @path /admin/flash-deals/new
 * @description Page for creating a new Flash Deal.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

"use client"

import * as React from "react"
import { Zap, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { FlashDealForm } from "@/components/admin/flash-deal-form"
import { Button } from "@/components/ui/button"

export default function NewFlashDealPage() {
  return (
    <div className="flex flex-col gap-10">
      
      {/* Header Area */}
      <div className="flex flex-col gap-6">
        <Link href="/admin/flash-deals">
          <Button variant="ghost" size="sm" className="pl-0 hover:bg-transparent text-gray-400 hover:text-gray-600 font-bold uppercase tracking-widest text-[10px]">
            <ChevronLeft className="mr-1 size-3" /> Back to List
          </Button>
        </Link>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Zap className="size-6" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">New Flash Deal</h1>
          </div>
          <p className="text-gray-500 font-medium">Create a timed promotion to boost visibility and sales of a specific product.</p>
        </div>
      </div>

      {/* Form Content */}
      <FlashDealForm />

    </div>
  )
}
