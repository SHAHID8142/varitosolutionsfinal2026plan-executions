/**
 * @file page.tsx
 * @path /admin/login
 * @description Admin login page with email + password authentication.
 *              Calls POST /api/admin/auth/login, stores the JWT in a cookie,
 *              then redirects to /admin dashboard.
 *              Strictly for authorized business administrators only.
 *
 * @owner    Gemini Design Agent (UI) + Antigravity Inspector (logic wiring)
 * @updated  2026-05-24
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { Mail, Lock, ArrowRight, ShieldCheck, Package2 } from "lucide-react"
import { usePostHog } from "posthog-js/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

/**
 * AdminLoginPage — Email + password login form for admin portal.
 * On success, saves the Supabase access token as a cookie and redirects to /admin.
 */
export default function AdminLoginPage() {
  const posthog = usePostHog()

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  // ─── Form submit handler ─────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password.")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? "Login failed. Please check your credentials.")
      }

      const { accessToken, refreshToken, expiresAt, admin } = result.data

      // Store tokens in cookies for middleware to read
      const maxAge = expiresAt ? expiresAt - Math.floor(Date.now() / 1000) : 3600
      document.cookie = `sb-access-token=${accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`
      document.cookie = `sb-refresh-token=${refreshToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`

      // Track login event with PostHog
      posthog.identify(admin.id, {
        email: admin.email,
        role: admin.role,
      })
      posthog.capture("admin_login_success", { role: admin.role })

      toast.success(`Welcome back, ${admin.name ?? "Administrator"}!`)

      // Hard redirect so middleware picks up the new cookie fresh
      window.location.href = "/admin"
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred.")
      posthog.capture("admin_login_failed", { email })
    } finally {
      setIsLoading(false)
    }
  }

  // ─── Render ──────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-emerald-950 relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-900/30 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-900/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-[480px] z-10">

        {/* Branding */}
        <div className="flex flex-col items-center gap-6 mb-12">
          <div className="size-20 rounded-[2rem] bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/20">
            <Package2 className="size-10" />
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Varito Solutions</h1>
            <Badge
              variant="secondary"
              className="bg-primary/30 text-primary/60 border-primary/30 uppercase tracking-widest text-[10px] px-3"
            >
              Admin Gateway
            </Badge>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] md:rounded-[40px] p-6 md:p-12 shadow-2xl">
          <div className="flex flex-col gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="flex flex-col gap-2">
              <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">
                Security Login
              </h2>
              <p className="text-white/40 text-xs md:text-sm font-medium leading-relaxed">
                Enter your administrator email and password to access the dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4 md:gap-5">
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-primary/60" />
                <Input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@varitosolutions.com"
                  className="h-14 md:h-16 pl-14 pr-6 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-white/20 text-base md:text-lg font-bold focus:bg-white/10 focus:ring-4 focus:ring-primary/20 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-primary/60" />
                <Input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="h-14 md:h-16 pl-14 pr-6 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-white/20 text-base md:text-lg font-bold focus:bg-white/10 focus:ring-4 focus:ring-primary/20 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                id="admin-login-btn"
                type="submit"
                size="lg"
                className="h-14 md:h-16 rounded-2xl bg-primary hover:bg-primary/90 text-emerald-950 font-black text-base md:text-lg gap-3 shadow-xl shadow-primary/10 mt-2"
                loading={isLoading}
              >
                Enter Dashboard <ShieldCheck className="size-6" />
                {!isLoading && <ArrowRight className="size-5" />}
              </Button>
            </form>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 flex flex-col items-center gap-6">
          <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em] text-center max-w-[300px] leading-relaxed">
            Strictly authorized business use only. All access attempts are logged and monitored.
          </p>
          <Link
            href="/"
            className="text-xs font-bold text-primary/60 hover:text-white transition-colors underline underline-offset-4"
          >
            Return to Public Store
          </Link>
        </div>

      </div>
    </div>
  )
}
