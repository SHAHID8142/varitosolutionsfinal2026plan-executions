/**
 * @file page.tsx
 * @path /order/[id]
 * @description Order confirmation page — wired to GET /api/orders/[orderNumber].
 *              Shows real order details, status, and next steps for the customer.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  CheckCircle2,
  Package,
  Truck,
  Calendar,
  Phone,
  Printer,
  ArrowRight,
  ShoppingBag,
  AlertCircle
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { formatPrice } from "@/lib/format-price"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface OrderItem {
  name: string
  qty: number
  price: number
}

interface OrderData {
  orderNumber: string
  status: string
  paymentStatus: string
  items: OrderItem[]
  total: number
  address: {
    name: string
    district: string
    thana: string
  }
  createdAt: string
  estimatedDelivery: string
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function paymentMethodLabel(paymentStatus: string): string {
  if (paymentStatus === "pending_cod") return "Cash on Delivery"
  if (paymentStatus === "paid") return "Online Payment"
  return paymentStatus
}

function formatDeliveryDate(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

// ─────────────────────────────────────────────
// MAIN PAGE EXPORT
// ─────────────────────────────────────────────

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderNumber = params.id as string
  const [order, setOrder] = React.useState<OrderData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    if (!orderNumber) return
    fetch(`/api/orders/${orderNumber}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found")
        return r.json()
      })
      .then((json) => setOrder(json.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [orderNumber])

  const subtotal = order
    ? order.items.reduce((sum, item) => sum + item.price * item.qty, 0)
    : 0
  const deliveryCharge = order ? order.total - subtotal : 0

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">

          {loading ? (
            <div className="flex flex-col gap-6">
              <LoadingSkeleton className="h-24 rounded-3xl" />
              <LoadingSkeleton className="h-64 rounded-3xl" />
              <LoadingSkeleton className="h-40 rounded-3xl" />
            </div>
          ) : error || !order ? (
            <div className="flex flex-col items-center gap-6 py-20 text-center">
              <AlertCircle className="size-16 text-red-400" />
              <h1 className="text-2xl font-black text-gray-900">Order Not Found</h1>
              <p className="text-gray-500">We couldn&apos;t find order <strong>#{orderNumber}</strong>.</p>
              <Link href="/">
                <Button variant="primary" size="lg" className="rounded-xl font-black">Go Home</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Success Header */}
              <div className="flex flex-col items-center text-center gap-6 mb-12">
                <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-in zoom-in-50 duration-500">
                  <CheckCircle2 className="size-12 fill-primary text-white stroke-[2.5px]" />
                </div>
                <div className="flex flex-col gap-2">
                  <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
                    Order Confirmed!
                  </h1>
                  <p className="text-gray-500 font-medium text-lg max-w-md">
                    Thank you for shopping with Varito. Your order{" "}
                    <span className="text-gray-900 font-bold">#{order.orderNumber}</span> is being processed.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  <Badge variant="verified" className="bg-primary/5 text-primary border-primary/20 py-1.5 px-4 rounded-full font-bold">
                    SMS Confirmation Sent
                  </Badge>
                  <Badge variant="cod" className="py-1.5 px-4 rounded-full font-bold uppercase">
                    {paymentMethodLabel(order.paymentStatus)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                {/* LEFT: Order Info */}
                <div className="md:col-span-7 flex flex-col gap-6">

                  {/* Items List */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                      <Package className="size-5 text-primary" /> Order Items
                    </h2>
                    <div className="flex flex-col gap-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex gap-4 items-center">
                          <div className="size-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                            <Package className="size-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</p>
                            <p className="text-xs text-gray-500 font-medium">Qty: {item.qty} × {formatPrice(item.price)}</p>
                          </div>
                          <span className="text-sm font-black text-gray-900 whitespace-nowrap">
                            {formatPrice(item.qty * item.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-6" />
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 font-medium">Subtotal</span>
                        <span className="text-gray-900 font-bold">{formatPrice(subtotal)}</span>
                      </div>
                      {deliveryCharge > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">Shipping + Fees</span>
                          <span className="text-gray-900 font-bold">{formatPrice(deliveryCharge)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-base font-black text-gray-900 uppercase tracking-tight">Total Amount</span>
                        <span className="text-2xl font-black text-primary">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Details */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                      <Truck className="size-5 text-primary" /> Delivery Details
                    </h2>
                    <div className="flex flex-col gap-4">
                      <div className="flex gap-4">
                        <div className="size-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                          <Calendar className="size-5 text-gray-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Estimated Delivery</span>
                          <span className="text-sm font-bold text-gray-900">{formatDeliveryDate(order.estimatedDelivery)}</span>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="size-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                          <Phone className="size-5 text-gray-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Shipping To</span>
                          <span className="text-sm font-bold text-gray-900">{order.address.name}</span>
                          <span className="text-xs text-gray-500 font-medium leading-relaxed mt-1">
                            {order.address.thana}, {order.address.district}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Actions */}
                <div className="md:col-span-5 flex flex-col gap-6">
                  <div className="bg-primary rounded-3xl p-8 text-white flex flex-col gap-6 shadow-xl shadow-primary/20">
                    <h3 className="text-xl font-black">Need any help?</h3>
                    <p className="text-white/90 opacity-90 font-medium">
                      If you have any questions regarding your order, feel free to contact our support team. We are available 24/7.
                    </p>
                    <div className="flex flex-col gap-3">
                      <Link href={`/track?order=${order.orderNumber}`}>
                        <Button variant="secondary" className="w-full bg-white text-primary font-black py-6">
                          Track Order Status
                        </Button>
                      </Link>
                      <Button variant="ghost" className="w-full text-white hover:bg-white/10 font-bold border border-white/20" onClick={() => window.print()}>
                        <Printer className="size-4 mr-2" /> Print Invoice
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Link href="/">
                      <Button variant="primary" size="lg" className="w-full py-8 text-lg font-black shadow-lg shadow-primary/10">
                        <ShoppingBag className="size-5 mr-2" /> Continue Shopping
                      </Button>
                    </Link>
                    <Link href="/account/orders" className="flex items-center justify-center gap-2 text-sm font-black text-primary uppercase tracking-widest hover:underline">
                      View Order History <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>

              </div>
            </>
          )}

        </div>
      </main>

      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </div>
  )
}
