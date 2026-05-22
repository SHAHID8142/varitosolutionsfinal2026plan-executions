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
import { WhatsAppIcon } from "@/components/ui/icons/whatsapp"
import { Package, ArrowRight } from "lucide-react"
import { toast } from "sonner"

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
  const handleWholesaleQuote = () => {
    toast.info("Opening wholesale request form...")
    window.location.href = "/contact"
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 pb-24">
          
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
                className="bg-white border-white hover:border-primary/20 shadow-sm"
              />
            ))}
          </div>

          {/* Wholesale Notice (Improved) */}
          <section className="mt-24 p-8 md:p-16 rounded-[40px] bg-emerald-950 text-white relative overflow-hidden shadow-2xl shadow-emerald-950/20 border border-emerald-900/50">
             <div className="absolute top-0 right-0 opacity-5 -translate-y-1/2 translate-x-1/4">
               <Package size={400} strokeWidth={1} />
             </div>
             
             <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
               <div className="flex flex-col gap-6 max-w-2xl text-center lg:text-left">
                 <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight">
                   Bulk Packaging or <span className="text-primary">Sanitary Supplies?</span>
                 </h2>
                 <p className="text-emerald-100/70 text-lg md:text-xl font-medium leading-relaxed">
                   We provide customized quotes for high-volume orders. Connect with our dedicated sales team for industry-leading trade pricing and direct delivery.
                 </p>
               </div>

               <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0">
                 <Button onClick={handleWholesaleQuote} size="lg" className="h-16 px-10 rounded-2xl bg-white text-emerald-950 hover:bg-emerald-50 font-black uppercase tracking-widest text-sm shadow-xl shadow-black/20">
                   Get Wholesale Quote <ArrowRight className="ml-2 size-5" />
                 </Button>
                 <a 
                   href="https://wa.me/8801814214220" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="w-full sm:w-auto"
                 >
                   <Button variant="outline" size="lg" className="w-full h-16 px-10 rounded-2xl border-emerald-800 text-white hover:bg-emerald-800/50 font-black uppercase tracking-widest text-sm gap-3">
                     <WhatsAppIcon className="size-6 fill-[#25D366]" /> Chat on WhatsApp
                   </Button>
                 </a>
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
