/**
 * @file page.tsx
 * @path /privacy
 * @description Privacy Policy page for Varito Solutions.
 *              Standard legal information about data collection and usage.
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

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-1">
        <section className="py-16 bg-gray-50 border-b border-gray-100">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <Breadcrumb
              items={[{ label: "Privacy Policy" }]}
              className="mb-6 justify-center"
            />
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tight">Privacy Policy</h1>
            <p className="text-gray-500 font-medium mt-4">Last Updated: May 22, 2026</p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <div className="prose prose-emerald max-w-none text-gray-600 font-medium leading-relaxed flex flex-col gap-10">
            
            <section className="flex flex-col gap-4">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">1. Introduction</h2>
              <p>Welcome to Varito Solutions. We value your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">2. The Data We Collect</h2>
              <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
              <ul className="list-disc pl-5 flex flex-col gap-2">
                <li><strong>Identity Data:</strong> Includes first name, last name, and username.</li>
                <li><strong>Contact Data:</strong> Includes billing address, delivery address, email address and phone numbers.</li>
                <li><strong>Transaction Data:</strong> Includes details about payments to and from you and other details of products you have purchased from us.</li>
                <li><strong>Technical Data:</strong> Includes IP address, your login data, browser type and version, and operating system.</li>
              </ul>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">3. How We Use Your Data</h2>
              <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
              <ul className="list-disc pl-5 flex flex-col gap-2">
                <li>To register you as a new customer.</li>
                <li>To process and deliver your order.</li>
                <li>To manage our relationship with you.</li>
                <li>To use data analytics to improve our website, products/services, and customer experiences.</li>
              </ul>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">4. Data Security</h2>
              <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.</p>
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
