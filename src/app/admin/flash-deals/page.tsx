/**
 * @file page.tsx
 * @path /admin/flash-deals
 * @description Admin Flash Deals management page.
 *              Fetches deals from GET /api/admin/flash-deals and renders the table.
 *
 * @owner    Gemini Design Agent / Claude Backend Agent
 * @updated  2026-05-24
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { Zap, Plus, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FlashDealsTable } from "@/components/admin/flash-deals-table"
import { FlashDeal } from "@/types/flash-deal"
import { adminFetch } from "@/lib/admin-fetch"
import { toast } from "sonner"

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

/** Admin flash deals page — fetches real deal list from the API. */
export default function FlashDealsPage() {
  const [deals, setDeals] = React.useState<FlashDeal[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function load() {
      const { data, error } = await adminFetch<FlashDeal[]>("/api/admin/flash-deals")
      if (error) { toast.error(error); setLoading(false); return }
      setDeals((data as FlashDeal[] | null) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="flex flex-col gap-10">

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
              <Zap className="size-6" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">Flash Deals</h1>
          </div>
          <p className="text-gray-500 font-medium">Manage time-limited price promotions for your store.</p>
        </div>

        <Link href="/admin/flash-deals/new">
          <Button size="lg" className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20">
            <Plus className="mr-2 size-5" /> New Flash Deal
          </Button>
        </Link>
      </div>

      {/* Info Callout */}
      <div className="flex items-start gap-4 p-6 rounded-3xl bg-blue-50 border border-blue-100 text-blue-800">
        <Info className="size-6 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <p className="font-black uppercase tracking-tight text-sm">Active Deal Rule</p>
          <p className="text-sm font-medium opacity-90 leading-relaxed">
            Only one flash deal can be active at a time. If you create a deal that overlaps with an existing one,
            it will be automatically queued but won&apos;t show on the homepage until the previous one ends.
          </p>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="h-48 rounded-3xl bg-gray-50 animate-pulse" />
      ) : (
        <FlashDealsTable deals={deals} />
      )}

    </div>
  )
}
