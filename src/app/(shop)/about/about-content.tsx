/**
 * @file page.tsx
 * @path /about
 * @description About Us page for Varito Solutions.
 *              Showcases company mission, values, trust signals, and location.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import Image from "next/image"
import { 
  ShieldCheck, 
  Target, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight,
  Package,
  Award,
  Globe,
  LucideIcon
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { Badge } from "@/components/ui/badge"
import { OrganizationSchema } from "@/components/shop/organization-schema"

// ─────────────────────────────────────────────
// PAGE COMPONENTS
// ─────────────────────────────────────────────

interface ValueCardProps {
  icon: LucideIcon
  title: string
  description: string
}

function ValueCard({ icon: Icon, title, description }: ValueCardProps) {
  return (
    <div className="flex flex-col gap-4 p-8 rounded-3xl bg-white border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="size-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
        <Icon className="size-8" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">{title}</h3>
        <p className="text-sm text-gray-500 font-medium leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE EXPORT
// ─────────────────────────────────────────────

export default function AboutContent() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <OrganizationSchema />
      <Header />
      
      <main className="flex-1">
        
        {/* Hero Section */}
        <section className="relative py-20 bg-emerald-50 overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 size-96 rounded-full bg-emerald-100/50 blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <Breadcrumb
              items={[{ label: "About Us" }]}
              className="mb-8"
            />
            
            <div className="max-w-3xl">
              <Badge variant="verified" className="bg-white text-emerald-600 border-emerald-100 mb-6 py-1.5 px-4 font-bold">
                ESTABLISHED 2024
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-8">
                Your Trusted Partner for <span className="text-emerald-600">Premium Solutions</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed">
                Varito Solutions is a leading e-commerce platform based in Chattogram, Bangladesh. 
                We specialize in luxury sanitary ware and high-grade packaging materials, 
                serving both individual homeowners and bulk business clients.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <Image 
                src="https://placehold.co/800x600/10b981/white.png?text=Our+Mission" 
                alt="Varito Office" 
                fill 
                className="object-cover"
              />
            </div>
            
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">Our Mission</h2>
                <div className="h-1.5 w-20 bg-emerald-500 rounded-full" />
              </div>
              
              <p className="text-gray-600 text-lg font-medium leading-relaxed">
                At Varito Solutions, we believe that quality shouldn&apos;t be a compromise. Our mission is to bridge the gap between premium global standards and the local Bangladesh market.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="size-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <Award className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900">Unmatched Quality</h4>
                    <p className="text-sm text-gray-500">Curated products from top brands.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="size-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <Globe className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900">Island-wide Delivery</h4>
                    <p className="text-sm text-gray-500">Reaching every corner of Bangladesh.</p>
                  </div>
                </div>
              </div>

              <Button size="lg" className="w-fit px-8 mt-4 shadow-xl shadow-emerald-500/20">
                Explore Our Products <ArrowRight className="ml-2 size-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4 text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase mb-4">Our Core Values</h2>
            <p className="text-gray-500 font-medium max-w-xl mx-auto">The principles that guide everything we do at Varito Solutions.</p>
          </div>
          
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard 
              icon={ShieldCheck} 
              title="Absolute Trust" 
              description="We operate with transparency. No hidden charges, authentic products, and reliable service." 
            />
            <ValueCard 
              icon={Target} 
              title="Client Focus" 
              description="Whether it's one faucet or 10,000 cartons, every client receives our dedicated attention." 
            />
            <ValueCard 
              icon={Package} 
              title="Reliability" 
              description="We understand the importance of timelines in construction and business logistics." 
            />
          </div>
        </section>

        {/* Location Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="bg-emerald-950 rounded-[40px] p-8 md:p-16 text-white overflow-hidden relative">
              {/* Decor */}
              <div className="absolute bottom-0 right-0 size-80 bg-emerald-500/10 rounded-full translate-y-1/2 translate-x-1/2 blur-3xl" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                <div className="flex flex-col gap-10">
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase">Visit Our Hub</h2>
                  
                  <div className="flex flex-col gap-8">
                    <div className="flex gap-6">
                      <MapPin className="size-8 text-emerald-400 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-1">Our Location</span>
                        <p className="text-lg font-medium opacity-90 leading-relaxed">
                          123 Market Road, Khatunganj,<br />
                          Chattogram, Bangladesh
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-6">
                      <Phone className="size-8 text-emerald-400 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-1">Call Us</span>
                        <p className="text-lg font-medium opacity-90">+880 1814-214220</p>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <Mail className="size-8 text-emerald-400 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-1">Email Support</span>
                        <p className="text-lg font-medium opacity-90">hello@varito.com</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-4">
                    <Button className="bg-emerald-500 text-white hover:bg-emerald-400 px-8 py-7 text-lg font-black">
                      Get Directions
                    </Button>
                    <Button variant="ghost" className="text-white border border-white/20 px-8 py-7 text-lg font-black">
                      Contact Sales
                    </Button>
                  </div>
                </div>

                <div className="relative aspect-video lg:aspect-auto rounded-3xl overflow-hidden bg-emerald-900/50 border border-white/10 shadow-2xl">
                   {/* Mock Map Placeholder */}
                   <div className="absolute inset-0 flex items-center justify-center text-emerald-800 font-black text-2xl uppercase tracking-[0.3em] opacity-20">
                     Interactive Map
                   </div>
                   <Image 
                     src="https://placehold.co/800x600/064e3b/white.png?text=Map+Location" 
                     alt="Map" 
                     fill 
                     className="object-cover mix-blend-overlay"
                   />
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                     <div className="size-8 rounded-full bg-emerald-500 flex items-center justify-center animate-bounce shadow-lg shadow-emerald-500/50">
                       <MapPin className="size-5 text-white" />
                     </div>
                     <div className="size-20 rounded-full bg-emerald-500/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </div>
  )
}
