/**
 * @file page.tsx
 * @path /account/orders
 * @description Customer's order history page. Lists all past and current orders.
 *              Allows tracking and viewing detailed order summaries.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { ShoppingBag, ArrowLeft } from "lucide-react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { OrderCard, type OrderStatus } from "@/components/shop/order-card"
import { EmptyState } from "@/components/ui/empty-state"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { Badge } from "@/components/ui/badge"

// ─────────────────────────────────────────────
// SAMPLE DATA
// ─────────────────────────────────────────────

const MOCK_ORDERS = [
  {
    id: "VR-2026-00001",
    date: "May 22, 2026",
    status: "processing" as OrderStatus,
    total: 5400,
    itemCount: 3,
    thumbnail: "https://placehold.co/100x100/10b981/white.png?text=Faucet"
  },
  {
    id: "VR-2026-00002",
    date: "May 15, 2026",
    status: "delivered" as OrderStatus,
    total: 1250,
    itemCount: 1,
    thumbnail: "https://placehold.co/100x100/10b981/white.png?text=Tape"
  },
  {
    id: "VR-2026-00003",
    date: "May 02, 2026",
    status: "cancelled" as OrderStatus,
    total: 3200,
    itemCount: 2,
    thumbnail: "https://placehold.co/100x100/10b981/white.png?text=Mixer"
  },
]

// ─────────────────────────────────────────────
// MAIN PAGE EXPORT
// ─────────────────────────────────────────────

export default function MyOrdersPage() {
  const [orders] = React.useState(MOCK_ORDERS)
  const isEmpty = orders.length === 0

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
                {!isEmpty && (
                  <Badge variant="secondary" className="h-7 px-3 bg-gray-100 text-gray-700">
                    {orders.length} TOTAL
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {isEmpty ? (
            <div className="py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <EmptyState
                icon={<ShoppingBag className="size-10" />}
                title="No orders yet"
                description="Looks like you haven't placed any orders yet. Start exploring our premium products today!"
                cta={<Link href="/"><Button variant="primary" size="lg">Start Shopping</Button></Link>}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-1 mb-2">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Order History</h2>
              </div>
              
              <div className="flex flex-col gap-4">
                {orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    id={order.id}
                    date={order.date}
                    status={order.status}
                    total={order.total}
                    itemCount={order.itemCount}
                    thumbnail={order.thumbnail}
                  />
                ))}
              </div>

              {/* Support Note */}
              <div className="mt-12 p-6 rounded-3xl bg-emerald-600 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-500/20">
                <div className="flex flex-col gap-1 text-center sm:text-left">
                  <h3 className="text-lg font-black tracking-tight">Need help with an order?</h3>
                  <p className="text-sm text-emerald-50 opacity-90 font-medium">Our customer support is available 24/7 for your assistance.</p>
                </div>
                <Button variant="secondary" className="bg-white text-emerald-600 font-black px-8">
                  Contact Support
                </Button>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </div>
  )
}
