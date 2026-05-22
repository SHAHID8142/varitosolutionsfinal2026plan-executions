/**
 * @file page.tsx
 * @path /shipping
 * @description Shipping Information page for Varito Solutions.
 *              Provides details on delivery times, costs, and courier partners.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { 
  Truck, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Info,
  CheckCircle2,
  AlertCircle,
  Package,
  LucideIcon
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"

// ─────────────────────────────────────────────
// PAGE COMPONENTS
// ─────────────────────────────────────────────

function DeliveryCard({ title, fee, time, icon: Icon, active }: { title: string, fee: string, time: string, icon: LucideIcon, active?: boolean }) {
  return (
    <div className={`flex flex-col gap-4 p-8 rounded-[32px] border transition-all hover:shadow-xl ${active ? 'bg-white border-primary shadow-xl ring-4 ring-primary/5' : 'bg-gray-50 border-gray-100'}`}>
      <div className={`size-14 rounded-2xl flex items-center justify-center shrink-0 ${active ? 'bg-primary text-white' : 'bg-white text-gray-400 border border-gray-100'}`}>
        <Icon className="size-8" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{title}</h3>
        <p className="text-2xl font-black text-primary leading-none my-1">{fee}</p>
        <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
          <Clock className="size-4" /> {time}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE EXPORT
// ─────────────────────────────────────────────

export default function ShippingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-1">
        
        {/* Hero Section */}
        <section className="py-20 bg-emerald-50 relative overflow-hidden text-center">
          <div className="absolute bottom-0 right-0 size-96 bg-emerald-100/50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          
          <div className="container mx-auto px-4 relative z-10">
            <Breadcrumb
              items={[{ label: "Shipping Info" }]}
              className="mb-8 justify-center"
            />
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 uppercase mb-6 text-balance">Delivery Anywhere in Bangladesh</h1>
            <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
              We partner with the most reliable courier services to ensure your products reach you safely and on time.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-5xl">
          
          {/* Cost Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 -mt-24 relative z-20 mb-16">
            <DeliveryCard 
              title="Inside Chattogram" 
              fee="৳60" 
              time="24 - 48 Hours" 
              icon={MapPin}
              active
            />
            <DeliveryCard 
              title="Rest of Bangladesh" 
              fee="৳120" 
              time="3 - 5 Working Days" 
              icon={Truck}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* LEFT: Detailed Info */}
            <div className="lg:col-span-7 flex flex-col gap-12">
              
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                  <ShieldCheck className="size-6 text-primary" /> Safe & Secure Handling
                </h2>
                <div className="prose prose-emerald text-gray-600 font-medium leading-relaxed">
                  <p>Every product at Varito Solutions undergoes a multi-step quality check before being packed. We use specialized bubble wrap and heavy-duty cartons for all fragile sanitary items to prevent any damage during transit.</p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                  <Package className="size-6 text-primary" /> Our Delivery Partners
                </h2>
                <p className="text-gray-600 font-medium leading-relaxed">We work exclusively with verified logistics providers to ensure island-wide coverage and real-time tracking.</p>
                <div className="flex flex-wrap gap-4 mt-2">
                   <div className="h-14 px-6 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center font-black text-gray-400 uppercase tracking-widest grayscale hover:grayscale-0 transition-all">Steadfast</div>
                   <div className="h-14 px-6 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center font-black text-gray-400 uppercase tracking-widest grayscale hover:grayscale-0 transition-all">RedX</div>
                   <div className="h-14 px-6 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center font-black text-gray-400 uppercase tracking-widest grayscale hover:grayscale-0 transition-all">Pathao</div>
                </div>
              </div>

              <div className="flex flex-col gap-6 p-8 rounded-3xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-5 text-primary" />
                  <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Bulk Order Shipping</h3>
                </div>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">For bulk orders exceeding 5kg or large volume cartons (packaging materials), shipping charges are calculated based on weight and volume. Our sales team will contact you with a custom shipping quote before processing the order.</p>
              </div>

            </div>

            {/* RIGHT: Checklist & Steps */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl flex flex-col gap-8">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">How it works</h3>
                <div className="flex flex-col gap-8">
                  {[
                    { step: "01", title: "Order Placement", desc: "Order is confirmed and quality checked." },
                    { step: "02", title: "Secure Packing", desc: "Items are packed with premium materials." },
                    { step: "03", title: "Dispatch", desc: "Handed over to our courier partner." },
                    { step: "04", title: "Fast Delivery", desc: "Delivered directly to your doorstep." },
                  ].map((s, i) => (
                    <div key={i} className="flex gap-5">
                      <div className="text-2xl font-black text-emerald-100 leading-none">{s.step}</div>
                      <div className="flex flex-col gap-1">
                        <h4 className="font-black text-gray-900 leading-none">{s.title}</h4>
                        <p className="text-sm text-gray-500 font-medium">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-emerald-600 text-white flex flex-col gap-4 shadow-xl shadow-emerald-500/20">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="size-6 text-emerald-200" />
                  <span className="font-black uppercase tracking-widest text-sm">Live Tracking</span>
                </div>
                <p className="text-sm font-medium opacity-90 leading-relaxed">Every order includes a tracking number sent via SMS the moment your package is dispatched.</p>
              </div>
            </div>

          </div>

          {/* Need Support Note */}
          <div className="mt-20 py-12 border-t border-gray-100 flex flex-col items-center text-center gap-6">
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Need assistance?</h3>
            <p className="text-gray-500 font-medium max-w-lg">If your location is not listed or you have specific delivery requirements, please talk to us.</p>
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-xs">
               <Info className="size-4" /> Delivery Hotline: +880 1814-214220
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
