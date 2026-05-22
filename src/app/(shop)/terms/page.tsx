/**
 * @file page.tsx
 * @path /terms
 * @description Terms & Conditions page for Varito Solutions.
 *              Standard legal agreement between the business and the customer.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-1">
        <section className="py-16 bg-gray-50 border-b border-gray-100">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <Breadcrumb
              items={[{ label: "Terms & Conditions" }]}
              className="mb-6 justify-center"
            />
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tight">Terms & Conditions</h1>
            <p className="text-gray-500 font-medium mt-4">Last Updated: May 22, 2026</p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <div className="prose prose-emerald max-w-none text-gray-600 font-medium leading-relaxed flex flex-col gap-10">
            
            <section className="flex flex-col gap-4">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">1. Agreement to Terms</h2>
              <p>By accessing our website, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">2. Product Information & Pricing</h2>
              <p>We strive to provide accurate information regarding our products and services. However, we do not warrant that product descriptions, pricing, or other content on the site is accurate, complete, reliable, or error-free. In the event of a pricing error, we reserve the right to cancel any orders placed at the incorrect price.</p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">3. Order Acceptance & Shipping</h2>
              <p>Your receipt of an order confirmation does not signify our acceptance of your order. We reserve the right at any time after receipt of your order to accept or decline your order for any reason. Shipping and delivery dates are estimates only and cannot be guaranteed.</p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">4. Payment Terms</h2>
              <p>For Cash on Delivery (COD), payment must be made in full at the time of delivery. For mobile payments and card transactions, payment is processed securely via our partner gateway. Orders will only be dispatched once payment is verified.</p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">5. Limitation of Liability</h2>
              <p>Varito Solutions shall not be liable for any special or consequential damages that result from the use of, or the inability to use, the materials on this site or the performance of the products, even if we have been advised of the possibility of such damages.</p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </div>
  )
}
