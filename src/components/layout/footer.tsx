/**
 * @file footer.tsx
 * @description Root layout footer component.
 *              Contains company info, quick links, and contact details.
 *              Updated to solid white background for brand logo visibility.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { Phone, Mail, MapPin, Package, Send } from "lucide-react"
import { FacebookIcon } from "@/components/ui/icons/facebook"
import { InstagramIcon } from "@/components/ui/icons/instagram"
import { YoutubeIcon } from "@/components/ui/icons/youtube"
import { CodIcon } from "@/components/ui/icons/cod"
import { BkashIcon } from "@/components/ui/icons/bkash"
import { NagadIcon } from "@/components/ui/icons/nagad"
import { VisaIcon } from "@/components/ui/icons/visa"
import { PathaoIcon } from "@/components/ui/icons/pathao"
import { RedxIcon } from "@/components/ui/icons/redx"
import { SteadfastIcon } from "@/components/ui/icons/steadfast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

const FOOTER_LINKS = {
  shop: [
    { label: "All Products", href: "/products" },
    { label: "Categories", href: "/categories" },
    { label: "Flash Deals", href: "/deals" },
    { label: "New Arrivals", href: "/new" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Track Order", href: "/track" },
    { label: "Returns Policy", href: "/returns" },
    { label: "Shipping Info", href: "/shipping" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
}

export function Footer() {
  const [email, setEmail] = React.useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      toast.success("Subscribed successfully! Thank you for joining our newsletter.")
      setEmail("")
    }
  }

  const handleSocialClick = (platform: string) => {
    toast.info(`Follow us on ${platform} - Official page coming soon!`)
  }

  return (
    <footer className="bg-white text-gray-600 pt-16 pb-24 lg:pb-12 border-t border-gray-100">
      <div className="container mx-auto px-4">
        
        {/* Newsletter Section */}
        <div className="mb-16 p-8 md:p-12 rounded-[40px] bg-emerald-50 border border-emerald-100 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-2 max-w-lg text-center lg:text-left">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase">Join our Newsletter</h3>
            <p className="text-gray-600 font-medium">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2">
            <Input 
              type="email" 
              required 
              placeholder="your@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 px-6 rounded-2xl bg-white border-gray-200" 
            />
            <Button type="submit" size="lg" className="h-14 px-8 rounded-2xl gap-2 font-black shadow-lg shadow-primary/20">
              <Send className="size-5" /> Join
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 text-gray-900 shrink-0">
              <Package className="size-8 text-primary" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight leading-none">Varito</span>
                <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Solutions</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs font-medium">
              Your trusted partner for premium sanitary ware and high-quality packaging materials. 
              Delivering reliability to your doorstep across Bangladesh.
            </p>
            <div className="flex items-center gap-4">
              <button onClick={() => handleSocialClick("Facebook")} className="text-gray-400 hover:text-primary transition-colors" aria-label="Facebook"><FacebookIcon className="size-5" /></button>
              <button onClick={() => handleSocialClick("Instagram")} className="text-gray-400 hover:text-primary transition-colors" aria-label="Instagram"><InstagramIcon className="size-5" /></button>
              <button onClick={() => handleSocialClick("YouTube")} className="text-gray-400 hover:text-primary transition-colors" aria-label="Youtube"><YoutubeIcon className="size-5" /></button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            <div>
              <h4 className="text-gray-900 font-black mb-6 uppercase tracking-widest text-xs">Shop</h4>
              <ul className="flex flex-col gap-4">
                {FOOTER_LINKS.shop.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm font-bold hover:text-primary transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-black mb-6 uppercase tracking-widest text-xs">Support</h4>
              <ul className="flex flex-col gap-4">
                {FOOTER_LINKS.support.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm font-bold hover:text-primary transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-gray-900 font-black mb-6 uppercase tracking-widest text-xs">Get in Touch</h4>
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="size-5 text-primary shrink-0" />
                <span className="font-medium">123 Market Road, Khatunganj, Chattogram, Bangladesh</span>
              </li>
              <li className="flex gap-3">
                <Phone className="size-5 text-primary shrink-0" />
                <a href="tel:+8801814214220" className="font-bold text-gray-900 hover:text-primary transition-colors">+880 1814-214220</a>
              </li>
              <li className="flex gap-3">
                <Mail className="size-5 text-primary shrink-0" />
                <a href="mailto:info@varitosolutions.com" className="font-bold text-gray-900 hover:text-primary transition-colors">info@varitosolutions.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Partners & Payments */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">Courier Partners</span>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
              <PathaoIcon className="h-6 w-auto" />
              <RedxIcon className="h-6 w-auto" />
              <SteadfastIcon className="h-5 w-auto" />
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">We Accept</span>
            <div className="flex items-center gap-5">
              <CodIcon className="h-6 w-auto" />
              <BkashIcon className="h-6 w-auto" />
              <NagadIcon className="h-6 w-auto" />
              <VisaIcon className="h-6 w-auto" />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-gray-100 text-center text-[11px] font-bold uppercase tracking-widest text-gray-400">
          <p>© 2026 Varito Solutions. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
