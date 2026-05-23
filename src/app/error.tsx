/**
 * @file error.tsx
 * @description Global error boundary for Varito Solutions.
 *              Displays a user-friendly error message and recovery actions.
 *              Must be a Client Component.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Button } from "@/components/ui/button"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { AlertTriangle, RefreshCcw, Home, Phone } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full text-center space-y-8 py-20">
          {/* Visual Element */}
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse opacity-50" />
            <div className="relative bg-white p-8 rounded-full shadow-xl border border-red-50">
              <AlertTriangle className="size-16 text-destructive" strokeWidth={1.5} />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4">
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
              কিছু ভুল হয়েছে
            </h1>
            <p className="text-xl font-bold text-gray-600">
              Something went wrong
            </p>
            <p className="text-gray-500 font-medium">
              দুঃখিত, আমাদের সিস্টেমে একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। দয়া করে আবার চেষ্টা করুন।
            </p>
            {error.digest && (
              <p className="text-[10px] text-gray-400 font-mono uppercase">
                Error ID: {error.digest}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-3 pt-4">
            <Button 
              onClick={reset}
              size="lg" 
              className="w-full rounded-2xl h-14 font-black uppercase tracking-widest text-sm shadow-lg shadow-emerald-500/20"
            >
              <RefreshCcw className="mr-2 size-5" /> আবার চেষ্টা করুন
            </Button>
            
            <Link href="/" passHref>
              <Button variant="outline" size="lg" className="w-full rounded-2xl h-14 font-bold bg-white border-emerald-100 text-emerald-700">
                <Home className="mr-2 size-5" /> হোমে ফিরে যান
              </Button>
            </Link>
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
