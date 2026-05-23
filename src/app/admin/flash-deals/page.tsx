/**
 * @file page.tsx
 * @path /admin/flash-deals
 * @description Admin Flash Deals management page.
 *              Allows viewing, creating, and managing promotional deals.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { Zap, Plus, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FlashDealsTable } from "@/components/admin/flash-deals-table"
import { FlashDeal } from "@/types/flash-deal"

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

const MOCK_DEALS: FlashDeal[] = [
  {
    id: 1,
    productId: 1,
    product: {
      id: 1,
      slug: "luxury-emerald-gold-faucet",
      name: "Luxury Emerald Gold Faucet",
      nameBn: "লাক্সারি এমারল্ড গোল্ড কল",
      price: 4500,
      salePrice: 3800,
      images: ["https://placehold.co/400x400"],
      stock: 12,
      category: { id: 1, name: "Sanitary Ware", slug: "sanitary" },
      isNew: true,
      discountPercent: 15
    },
    flashPrice: 3500,
    startsAt: "2026-05-23T10:00:00",
    endsAt: "2026-05-24T10:00:00",
    maxQty: 10,
    soldQty: 4,
    isActive: true,
    createdAt: "2026-05-22T08:00:00"
  },
  {
    id: 2,
    productId: 3,
    product: {
      id: 3,
      slug: "packaging-tape-6-pack",
      name: "Heavy Duty Packaging Tape (6 Pack)",
      nameBn: "প্যাকেজিং টেপ (৬ প্যাক)",
      price: 850,
      salePrice: 720,
      images: ["https://placehold.co/400x400"],
      stock: 150,
      category: { id: 2, name: "Packaging", slug: "packaging" },
      isNew: false,
      discountPercent: 15
    },
    flashPrice: 650,
    startsAt: "2026-05-25T00:00:00",
    endsAt: "2026-05-26T00:00:00",
    maxQty: 50,
    soldQty: 0,
    isActive: true,
    createdAt: "2026-05-22T09:00:00"
  }
]

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function FlashDealsPage() {
  return (
    <div className="flex flex-col gap-10">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Zap className="size-6" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">Flash Deals</h1>
          </div>
          <p className="text-gray-500 font-medium">Manage time-limited price promotions for your store.</p>
        </div>
        
        <Link href="/admin/flash-deals/new">
          <Button size="lg" className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-500/20">
            <Plus className="mr-2 size-5" /> New Flash Deal
          </Button>
        </Link>
      </div>

      {/* Info Callout */}
      <div className="flex items-start gap-4 p-6 rounded-3xl bg-blue-50 border border-blue-100 text-blue-800">
        <Info className="size-6 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-black uppercase tracking-tight text-sm">Active Deal Rule</p>
          <p className="text-sm font-medium opacity-90 leading-relaxed">
            Only one flash deal can be active at a time. If you create a deal that overlaps with an existing one, 
            it will be automatically queued but won&apos;t show on the homepage until the previous one ends.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <FlashDealsTable deals={MOCK_DEALS} />

    </div>
  )
}
