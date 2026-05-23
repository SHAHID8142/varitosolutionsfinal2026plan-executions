/**
 * @file page.tsx
 * @path /admin/content
 * @description Admin Content & Banner management page.
 *              Allows administrators to manage live storefront content.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { ImageIcon, Layout, Type, MousePointer2, Info } from "lucide-react"
import { BannerManager } from "@/components/admin/content/banner-manager"
import { cn } from "@/lib/utils"

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = React.useState<"banners" | "pages" | "navigation">("banners")

  const tabs: { id: "banners" | "pages" | "navigation"; label: string; icon: React.ElementType }[] = [
    { id: "banners", label: "Banners & Sliders", icon: ImageIcon },
    { id: "pages", label: "Custom Pages", icon: Layout },
    { id: "navigation", label: "Menu & Navigation", icon: MousePointer2 },
  ]

  return (
    <div className="flex flex-col gap-10">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
              <ImageIcon className="size-6" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">Content</h1>
          </div>
          <p className="text-gray-500 font-medium">Control the visual identity and messaging of your storefront.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-4 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-8 h-14 rounded-2xl transition-all duration-300 shrink-0",
                isActive 
                  ? "bg-primary text-white font-black shadow-lg shadow-primary/20" 
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-600 font-bold"
              )}
            >
              <Icon className="size-5" />
              <span className="text-sm uppercase tracking-widest">{tab.label}</span>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8">
          <main className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "banners" && <BannerManager />}
            {activeTab !== "banners" && (
              <div className="bg-white p-20 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center gap-4">
                <div className="size-20 rounded-3xl bg-gray-50 flex items-center justify-center text-gray-300">
                  <Layout className="size-10" />
                </div>
                <h2 className="text-xl font-black text-gray-900 uppercase">Coming Soon</h2>
                <p className="text-sm font-medium text-gray-400 max-w-xs">
                  This content management section is currently under development.
                </p>
              </div>
            )}
          </main>
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <section className="bg-emerald-950 p-8 rounded-[40px] text-white flex flex-col gap-6 relative overflow-hidden">
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Info className="size-5 text-primary/60" />
                <h3 className="text-sm font-black uppercase tracking-widest">Image Guidelines</h3>
              </div>
              <ul className="flex flex-col gap-4">
                <li className="flex gap-3">
                  <div className="size-5 rounded-full bg-primary/80 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">1</div>
                  <p className="text-xs font-medium text-primary/20/60 leading-relaxed">Hero banners: 1200x400px (3:1 aspect ratio).</p>
                </li>
                <li className="flex gap-3">
                  <div className="size-5 rounded-full bg-primary/80 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">2</div>
                  <p className="text-xs font-medium text-primary/20/60 leading-relaxed">Keep text away from the edges to avoid mobile cropping.</p>
                </li>
                <li className="flex gap-3">
                  <div className="size-5 rounded-full bg-primary/80 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">3</div>
                  <p className="text-xs font-medium text-primary/20/60 leading-relaxed">Use high-contrast PNG or WebP for crisp text rendering.</p>
                </li>
              </ul>
            </div>
            <ImageIcon className="absolute -right-8 -bottom-8 size-48 text-primary/30 rotate-12" />
          </section>

          <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Type className="size-4" /> Tip: Announcements
            </h3>
            <p className="text-sm font-bold text-gray-700 leading-relaxed">
              Announcement bars are best for time-sensitive alerts like holiday closures or specific discount codes. Keep them under 60 characters.
            </p>
          </section>
        </div>

      </div>

    </div>
  )
}
