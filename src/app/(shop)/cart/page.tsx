/**
 * @file page.tsx
 * @path /cart
 * @description Shopping cart page. Shows list of added products,
 *              cost breakdown, and proceed to checkout action.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { ShoppingCart, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { CartItem } from "@/components/shop/cart-item"
import { OrderSummary } from "@/components/shop/order-summary"
import { EmptyState } from "@/components/ui/empty-state"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { Badge } from "@/components/ui/badge"
import { BkashIcon } from "@/components/ui/icons/bkash"
import { NagadIcon } from "@/components/ui/icons/nagad"
import { VisaIcon } from "@/components/ui/icons/visa"
import { CodIcon } from "@/components/ui/icons/cod"

// ─────────────────────────────────────────────
// SAMPLE DATA
// ─────────────────────────────────────────────

const INITIAL_CART = [
  {
    id: "1",
    name: "Luxury Emerald Gold Faucet - Dual Handle Bathroom Mixer",
    price: 4500,
    salePrice: 3800,
    image: "https://placehold.co/400x400/10b981/white.png?text=Faucet",
    quantity: 1,
  },
  {
    id: "3",
    name: "Heavy Duty Packaging Tape (6 Pack)",
    price: 850,
    salePrice: 720,
    image: "https://placehold.co/400x400/10b981/white.png?text=Tape+Pack",
    quantity: 2,
  },
]

// ─────────────────────────────────────────────
// MAIN PAGE EXPORT
// ─────────────────────────────────────────────

export default function CartPage() {
  const [items, setItems] = React.useState(INITIAL_CART)
  
  const updateQty = (id: string, newQty: number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item))
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const subtotal = items.reduce((acc, item) => acc + (item.salePrice || item.price) * item.quantity, 0)
  const shipping = 120
  const codFee = 40

  const isEmpty = items.length === 0

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          
          {/* Cart Header */}
          <div className="flex flex-col gap-6 mb-10">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors w-fit"
            >
              <ArrowLeft className="size-4" /> Continue Shopping
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Your Cart</h1>
                {!isEmpty && (
                  <Badge variant="secondary" className="h-7 px-3 bg-gray-100 text-gray-700">
                    {items.length} Items
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {isEmpty ? (
            <div className="py-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <EmptyState
                icon={<ShoppingCart className="size-10" />}
                title="Your cart is empty"
                description="Looks like you haven't added anything to your cart yet. Explore our products and find something you love!"
                cta={<Link href="/"><Button variant="primary" size="lg" className="w-full">Start Shopping</Button></Link>}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT: Cart Items List */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    salePrice={item.salePrice}
                    image={item.image}
                    quantity={item.quantity}
                    onQuantityChange={(q) => updateQty(item.id, q)}
                    onRemove={() => removeItem(item.id)}
                  />
                ))}

                {/* Secure Checkout Note */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 text-primary border border-primary/20 mt-4">
                  <ShieldCheck className="size-5 shrink-0" />
                  <p className="text-xs font-bold uppercase tracking-wide">
                    100% Secure Checkout | Verified by Varito Solutions
                  </p>
                </div>
              </div>

              {/* RIGHT: Order Summary */}
              <div className="lg:col-span-4 sticky top-32">
                <OrderSummary
                  subtotal={subtotal}
                  shipping={shipping}
                  codFee={codFee}
                  className="mb-6"
                />

                <Link href="/checkout">
                  <Button size="lg" className="w-full py-8 text-xl font-black shadow-xl shadow-primary/20 gap-3">
                    Proceed to Checkout <ArrowRight className="size-6" />
                  </Button>
                </Link>

                <div className="mt-6 flex flex-col gap-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">We Accept</span>
                  <div className="flex justify-center items-center gap-5 opacity-40 hover:opacity-100 transition-all">
                    <CodIcon className="size-6" />
                    <BkashIcon className="size-6" />
                    <NagadIcon className="size-6" />
                    <VisaIcon className="size-6" />
                  </div>
                </div>
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
