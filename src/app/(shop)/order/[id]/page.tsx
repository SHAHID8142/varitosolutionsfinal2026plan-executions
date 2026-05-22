/**
 * @file page.tsx
 * @path /order/[id]
 * @description Order confirmation and success page.
 *              Shows order details, status, and next steps for the customer.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Calendar, 
  Phone, 
  Printer, 
  ArrowRight,
  ShoppingBag
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/format-price"

// ─────────────────────────────────────────────
// SAMPLE DATA
// ─────────────────────────────────────────────

const MOCK_ORDER = {
  items: [
    { name: "Luxury Emerald Gold Faucet", qty: 1, price: 3800, image: "https://placehold.co/100x100/10b981/white.png?text=Faucet" },
    { name: "Heavy Duty Packaging Tape (6 Pack)", qty: 2, price: 720, image: "https://placehold.co/100x100/10b981/white.png?text=Tape" },
  ],
  subtotal: 5240,
  shipping: 120,
  codFee: 40,
  total: 5400,
  address: {
    name: "Rahat Chowdhury",
    phone: "01814-214220",
    fullAddress: "House 12, Flat 4A, Road 5, Block B, Nasirabad, Chattogram",
  },
  paymentMethod: "Cash on Delivery",
  estimatedDelivery: "May 25 - May 27, 2026"
}

// ─────────────────────────────────────────────
// MAIN PAGE EXPORT
// ─────────────────────────────────────────────

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params.id as string

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          
          {/* Success Header */}
          <div className="flex flex-col items-center text-center gap-6 mb-12">
            <div className="size-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 animate-in zoom-in-50 duration-500">
              <CheckCircle2 className="size-12 fill-emerald-600 text-white stroke-[2.5px]" />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
                Order Confirmed!
              </h1>
              <p className="text-gray-500 font-medium text-lg max-w-md">
                Thank you for shopping with Varito. Your order <span className="text-gray-900 font-bold">#{orderId}</span> is being processed.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="verified" className="bg-emerald-50 text-emerald-600 border-emerald-100 py-1.5 px-4 rounded-full font-bold">
                SMS Confirmation Sent
              </Badge>
              <Badge variant="cod" className="py-1.5 px-4 rounded-full font-bold uppercase">
                {MOCK_ORDER.paymentMethod}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* LEFT: Order Info */}
            <div className="md:col-span-7 flex flex-col gap-6">
              
              {/* Items List */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                  <Package className="size-5 text-emerald-600" /> Order Items
                </h2>
                <div className="flex flex-col gap-4">
                  {MOCK_ORDER.items.map((item, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <div className="size-16 rounded-xl bg-gray-50 border border-gray-50 overflow-hidden shrink-0 relative">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
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
                    <span className="text-gray-900 font-bold">{formatPrice(MOCK_ORDER.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Shipping</span>
                    <span className="text-gray-900 font-bold">{formatPrice(MOCK_ORDER.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">COD Charge</span>
                    <span className="text-gray-900 font-bold">{formatPrice(MOCK_ORDER.codFee)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-base font-black text-gray-900 uppercase tracking-tight">Total Amount</span>
                    <span className="text-2xl font-black text-emerald-600">{formatPrice(MOCK_ORDER.total)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                  <Truck className="size-5 text-emerald-600" /> Delivery Details
                </h2>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className="size-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                      <Calendar className="size-5 text-gray-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Estimated Delivery</span>
                      <span className="text-sm font-bold text-gray-900">{MOCK_ORDER.estimatedDelivery}</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="size-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                      <Phone className="size-5 text-gray-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Shipping To</span>
                      <span className="text-sm font-bold text-gray-900">{MOCK_ORDER.address.name}</span>
                      <span className="text-xs text-gray-500 font-medium leading-relaxed mt-1">
                        {MOCK_ORDER.address.fullAddress} <br />
                        Phone: {MOCK_ORDER.address.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Actions */}
            <div className="md:col-span-5 flex flex-col gap-6">
              <div className="bg-emerald-600 rounded-3xl p-8 text-white flex flex-col gap-6 shadow-xl shadow-emerald-600/20">
                <h3 className="text-xl font-black">Need any help?</h3>
                <p className="text-emerald-50 opacity-90 font-medium">
                  If you have any questions regarding your order, feel free to contact our support team. We are available 24/7.
                </p>
                <div className="flex flex-col gap-3">
                  <Button variant="secondary" className="w-full bg-white text-emerald-600 font-black py-6">
                    Track Order Status
                  </Button>
                  <Button variant="ghost" className="w-full text-white hover:bg-white/10 font-bold border border-white/20">
                    <Printer className="size-4 mr-2" /> Download Invoice
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Link href="/">
                  <Button variant="primary" size="lg" className="w-full py-8 text-lg font-black shadow-lg shadow-emerald-500/10">
                    <ShoppingBag className="size-5 mr-2" /> Continue Shopping
                  </Button>
                </Link>
                <Link href="/account/orders" className="flex items-center justify-center gap-2 text-sm font-black text-primary uppercase tracking-widest hover:underline">
                  View Order History <ArrowRight className="size-4" />
                </Link>
              </div>
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
