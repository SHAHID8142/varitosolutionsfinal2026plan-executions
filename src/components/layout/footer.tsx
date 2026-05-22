/**
 * @file footer.tsx
 * @description Root layout footer component.
 *              Contains company info, quick links, and contact details.
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
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-24 lg:pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 text-white shrink-0">
              <Package className="size-8 text-primary" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight leading-none">Varito</span>
                <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Solutions</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Your trusted partner for premium sanitary ware and high-quality packaging materials. 
              Delivering reliability to your doorstep across Bangladesh.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white transition-colors" aria-label="Facebook"><FacebookIcon className="size-5" /></a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Instagram"><InstagramIcon className="size-5" /></a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Youtube"><YoutubeIcon className="size-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Shop</h4>
              <ul className="flex flex-col gap-4">
                {FOOTER_LINKS.shop.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm hover:text-primary transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Support</h4>
              <ul className="flex flex-col gap-4">
                {FOOTER_LINKS.support.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm hover:text-primary transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Get in Touch</h4>
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="size-5 text-primary shrink-0" />
                <span>123 Market Road, Khatunganj, Chattogram, Bangladesh</span>
              </li>
              <li className="flex gap-3">
                <Phone className="size-5 text-primary shrink-0" />
                <a href="tel:+8801814214220" className="hover:text-white transition-colors">+880 1814-214220</a>
              </li>
              <li className="flex gap-3">
                <Mail className="size-5 text-primary shrink-0" />
                <a href="mailto:info@varitosolutions.com" className="hover:text-white transition-colors">info@varitosolutions.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] font-medium uppercase tracking-widest text-gray-500">
          <p>© 2026 Varito Solutions. All Rights Reserved.</p>
          <div className="flex flex-col items-center md:items-end gap-3">
            <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">Secure Payments</span>
            <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
              <CodIcon className="size-6" />
              <BkashIcon className="size-6" />
              <NagadIcon className="size-6" />
              <VisaIcon className="size-6" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
