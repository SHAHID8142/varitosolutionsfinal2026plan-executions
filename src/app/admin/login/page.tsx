/**
 * @file page.tsx
 * @path /admin/login
 * @description Admin login page with phone OTP verification.
 *              Step-based flow: 1. Enter Phone -> 2. Verify OTP.
 *              Strictly for authorized business administrators only.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { Phone, Lock, ArrowRight, ShieldCheck, Package2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function AdminLoginPage() {
  const [step, setStep] = React.useState<"phone" | "otp">("phone")
  const [phone, setPhone] = React.useState("")
  const [otp, setOtp] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || phone.length < 11) {
      toast.error("Please enter a valid phone number")
      return
    }
    
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setStep("otp")
      toast.success("OTP sent to your phone!")
    }, 1500)
  }

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp || otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP")
      return
    }

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Welcome back, Super Admin!")
      window.location.href = "/admin"
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-emerald-950 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-900/30 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-900/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-[480px] z-10">
        
        {/* Branding */}
        <div className="flex flex-col items-center gap-6 mb-12">
          <div className="size-20 rounded-[2rem] bg-emerald-600 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20">
            <Package2 className="size-10" />
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Varito Solutions</h1>
            <Badge variant="secondary" className="bg-emerald-800/50 text-emerald-400 border-emerald-700/50 uppercase tracking-widest text-[10px] px-3">
              Admin Gateway
            </Badge>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl">
          
          {step === "phone" ? (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Security Login</h2>
                <p className="text-emerald-100/60 text-sm font-medium">Enter your registered admin phone number to receive a secure access code.</p>
              </div>

              <form onSubmit={handleSendOTP} className="flex flex-col gap-6">
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-emerald-400" />
                  <Input 
                    type="tel" 
                    placeholder="01712XXXXXX" 
                    className="h-16 pl-14 pr-6 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-emerald-800 text-lg font-bold focus:bg-white/10 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-lg gap-3 shadow-xl shadow-emerald-500/10"
                  loading={isLoading}
                >
                  Send Access Code <ArrowRight className="size-5" />
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button 
                onClick={() => setStep("phone")}
                className="flex items-center gap-2 text-xs font-black text-emerald-400 uppercase tracking-widest hover:text-white transition-colors w-fit"
              >
                <ArrowLeft className="size-4" /> Change Number
              </button>

              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Verify Identity</h2>
                <p className="text-emerald-100/60 text-sm font-medium">
                  We&apos;ve sent a 6-digit code to <span className="text-emerald-300 font-bold">{phone}</span>. Please enter it below.
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="flex flex-col gap-6">
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-emerald-400" />
                  <Input 
                    type="text" 
                    maxLength={6}
                    placeholder="X X X X X X" 
                    className="h-16 pl-14 pr-6 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-emerald-800 text-2xl font-black tracking-[0.5em] focus:bg-white/10 focus:ring-4 focus:ring-emerald-500/20 transition-all text-center"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-lg gap-3 shadow-xl shadow-emerald-500/10"
                  loading={isLoading}
                >
                  Enter Dashboard <ShieldCheck className="size-6" />
                </Button>

                <div className="flex justify-center">
                  <button type="button" className="text-xs font-bold text-emerald-500 hover:underline">
                    Resend code in 0:45
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 flex flex-col items-center gap-6">
          <p className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.3em] text-center max-w-[300px] leading-relaxed">
            Strictly authorized business use only. All access attempts are logged and monitored.
          </p>
          <Link href="/" className="text-xs font-bold text-emerald-500 hover:text-white transition-colors underline underline-offset-4">
            Return to Public Store
          </Link>
        </div>

      </div>
    </div>
  )
}
