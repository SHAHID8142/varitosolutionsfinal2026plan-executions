/**
 * @file page.tsx
 * @path /admin/settings
 * @description Admin Settings page.
 *              Allows configuration of business profile, delivery rates, 
 *              and payment gateway integration.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { 
  Settings, 
  Store, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  Save,
  Globe,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = React.useState<"general" | "delivery" | "payments" | "security">("general")

  const tabs: { id: "general" | "delivery" | "payments" | "security"; label: string; icon: React.ElementType }[] = [
    { id: "general", label: "General", icon: Store },
    { id: "delivery", label: "Delivery", icon: Truck },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "security", label: "Security", icon: ShieldCheck },
  ]

  const handleSave = () => {
    toast.success("Settings saved successfully")
  }

  return (
    <div className="flex flex-col gap-10">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Settings className="size-6" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">Settings</h1>
          </div>
          <p className="text-gray-500 font-medium">Global configuration for your e-commerce platform.</p>
        </div>
        <Button onClick={handleSave} className="rounded-xl font-black shadow-lg shadow-emerald-500/20 gap-2 h-12 px-8">
          <Save className="size-5" /> Save All Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Sidebar Tabs */}
        <div className="lg:col-span-3 flex flex-col gap-2 p-2 rounded-[32px] bg-white border border-gray-100 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-6 h-12 rounded-2xl transition-all duration-300",
                  isActive 
                    ? "bg-emerald-50 text-emerald-700 font-black" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-600 font-bold"
                )}
              >
                <Icon className="size-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 flex flex-col gap-8">
          
          <main className="animate-in fade-in slide-in-from-right-4 duration-500">
            {activeTab === "general" && (
              <section className="bg-white p-8 md:p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Business Profile</h2>
                  <p className="text-gray-500 font-medium">Public information for invoices and contact pages.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Store Name</label>
                    <Input defaultValue="Varito Solutions" className="h-12 rounded-xl border-gray-100 font-bold" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Official Email</label>
                    <Input defaultValue="info@varitosolutions.com" className="h-12 rounded-xl border-gray-100 font-bold" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Support Phone</label>
                    <Input defaultValue="+880 1814-214220" className="h-12 rounded-xl border-gray-100 font-bold" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Currency</label>
                    <Input defaultValue="BDT (৳)" disabled className="h-12 rounded-xl border-gray-100 font-bold bg-gray-50" />
                  </div>
                </div>

                <Separator className="bg-gray-50" />

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Office Address</label>
                  <Input defaultValue="123 Market Road, Khatunganj, Chattogram, Bangladesh" className="h-12 rounded-xl border-gray-100 font-bold" />
                </div>
              </section>
            )}

            {activeTab === "delivery" && (
              <section className="bg-white p-8 md:p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Shipping Rates</h2>
                  <p className="text-gray-500 font-medium">Standard delivery charges for different regions.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-emerald-600">
                        <MapPin className="size-4" />
                      </div>
                      <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Inside Dhaka</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Delivery Charge (৳)</label>
                      <Input type="number" defaultValue="70" className="h-12 rounded-xl border-gray-100 bg-white font-black text-lg" />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-blue-600">
                        <Globe className="size-4" />
                      </div>
                      <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Outside Dhaka</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Delivery Charge (৳)</label>
                      <Input type="number" defaultValue="120" className="h-12 rounded-xl border-gray-100 bg-white font-black text-lg" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 rounded-[32px] bg-emerald-50 border border-emerald-100">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-emerald-900">Free Shipping Threshold</span>
                    <span className="text-xs font-bold text-emerald-600">Free delivery on orders above this amount.</span>
                  </div>
                  <div className="w-32">
                    <Input type="number" defaultValue="5000" className="h-12 rounded-xl border-emerald-200 bg-white font-black text-center" />
                  </div>
                </div>
              </section>
            )}

            {activeTab === "payments" && (
              <section className="bg-white p-8 md:p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Payment Gateways</h2>
                  <p className="text-gray-500 font-medium">Manage how you collect money from customers.</p>
                </div>

                <div className="flex flex-col gap-6">
                  {/* bKash Integration */}
                  <div className="flex items-center justify-between p-6 rounded-[32px] border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-2xl bg-pink-50 flex items-center justify-center shrink-0">
                        <span className="text-pink-600 font-black text-lg">b</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-900 uppercase tracking-widest">bKash (AamarPay)</span>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Connected</span>
                      </div>
                    </div>
                    <Button variant="ghost" className="rounded-xl font-bold text-gray-400">Configure</Button>
                  </div>

                  {/* Cash on Delivery */}
                  <div className="flex items-center justify-between p-6 rounded-[32px] border border-gray-100 bg-emerald-50/30 border-emerald-100">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                        <DollarSign className="size-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-emerald-900 uppercase tracking-widest">Cash on Delivery</span>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Enabled Globally</span>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-emerald-600 rounded-full relative">
                      <div className="absolute right-1 top-1 size-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>
              </section>
            )}
            
            {activeTab === "security" && (
              <section className="bg-white p-8 md:p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Security & Auth</h2>
                  <p className="text-gray-500 font-medium">Admin access control and session management.</p>
                </div>

                <div className="bg-red-50 p-8 rounded-[40px] border border-red-100 flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-black text-red-900 uppercase tracking-tight flex items-center gap-3">
                      <ShieldCheck className="size-5" /> Maintenance Mode
                    </h3>
                    <p className="text-sm font-medium text-red-700 leading-relaxed">
                      Enabling this will hide the public storefront and only allow admin access. Use this during major updates.
                    </p>
                  </div>
                  <Button variant="outline" className="w-fit border-red-200 bg-white text-red-600 hover:bg-red-100 rounded-xl font-black uppercase text-xs h-12 px-8">
                    Enable Maintenance Mode
                  </Button>
                </div>
              </section>
            )}
          </main>

        </div>

      </div>

    </div>
  )
}

import { MapPin, DollarSign } from "lucide-react"
