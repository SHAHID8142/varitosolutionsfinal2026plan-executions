/**
 * @file page.tsx
 * @path /track
 * @description Track Order page. Validates order ID against GET /api/orders/[orderNumber]
 *              then redirects to the order detail page if found.
 *
 * @owner    Gemini Design Agent / Claude Backend Agent
 * @updated  2026-05-24
 */

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Search,
  Truck,
  Package,
  ShieldCheck,
  ArrowRight,
  Info
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

// ─────────────────────────────────────────────
// MAIN PAGE EXPORT
// ─────────────────────────────────────────────

/** Track order page — looks up order by order number via the real API. */
export default function TrackOrderPage() {
  const router = useRouter()
  const [orderId, setOrderId] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [isSearching, setIsSearching] = React.useState(false)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedId = orderId.trim()
    if (!trimmedId) {
      toast.error("Please enter your Order ID.")
      return
    }

    setIsSearching(true)
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(trimmedId)}`)
      const json = await res.json()

      if (res.status === 404) {
        toast.error("Order not found. Please check your Order ID and try again.")
        return
      }

      if (!res.ok) {
        toast.error(json.error ?? "Something went wrong. Please try again.")
        return
      }

      router.push(`/order/${trimmedId}`)
    } catch {
      toast.error("Network error. Please check your connection and try again.")
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Header />

      <main className="flex-1">

        {/* Immersive Header */}
        <section className="py-16 md:py-24 bg-emerald-950 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 size-96 bg-primary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

          <div className="container mx-auto px-4 relative z-10 text-center">
            <Breadcrumb
              items={[{ label: "Track Order" }]}
              className="mb-8 justify-center [&_*]:text-white/60"
            />
            <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase mb-6">Track Your Order</h1>
            <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Enter your Order ID below to see the current status of your delivery.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 -mt-16 relative z-20 pb-24">
          <div className="max-w-xl mx-auto flex flex-col gap-8">

            {/* Tracking Form */}
            <form
              onSubmit={handleTrack}
              className="bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-2xl flex flex-col gap-8"
            >
              <div className="flex flex-col gap-2">
                <Badge variant="verified" className="w-fit bg-primary/5 text-primary border-primary/20 font-bold uppercase tracking-wider">
                  Real-time Updates
                </Badge>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Order Details</h2>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="track-order-id" className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Order ID</label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-300" />
                    <Input
                      id="track-order-id"
                      required
                      placeholder="e.g. VR-2026-00001"
                      className="h-14 pl-12 pr-5 text-lg font-bold"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="track-phone" className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">
                    Phone Number <span className="font-normal text-[10px] opacity-70">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-lg">+88</div>
                    <Input
                      id="track-phone"
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      className="h-14 pl-14 pr-5 text-lg font-bold tracking-widest"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full py-8 text-xl font-black shadow-xl shadow-primary/20 gap-3"
                loading={isSearching}
              >
                <Search className="size-6" /> Track Order Status
              </Button>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <Info className="size-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  The Order ID was sent to your phone via SMS and also listed in the confirmation message you received after placing your order.
                </p>
              </div>
            </form>

            {/* Quick Trust Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <Truck className="size-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-gray-900">Fast Delivery</span>
                  <span className="text-xs text-gray-500 font-medium">Inside CTG: 24-48h</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <ShieldCheck className="size-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-gray-900">Safe Handling</span>
                  <span className="text-xs text-gray-500 font-medium">Verified by Varito</span>
                </div>
              </div>
            </div>

            {/* Need More Help? */}
            <div className="text-center py-8">
              <p className="text-gray-500 font-medium mb-4">Can&apos;t find your order details?</p>
              <Link href="/contact">
                <Button variant="ghost" className="font-black uppercase tracking-widest text-primary hover:bg-primary/5">
                  Contact Support <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
            </div>

          </div>
        </div>

      </main>

      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </div>
  )
}
