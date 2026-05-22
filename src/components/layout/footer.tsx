/**
 * @file footer.tsx
 * @description Root layout footer component.
 *              Contains company info, quick links, and contact details.
 *              Updated to solid white background for brand logo visibility.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import * as React from "react"
import Link from "next/link"
import { Phone, Mail, MapPin, Package } from "lucide-react"
import { FacebookIcon } from "@/components/ui/icons/facebook"
import { InstagramIcon } from "@/components/ui/icons/instagram"
import { YoutubeIcon } from "@/components/ui/icons/youtube"
import { CodIcon } from "@/components/ui/icons/cod"
import { BkashIcon } from "@/components/ui/icons/bkash"
import { NagadIcon } from "@/components/ui/icons/nagad"
import { VisaIcon } from "@/components/ui/icons/visa"

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
  return (
    <footer className="bg-white text-gray-600 pt-16 pb-24 lg:pb-12 border-t border-gray-100">
      <div className="container mx-auto px-4">
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
              <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Facebook"><FacebookIcon className="size-5" /></a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Instagram"><InstagramIcon className="size-5" /></a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Youtube"><YoutubeIcon className="size-5" /></a>
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

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] font-bold uppercase tracking-widest text-gray-400">
          <p>© 2026 Varito Solutions. All Rights Reserved.</p>
          <div className="flex flex-col items-center md:items-end gap-3">
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">Secure Payments</span>
            <div className="flex items-center gap-5">
              <CodIcon className="h-6 w-auto" />
              <BkashIcon className="h-6 w-auto" />
              <NagadIcon className="h-6 w-auto" />
              <VisaIcon className="h-6 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
