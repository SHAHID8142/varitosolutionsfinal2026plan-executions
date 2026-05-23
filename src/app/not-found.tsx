/**
 * @file not-found.tsx
 * @description Global 404 page for Varito Solutions.
 *              Displays a friendly error message and navigation options.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

import * as React from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Button } from "@/components/ui/button"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { Home, Search, Phone } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full text-center space-y-8 py-20">
          {/* Visual Element */}
          <div className="relative inline-block">
            <div className="text-[120px] font-black text-primary/20 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white p-6 rounded-3xl shadow-xl shadow-primary/10 border border-primary/10">
                <Search className="size-16 text-primary" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4">
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
              পৃষ্ঠাটি পাওয়া যায়নি
            </h1>
            <p className="text-xl font-bold text-gray-600">
              Page Not Found
            </p>
            <p className="text-gray-500 font-medium">
              দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি সরানো হয়েছে অথবা এটি আর নেই।
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-3 pt-4">
            <Link href="/" passHref>
              <Button size="lg" className="w-full rounded-2xl h-14 font-black uppercase tracking-widest text-sm shadow-lg shadow-primary/20">
                <Home className="mr-2 size-5" /> হোম পেজে ফিরে যান
              </Button>
            </Link>
            
            <div className="grid grid-cols-2 gap-3">
              <Link href="/products" passHref>
                <Button variant="outline" size="lg" className="w-full rounded-2xl h-14 font-bold bg-white border-primary/20 text-primary">
                  পণ্য দেখুন
                </Button>
              </Link>
              <Link href="/contact" passHref>
                <Button variant="outline" size="lg" className="w-full rounded-2xl h-14 font-bold bg-white border-primary/20 text-primary">
                  যোগাযোগ
                </Button>
              </Link>
            </div>
          </div>

          {/* Help Text */}
          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-medium flex items-center justify-center gap-2">
              <Phone className="size-4" /> সহযোগিতার জন্য কল করুন: <span className="text-primary font-bold">+৮৮০১৭১৪-২১১২২০</span>
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </div>
  )
}
