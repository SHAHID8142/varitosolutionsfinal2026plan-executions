/**
 * @file page.tsx
 * @path /admin/flash-deals/[id]/edit
 * @description Admin page for editing an existing Flash Deal.
 *              Fetches deal from GET /api/admin/flash-deals/[id].
 *
 * @owner    Gemini Design Agent / Claude Backend Agent
 * @updated  2026-05-24
 */

"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { Zap, ChevronLeft, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { FlashDealForm } from "@/components/admin/flash-deal-form"
import { Button } from "@/components/ui/button"
import { adminFetch } from "@/lib/admin-fetch"
import { toast } from "sonner"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface DealDetail {
  id: number
  productId: string
  flashPrice: string
  startsAt: string
  endsAt: string
  maxQty: string
  isActive: boolean
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

/** Admin flash deal edit page — pre-populates form with real deal data. */
export default function EditFlashDealPage() {
  const params = useParams()
  const id = params.id as string

  const [deal, setDeal] = React.useState<DealDetail | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [notFound, setNotFound] = React.useState(false)

  React.useEffect(() => {
    async function load() {
      const { data, error, status } = await adminFetch<DealDetail>(`/api/admin/flash-deals/${id}`)
      if (status === 404) { setNotFound(true); setLoading(false); return }
      if (error || !data) { toast.error(error ?? "Failed to load deal"); setLoading(false); return }
      setDeal(data)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (notFound || !deal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4 text-center">
        <AlertCircle className="size-12 text-red-400" />
        <h2 className="text-xl font-black text-gray-900">Flash Deal Not Found</h2>
        <Link href="/admin/flash-deals">
          <Button variant="outline" className="mt-2">Back to Flash Deals</Button>
        </Link>
      </div>
    )
  }

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

      {/* Form Content — key forces remount with correct defaultValues */}
      <FlashDealForm key={deal.id} initialData={deal} />

    </div>
  )
}
