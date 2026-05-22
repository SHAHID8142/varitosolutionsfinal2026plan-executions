/**
 * @file page.tsx
 * @path /account/profile
 * @description Customer profile page. Allows users to manage personal info
 *              and saved delivery addresses.
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
  Edit2, 
  Plus,
  ArrowLeft,
  LucideIcon
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { Badge } from "@/components/ui/badge"

// ─────────────────────────────────────────────
// PAGE COMPONENTS
// ─────────────────────────────────────────────

function SidebarLink({ href, icon: Icon, label, active }: { href: string, icon: LucideIcon, label: string, active?: boolean }) {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${active ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
    >
      <Icon className="size-5" />
      <span className="text-sm uppercase tracking-wider">{label}</span>
    </Link>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE EXPORT
// ─────────────────────────────────────────────

export default function ProfilePage() {
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
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase px-1">My Account</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT: Account Sidebar */}
            <aside className="lg:col-span-3 flex flex-col gap-2 sticky top-32">
              <SidebarLink href="/account/profile" icon={User} label="Profile" active />
              <SidebarLink href="/account/orders" icon={ShoppingBag} label="My Orders" />
              <SidebarLink href="/account/settings" icon={Settings} label="Settings" />
              <div className="h-px bg-gray-100 my-4" />
              <Button variant="ghost" className="justify-start gap-3 px-4 text-danger-500 hover:bg-danger-50 hover:text-danger-600 font-bold uppercase tracking-wider">
                <LogOut className="size-5" /> Logout
              </Button>
            </aside>

            {/* RIGHT: Content Area */}
            <div className="lg:col-span-9 flex flex-col gap-8 pb-20">
              
              {/* Personal Information */}
              <section className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Personal Information</h2>
                  <Button variant="ghost" size="sm" className="gap-2 text-primary font-bold">
                    <Edit2 className="size-4" /> Edit
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Full Name</label>
                    <Input disabled value="Rahat Chowdhury" className="h-12 bg-gray-50/50 border-gray-100" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Phone Number</label>
                    <Input disabled value="+880 1814-214220" className="h-12 bg-gray-50/50 border-gray-100" />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Email Address</label>
                    <Input disabled value="rahat@example.com" className="h-12 bg-gray-50/50 border-gray-100" />
                  </div>
                </div>
              </section>

              {/* Delivery Addresses */}
              <section className="flex flex-col gap-6">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Saved Addresses</h2>
                  <Button variant="outline" size="sm" className="gap-2 font-bold border-primary/20 text-primary bg-white">
                    <Plus className="size-4" /> Add New
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-primary ring-4 ring-primary/5 shadow-sm flex flex-col gap-4 relative">
                    <div className="flex items-center justify-between">
                      <Badge variant="verified" className="bg-emerald-50 text-emerald-600">Home</Badge>
                      <button className="text-gray-400 hover:text-gray-900 transition-colors"><Edit2 className="size-4" /></button>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="font-bold text-gray-900">Rahat Chowdhury</p>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed">
                        House 12, Flat 4A, Road 5, Block B, <br />
                        Nasirabad, Chattogram, 4000
                      </p>
                      <p className="text-sm text-gray-500 font-medium mt-2">+880 1814-214220</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4 opacity-70 hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-500">Office</Badge>
                      <button className="text-gray-400 hover:text-gray-900 transition-colors"><Edit2 className="size-4" /></button>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="font-bold text-gray-900">Rahat Chowdhury</p>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed">
                        123 Market Road, <br />
                        Khatunganj, Chattogram, 4200
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Password Security */}
              <section className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between gap-6">
                 <div className="flex flex-col gap-1">
                   <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight leading-none">Security</h3>
                   <p className="text-sm text-gray-500 font-medium">Update your password to keep your account safe.</p>
                 </div>
                 <Button variant="outline" className="font-bold border-gray-200">Update Password</Button>
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
