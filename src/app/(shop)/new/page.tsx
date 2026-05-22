/**
 * @file page.tsx
 * @path /new
 * @description New Arrivals products page.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { ProductCard } from "@/components/shop/product-card"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"

const NEW_PRODUCTS = [
  { id: "1", name: "Luxury Emerald Gold Faucet", slug: "luxury-emerald-gold-faucet", image: "https://placehold.co/400x400/10b981/white.png?text=New+1", price: 4500, salePrice: 3800, stock: 12, isNew: true },
  { id: "3", name: "Modern Matte Black Tap", slug: "matte-black-tap", image: "https://placehold.co/400x400/10b981/white.png?text=New+2", price: 3500, salePrice: 2999, stock: 15, isNew: true },
]

export default function NewArrivalsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: "New Arrivals" }]} className="mb-8" />
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase mb-10">New Arrivals</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {NEW_PRODUCTS.map((p) => <ProductCard key={p.id} {...p} />)}
        </div>
      </main>
      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </div>
  )
}
