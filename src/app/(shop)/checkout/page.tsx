/**
 * @file page.tsx
 * @path /checkout
 * @description Checkout page for finalizing orders.
 *              Includes address entry, payment selection, and final cost review.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, ShieldCheck, Lock, CreditCard } from "lucide-react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { AddressForm } from "@/components/shop/address-form"
import { PaymentMethodSelector } from "@/components/shop/payment-method-selector"
import { OrderSummary } from "@/components/shop/order-summary"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { Badge } from "@/components/ui/badge"

// ─────────────────────────────────────────────
// MAIN PAGE EXPORT
// ─────────────────────────────────────────────

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = React.useState<"cod" | "bkash" | "nagad" | "card">("cod")
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false)

  const handlePlaceOrder = () => {
    setIsPlacingOrder(true)
    // Simulate API call
    setTimeout(() => {
      window.location.href = "/order/VR-2026-00001"
    }, 2000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          
          {/* Checkout Header */}
          <div className="flex flex-col gap-6 mb-10">
            <Link 
              href="/cart" 
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors w-fit"
            >
              <ArrowLeft className="size-4" /> Back to Cart
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Checkout</h1>
                <Badge variant="verified" className="h-7 px-3 bg-primary/5 text-primary border-primary/20 flex gap-1.5 items-center">
                  <Lock className="size-3" /> Secure Transaction
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: Checkout Forms */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              
              {/* 1. Delivery Address */}
              <section className="flex flex-col gap-4">
                <div className="flex items-center gap-3 px-1">
                  <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm">1</div>
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Delivery Address</h2>
                </div>
                <AddressForm />
              </section>

              {/* 2. Payment Method */}
              <section className="flex flex-col gap-4">
                <div className="flex items-center gap-3 px-1">
                  <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm">2</div>
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Payment Method</h2>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-sm text-gray-500 mb-6 font-medium">
                    Choose how you&apos;d like to pay. Cash on Delivery is available for all orders inside Bangladesh.
                  </p>
                  <PaymentMethodSelector selected={paymentMethod} onChange={setPaymentMethod} />
                </div>
              </section>

              {/* Secure Checkout Note */}
              <div className="flex items-center gap-3 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <ShieldCheck className="size-10 text-primary shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-black text-gray-900 uppercase tracking-wide">SSL Secure Payment</span>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    Your personal and payment information is encrypted and protected. 
                    We never store your card details on our servers.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT: Order Summary Sidebar */}
            <div className="lg:col-span-4 sticky top-32">
              <OrderSummary
                subtotal={12450}
                shipping={120}
                codFee={paymentMethod === "cod" ? 40 : 0}
                className="mb-6"
              />

              <Button 
                size="lg" 
                className="w-full py-8 text-xl font-black shadow-xl shadow-primary/20 gap-3"
                onClick={handlePlaceOrder}
                loading={isPlacingOrder}
              >
                {paymentMethod === "cod" ? "Confirm Order" : "Proceed to Pay"}
                {paymentMethod !== "cod" && <CreditCard className="size-6" />}
              </Button>

              <div className="mt-8 flex flex-col gap-6 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Order Details</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3">
                    <div className="size-12 rounded-lg bg-gray-50 border border-gray-100 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-900 line-clamp-1">Luxury Emerald Gold Faucet</span>
                      <span className="text-[10px] text-gray-500 font-medium">Qty: 1 × ৳3,800</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="size-12 rounded-lg bg-gray-50 border border-gray-100 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-900 line-clamp-1">Heavy Duty Packaging Tape...</span>
                      <span className="text-[10px] text-gray-500 font-medium">Qty: 2 × ৳720</span>
                    </div>
                  </div>
                </div>
                <Link href="/cart" className="text-xs font-black text-primary uppercase tracking-wider text-center hover:underline">
                  Edit Cart Items
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
