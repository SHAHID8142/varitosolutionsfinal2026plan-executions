/**
 * @file page.tsx
 * @path /admin/flash-deals/[id]/edit
 * @description Page for editing an existing Flash Deal.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { Zap, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { FlashDealForm } from "@/components/admin/flash-deal-form"
import { Button } from "@/components/ui/button"

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

const MOCK_DEAL = {
  id: 1,
  productId: "1",
  flashPrice: "3500",
  startsAt: "2026-05-23T10:00",
  endsAt: "2026-05-24T10:00",
  maxQty: "10",
  isActive: true,
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function EditFlashDealPage() {
  const params = useParams()
  const id = params.id as string

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
            <div className="size-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
              <Zap className="size-6" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">Edit Flash Deal</h1>
          </div>
          <p className="text-gray-500 font-medium">Updating Deal ID: #{id}</p>
        </div>
      </div>

      {/* Form Content */}
      <FlashDealForm initialData={MOCK_DEAL} />

    </div>
  )
}
