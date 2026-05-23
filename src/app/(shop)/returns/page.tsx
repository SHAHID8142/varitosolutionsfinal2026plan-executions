/**
 * @file page.tsx
 * @path /returns
 * @description Returns & Refund Policy page for Varito Solutions.
 *              Clear, structured information to build customer trust.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { 
  RotateCcw, 
  Clock, 
  ShieldCheck, 
  HelpCircle, 
  MessageCircle, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { Badge } from "@/components/ui/badge"

// ─────────────────────────────────────────────
// PAGE COMPONENTS
// ─────────────────────────────────────────────

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6 py-12 border-b border-gray-100 last:border-0">
      <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">{title}</h2>
      <div className="prose prose-emerald max-w-none text-gray-600 font-medium leading-relaxed">
        {children}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE EXPORT
// ─────────────────────────────────────────────

export default function ReturnsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-1">
        
        {/* Header Section */}
        <section className="py-20 bg-primary/5 relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 size-96 bg-primary/10/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          
          <div className="container mx-auto px-4 relative z-10">
            <Breadcrumb
              items={[{ label: "Returns Policy" }]}
              className="mb-8 justify-center"
            />
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 uppercase mb-6">Returns & Refunds</h1>
            <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto">
              Our 7-day easy return policy is designed to give you peace of mind with every purchase.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          
          {/* Quick Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-24 relative z-20 mb-12">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl flex flex-col items-center text-center gap-4">
               <div className="size-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                 <Clock className="size-8" />
               </div>
               <h3 className="font-black text-gray-900">7 Days</h3>
               <p className="text-sm text-gray-500 font-medium">No-questions-asked return window for most items.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl flex flex-col items-center text-center gap-4">
               <div className="size-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                 <ShieldCheck className="size-8" />
               </div>
               <h3 className="font-black text-gray-900">Full Refund</h3>
               <p className="text-sm text-gray-500 font-medium">100% money back to your original payment method.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl flex flex-col items-center text-center gap-4">
               <div className="size-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                 <RotateCcw className="size-8" />
               </div>
               <h3 className="font-black text-gray-900">Free Pickup</h3>
               <p className="text-sm text-gray-500 font-medium">We collect the item from your doorstep inside CTG.</p>
            </div>
          </div>

          {/* Detailed Policy */}
          <PolicySection title="1. Eligibility for Returns">
            <p>To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You&apos;ll also need the receipt or proof of purchase.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
               <div className="flex gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20">
                 <CheckCircle2 className="size-5 text-primary shrink-0" />
                 <span className="text-sm">Item is damaged or defective upon arrival.</span>
               </div>
               <div className="flex gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20">
                 <CheckCircle2 className="size-5 text-primary shrink-0" />
                 <span className="text-sm">Wrong item was sent by mistake.</span>
               </div>
               <div className="flex gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20">
                 <CheckCircle2 className="size-5 text-primary shrink-0" />
                 <span className="text-sm">Item is incomplete (missing parts).</span>
               </div>
               <div className="flex gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20">
                 <CheckCircle2 className="size-5 text-primary shrink-0" />
                 <span className="text-sm">Item does not match the description.</span>
               </div>
            </div>
          </PolicySection>

          <PolicySection title="2. Non-Returnable Items">
            <p>Certain types of items cannot be returned due to their nature:</p>
            <ul className="list-disc pl-5 flex flex-col gap-2 mt-4">
               <li>Custom products (such as special orders or personalized items).</li>
               <li>Personal care goods (such as opened sanitary hygiene products).</li>
               <li>Items on final clearance or marked as &quot;Non-Returnable&quot;.</li>
               <li>Items that show clear signs of usage or physical damage by the customer.</li>
            </ul>
          </PolicySection>

          <PolicySection title="3. Refund Process">
            <p>Once we receive and inspect your return, we will notify you of the approval or rejection of your refund. If approved, the refund will be processed within 5-7 business days.</p>
            <div className="flex flex-col gap-4 mt-6">
               <div className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100">
                  <Badge variant="verified" className="mt-1">bKash / Nagad</Badge>
                  <p className="text-sm">Refund will be sent to the same mobile number used for payment.</p>
               </div>
               <div className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100">
                  <Badge variant="verified" className="mt-1">Bank / Card</Badge>
                  <p className="text-sm">Refund will be credited back to your original bank account or card.</p>
               </div>
               <div className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100">
                  <Badge variant="verified" className="mt-1">Cash on Delivery</Badge>
                  <p className="text-sm">We will contact you for a bKash/Nagad number or provide store credit.</p>
               </div>
            </div>
          </PolicySection>

          {/* Need Help CTA */}
          <section className="mt-12 p-8 md:p-12 rounded-[40px] bg-primary text-white text-center relative overflow-hidden shadow-2xl shadow-primary/20">
            <div className="absolute top-0 right-0 opacity-10 -translate-y-1/4 translate-x-1/4">
               <HelpCircle size={200} />
            </div>
            <div className="relative z-10 flex flex-col items-center gap-6">
              <h2 className="text-3xl font-black uppercase tracking-tight">Still have questions?</h2>
              <p className="text-white/90 text-lg font-medium max-w-xl opacity-90 leading-relaxed">
                Our support team is here to help with any return requests or policy clarifications. 
                Talk to us directly on WhatsApp or call our hotline.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button size="lg" className="bg-white text-primary hover:bg-primary/5 font-black px-10 py-7 text-lg shadow-xl">
                  <MessageCircle className="mr-2 size-6" /> Chat on WhatsApp
                </Button>
                <Button variant="ghost" size="lg" className="text-white border border-white/20 hover:bg-white/10 font-black px-10 py-7 text-lg">
                  Call Hotline <ArrowRight className="ml-2 size-5" />
                </Button>
              </div>
            </div>
          </section>

          {/* Policy Update Note */}
          <div className="mt-16 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <AlertCircle className="size-3" />
            Last Updated: May 22, 2026 • Varito Solutions Team
          </div>

        </div>
      </main>

      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </div>
  )
}
