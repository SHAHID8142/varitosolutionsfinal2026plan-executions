/**
 * @file page.tsx
 * @path /account/orders
 * @description Customer's order history page. Looks up orders by phone number
 *              via GET /api/orders?phone=. No account auth required — phone is the key.
 *
 * @owner    Gemini Design Agent / Claude Backend Agent
 * @updated  2026-05-24
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { ShoppingBag, ArrowLeft, Phone, Search } from "lucide-react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OrderCard, type OrderStatus } from "@/components/shop/order-card"
import { EmptyState } from "@/components/ui/empty-state"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface OrderRow {
  orderNumber: string
  status: OrderStatus
  paymentStatus: string
  total: string
  createdAt: string
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" })
}

const PHONE_RE = /^01[3-9]\d{8}$/

// ─────────────────────────────────────────────
// MAIN PAGE EXPORT
// ─────────────────────────────────────────────

/** My orders page — looks up orders by phone number, no account login required. */
export default function MyOrdersPage() {
  const [phone, setPhone] = React.useState("")
  const [orders, setOrders] = React.useState<OrderRow[] | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [searched, setSearched] = React.useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = phone.trim()
    if (!PHONE_RE.test(trimmed)) {
      toast.error("Please enter a valid Bangladesh phone number (e.g. 01712345678)")
      return
    }

    setLoading(true)
    setSearched(false)
    try {
      const res = await fetch(`/api/orders?phone=${encodeURIComponent(trimmed)}`)
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error ?? "Failed to fetch orders. Please try again.")
        return
      }
      setOrders(json.data)
      setSearched(true)
    } catch {
      toast.error("Network error. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  const isEmpty = searched && orders?.length === 0

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-4xl">

          {/* Header */}
          <div className="flex flex-col gap-6 mb-10">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors w-fit"
            >
              <ArrowLeft className="size-4" /> Back to Home
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">My Orders</h1>
                {searched && orders && orders.length > 0 && (
                  <Badge variant="secondary" className="h-7 px-3 bg-gray-100 text-gray-700">
                    {orders.length} TOTAL
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Phone lookup form */}
          <form
            onSubmit={handleSearch}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 mb-8"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="orders-phone" className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Enter your phone number to view orders
              </label>
              <p className="text-xs text-gray-400 font-medium">Use the same number you used when placing your order.</p>
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  id="orders-phone"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  className="pl-10 h-12"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <Button type="submit" loading={loading} className="h-12 px-6 font-black gap-2 shrink-0">
                <Search className="size-4" /> Search
              </Button>
            </div>
          </form>

          {/* Results */}
          {isEmpty ? (
            <div className="py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <EmptyState
                icon={<ShoppingBag className="size-10" />}
                title="No orders found"
                description={`No orders found for ${phone}. Make sure you're using the same phone number you ordered with.`}
                cta={<Link href="/products"><Button variant="primary" size="lg">Start Shopping</Button></Link>}
              />
            </div>
          ) : searched && orders && orders.length > 0 ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-1 mb-2">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Order History</h2>
              </div>

              <div className="flex flex-col gap-4">
                {orders.map((order) => (
                  <OrderCard
                    key={order.orderNumber}
                    id={order.orderNumber}
                    date={formatDate(order.createdAt)}
                    status={order.status}
                    total={Math.round(parseFloat(order.total))}
                    itemCount={0}
                    thumbnail=""
                  />
                ))}
              </div>

              {/* Support Note */}
              <div className="mt-12 p-6 rounded-3xl bg-primary text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-primary/20">
                <div className="flex flex-col gap-1 text-center sm:text-left">
                  <h3 className="text-lg font-black tracking-tight">Need help with an order?</h3>
                  <p className="text-sm text-white/90 opacity-90 font-medium">Our customer support is available 24/7 for your assistance.</p>
                </div>
                <Link href="/contact">
                  <Button variant="secondary" className="bg-white text-primary font-black px-8">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>
          ) : null}

        </div>
      </main>

      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </div>
  )
}
