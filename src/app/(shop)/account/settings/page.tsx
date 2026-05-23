/**
 * @file page.tsx
 * @path /account/settings
 * @description Customer account settings page. Allows users to manage
 *              notifications and account preferences.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { 
  User, 
  Settings, 
  ShoppingBag, 
  LogOut, 
  ArrowLeft,
  LucideIcon,
  Bell,
  Lock,
  Globe
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { toast } from "sonner"

// ─────────────────────────────────────────────
// PAGE COMPONENTS
// ─────────────────────────────────────────────

function SidebarLink({ href, icon: Icon, label, active }: { href: string, icon: LucideIcon, label: string, active?: boolean }) {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${active ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
    >
      <Icon className="size-5" />
      <span className="text-sm uppercase tracking-wider">{label}</span>
    </Link>
  )
}

function SettingItem({ icon: Icon, title, description, actionLabel, onClick }: { 
  icon: LucideIcon, 
  title: string, 
  description: string, 
  actionLabel: string,
  onClick: () => void 
}) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="size-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
          <Icon className="size-6" />
        </div>
        <div className="flex flex-col gap-0.5">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 font-medium">{description}</p>
        </div>
      </div>
      <Button variant="outline" size="sm" className="font-bold border-gray-200" onClick={onClick}>
        {actionLabel}
      </Button>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE EXPORT
// ─────────────────────────────────────────────

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          
          {/* Header */}
          <div className="flex flex-col gap-6 mb-10">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors w-fit"
            >
              <ArrowLeft className="size-4" /> Back to Home
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase px-1">Account Settings</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT: Account Sidebar */}
            <aside className="lg:col-span-3 flex flex-col gap-2 sticky top-32">
              <SidebarLink href="/account/profile" icon={User} label="Profile" />
              <SidebarLink href="/account/orders" icon={ShoppingBag} label="My Orders" />
              <SidebarLink href="/account/settings" icon={Settings} label="Settings" active />
              <div className="h-px bg-gray-100 my-4" />
              <Button variant="ghost" className="justify-start gap-3 px-4 text-danger-500 hover:bg-danger-50 hover:text-danger-600 font-bold uppercase tracking-wider">
                <LogOut className="size-5" /> Logout
              </Button>
            </aside>

            {/* RIGHT: Content Area */}
            <div className="lg:col-span-9 flex flex-col gap-6 pb-20">
              
              <SettingItem 
                icon={Bell}
                title="Notifications"
                description="Manage how you receive alerts about your orders and offers."
                actionLabel="Configure"
                onClick={() => toast.info("Notification settings coming soon.")}
              />

              <SettingItem 
                icon={Lock}
                title="Privacy"
                description="Manage your data and account visibility preferences."
                actionLabel="Manage"
                onClick={() => toast.info("Privacy settings coming soon.")}
              />

              <SettingItem 
                icon={Globe}
                title="Language"
                description="Select your preferred language (English / Bangla)."
                actionLabel="Change"
                onClick={() => toast.info("Language selection coming soon.")}
              />

              <section className="mt-10 p-10 rounded-[40px] bg-emerald-950 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col gap-4 max-w-lg">
                  <h2 className="text-3xl font-black uppercase tracking-tight">Need Help?</h2>
                  <p className="text-primary/30/80 font-medium">
                    Our support team is available 24/7 to help you with any account or order issues.
                  </p>
                  <Button variant="primary" className="w-fit bg-primary hover:bg-primary/90 text-white font-black px-8 h-12 mt-2">
                    Contact Support
                  </Button>
                </div>
                <div className="absolute top-0 right-0 size-64 bg-emerald-900/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              </section>

            </div>
          </div>

        </div>
      </main>

      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </div>
  )
}
