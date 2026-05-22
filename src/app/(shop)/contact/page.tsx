/**
 * @file page.tsx
 * @path /contact
 * @description Contact page for Varito Solutions.
 *              Includes contact form and direct contact information (Phone, WhatsApp, Email).
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Clock, 
  Send,
  ArrowRight
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { Badge } from "@/components/ui/badge"
import { WhatsAppIcon } from "@/components/ui/icons/whatsapp"

// ─────────────────────────────────────────────
// PAGE COMPONENTS
// ─────────────────────────────────────────────

interface InfoCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  content: string
  subContent?: string
  href?: string
  iconClassName?: string
}

function InfoCard({ icon: Icon, title, content, subContent, href, iconClassName }: InfoCardProps) {
  const contentNode = (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-black text-gray-900 uppercase tracking-widest leading-none mb-1">{title}</span>
      <p className="text-lg font-bold text-gray-700">{content}</p>
      {subContent && <p className="text-sm text-gray-500 font-medium">{subContent}</p>}
    </div>
  )

  return (
    <div className="flex items-start gap-5 p-6 rounded-3xl bg-white border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
      <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${iconClassName || 'bg-emerald-50 text-emerald-600'}`}>
        <Icon className="size-6" />
      </div>
      {href ? (
        <a href={href} className="flex-1 hover:text-primary transition-colors">
          {contentNode}
        </a>
      ) : (
        <div className="flex-1">{contentNode}</div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE EXPORT
// ─────────────────────────────────────────────

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      alert("Message sent successfully! We will get back to you soon.")
    }, 1500)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Header />
      
      <main className="flex-1">
        
        {/* Header Section */}
        <section className="py-12 md:py-20 bg-emerald-950 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 size-96 bg-emerald-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <Breadcrumb
              items={[{ label: "Contact Us" }]}
              className="mb-8 justify-center [&_*]:text-emerald-100/60"
            />
            <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase mb-6">Get in Touch</h1>
            <p className="text-emerald-100/80 text-lg md:text-xl font-medium max-w-2xl mx-auto">
              Have a question about our products or need a bulk quote? We&apos;re here to help you build better.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 -mt-12 relative z-20 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT: Contact Information */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <InfoCard 
                icon={Phone} 
                title="Call Hotline" 
                content="+880 1814-214220" 
                subContent="Available 9:00 AM - 10:00 PM"
                href="tel:+8801814214220"
              />
              <InfoCard 
                icon={WhatsAppIcon} 
                title="WhatsApp Us" 
                content="Chat on WhatsApp" 
                subContent="Fastest response time"
                href="https://wa.me/8801814214220"
                iconClassName="bg-emerald-500 text-white"
              />
              <InfoCard 
                icon={Mail} 
                title="Email Address" 
                content="info@varitosolutions.com" 
                subContent="For formal inquiries"
                href="mailto:info@varitosolutions.com"
              />
              <InfoCard 
                icon={MapPin} 
                title="Our Office" 
                content="Khatunganj, Chattogram" 
                subContent="123 Market Road, BD"
              />
              <InfoCard 
                icon={Clock} 
                title="Working Hours" 
                content="Saturday - Thursday" 
                subContent="10:00 AM - 8:00 PM"
              />
            </div>

            {/* RIGHT: Contact Form */}
            <div className="lg:col-span-7">
              <form 
                onSubmit={handleSubmit}
                className="bg-white p-8 md:p-12 rounded-[32px] border border-gray-100 shadow-xl flex flex-col gap-8"
              >
                <div className="flex flex-col gap-2">
                  <Badge variant="verified" className="w-fit bg-emerald-50 text-emerald-600 border-emerald-100 font-bold uppercase tracking-wider">
                    Quick Response
                  </Badge>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Send us a Message</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Full Name</label>
                    <Input required placeholder="Enter your name" className="h-14 px-5" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Phone Number</label>
                    <Input required placeholder="01XXXXXXXXX" type="tel" className="h-14 px-5" />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Email Address</label>
                    <Input required placeholder="yourname@email.com" type="email" className="h-14 px-5" />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Your Message</label>
                    <Textarea required placeholder="How can we help you today?" className="min-h-40 px-5" />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full py-8 text-xl font-black shadow-xl shadow-emerald-500/20 gap-3"
                  loading={isSubmitting}
                >
                  <Send className="size-6" /> Send Message
                </Button>

                <div className="text-xs text-gray-400 text-center font-medium">
                  By clicking send, you agree to our <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
                </div>
              </form>
            </div>
          </div>

          {/* FAQ Preview */}
          <section className="mt-24">
             <div className="flex flex-col items-center text-center gap-4 mb-12">
               <div className="size-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                 <MessageSquare className="size-6" />
               </div>
               <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Quick Help</h2>
               <p className="text-gray-500 font-medium max-w-xl">Find answers to common questions about orders, shipping, and payments.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { q: "How do I track my order?", a: "Once your order is shipped, you will receive an SMS with a tracking number." },
                  { q: "What is your return policy?", a: "We offer a 7-day no-questions-asked return policy for most unused items." },
                  { q: "Do you deliver outside CTG?", a: "Yes, we provide island-wide delivery across all districts of Bangladesh." },
                ].map((faq, i) => (
                  <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
                    <h4 className="font-black text-gray-900 leading-tight">{faq.q}</h4>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">{faq.a}</p>
                  </div>
                ))}
             </div>
             
             <div className="mt-12 text-center">
               <Link href="/help">
                 <Button variant="ghost" className="font-black uppercase tracking-widest text-primary hover:bg-emerald-50">
                    Visit Help Center <ArrowRight className="ml-2 size-4" />
                 </Button>
               </Link>
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
