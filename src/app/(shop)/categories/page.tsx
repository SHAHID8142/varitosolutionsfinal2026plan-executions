/**
 * @file page.tsx
 * @path /categories
 * @description Categories overview page. Displays all product categories
 *              in a clean, responsive grid layout.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { CategoryCard } from "@/components/shop/category-card"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"

// ─────────────────────────────────────────────
// SAMPLE DATA
// ─────────────────────────────────────────────

const ALL_CATEGORIES = [
  { name: "Sanitary Ware", slug: "sanitary-ware", image: "https://placehold.co/400x400/10b981/white.png?text=Sanitary", count: 42 },
  { name: "Bathroom Fittings", slug: "bath-fittings", image: "https://placehold.co/400x400/10b981/white.png?text=Fittings", count: 128 },
  { name: "Kitchen Fixtures", slug: "kitchen", image: "https://placehold.co/400x400/10b981/white.png?text=Kitchen", count: 64 },
  { name: "Packaging Tapes", slug: "packaging-tape", image: "https://placehold.co/400x400/10b981/white.png?text=Tape", count: 32 },
  { name: "Bubble Wrap", slug: "bubble-wrap", image: "https://placehold.co/400x400/10b981/white.png?text=Bubble", count: 18 },
  { name: "Carton Boxes", slug: "cartons", image: "https://placehold.co/400x400/10b981/white.png?text=Cartons", count: 56 },
  { name: "Plumbing Pipes", slug: "plumbing", image: "https://placehold.co/400x400/10b981/white.png?text=Pipes", count: 94 },
  { name: "Water Tanks", slug: "water-tanks", image: "https://placehold.co/400x400/10b981/white.png?text=Tanks", count: 15 },
  { name: "Electrical Wiring", slug: "electrical", image: "https://placehold.co/400x400/10b981/white.png?text=Electrical", count: 82 },
  { name: "Power Tools", slug: "tools", image: "https://placehold.co/400x400/10b981/white.png?text=Tools", count: 27 },
]

// ─────────────────────────────────────────────
// MAIN PAGE EXPORT
// ─────────────────────────────────────────────

export default function CategoriesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          
          {/* Header & Breadcrumb */}
          <div className="flex flex-col gap-6 mb-12">
            <Breadcrumb
              items={[{ label: "All Categories" }]}
            />
            
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">
                Explore Categories
              </h1>
              <p className="text-sm md:text-lg text-gray-500 font-medium">
                Browse our entire collection of {ALL_CATEGORIES.length} specialized product categories
              </p>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
            {ALL_CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.slug}
                name={cat.name}
                slug={cat.slug}
                image={cat.image}
                productCount={cat.count}
                className="bg-white border-white hover:border-primary/20"
              />
            ))}
          </div>

          {/* Wholesale Notice */}
          <section className="mt-20 p-8 md:p-12 rounded-[40px] bg-emerald-600 text-white text-center relative overflow-hidden shadow-2xl shadow-emerald-500/20">
             <div className="relative z-10 flex flex-col items-center gap-6">
               <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-tight">
                 Looking for Bulk Packaging or Sanitary Supplies?
               </h2>
               <p className="text-emerald-50 text-lg font-medium max-w-xl opacity-90">
                 We provide customized quotes for high-volume orders. Connect with our dedicated sales team for trade pricing.
               </p>
               <WhatsAppButton className="relative bottom-0 right-0" />
               <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                 <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 font-black px-10 py-7 text-lg">
                   Request Wholesale Quote
                 </Button>
               </div>
             </div>
          </section>

        </div>
      </main>

      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </div>
  )
}
