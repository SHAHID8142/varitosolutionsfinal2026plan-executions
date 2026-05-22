/**
 * @file banner-manager.tsx
 * @description Component for managing homepage banners and announcements.
 *              Supports multiple banner types with preview and scheduling.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { 
  Plus, 
  Image as ImageIcon, 
  MoveUp, 
  MoveDown, 
  Trash2, 
  ExternalLink,
  Settings2,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import Image from "next/image"

// ─────────────────────────────────────────────
// TYPES & MOCK DATA
// ─────────────────────────────────────────────

interface Banner {
  id: string
  title: string
  type: "hero" | "secondary" | "announcement"
  image?: string
  link: string
  status: "active" | "scheduled" | "draft"
  order: number
}

const MOCK_BANNERS: Banner[] = [
  { id: "1", title: "Flash Sale - 20% OFF", type: "hero", image: "https://placehold.co/1200x400/10b981/white.png?text=Flash+Sale+Hero", link: "/deals", status: "active", order: 1 },
  { id: "2", title: "New Sanitary Arrivals", type: "hero", image: "https://placehold.co/1200x400/065f46/white.png?text=New+Arrivals", link: "/category/sanitary-ware", status: "active", order: 2 },
  { id: "3", title: "Free Shipping Promo", type: "secondary", image: "https://placehold.co/600x300/10b981/white.png?text=Free+Shipping", link: "/shipping", status: "active", order: 3 },
  { id: "4", title: "🔥 Flash Sale: 20% OFF on all Packaging!", type: "announcement", link: "/deals", status: "active", order: 4 },
]

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export function BannerManager() {
  const [banners, setBanners] = React.useState<Banner[]>(MOCK_BANNERS)

  const handleToggleStatus = (id: string) => {
    setBanners(banners.map(banner => 
      banner.id === id 
        ? { ...banner, status: banner.status === "active" ? "draft" : "active" } 
        : banner
    ))
    toast.success("Banner status updated")
  }

  const handleDelete = (id: string) => {
    setBanners(banners.filter(b => b.id !== id))
    toast.error("Banner removed")
  }

  return (
    <div className="flex flex-col gap-8">
      
      {/* Banner Type Tabs */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <ImageIcon className="text-emerald-600 size-6" /> Live Store Content
          </h2>
          <Button size="sm" className="rounded-xl font-black gap-2 h-10 shadow-lg shadow-emerald-500/10">
            <Plus className="size-4" /> Add New Banner
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {banners.map((banner) => (
            <div 
              key={banner.id} 
              className={cn(
                "group relative bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row items-center transition-all hover:shadow-xl hover:shadow-gray-200/40",
                banner.status === "draft" && "opacity-60"
              )}
            >
              {/* Type Indicator */}
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="outline" className="bg-white/90 backdrop-blur-md border-gray-200 font-black uppercase text-[8px] tracking-widest px-2 h-5">
                  {banner.type}
                </Badge>
              </div>

              {/* Preview Image */}
              <div className="w-full md:w-64 h-32 md:h-40 bg-gray-50 shrink-0 relative overflow-hidden">
                {banner.image ? (
                  <Image src={banner.image} alt={banner.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-emerald-600/20">
                    <Zap className="size-12 fill-current" />
                  </div>
                )}
                {banner.type === "announcement" && (
                  <div className="w-full h-full bg-emerald-950 flex items-center justify-center p-6 text-center">
                    <span className="text-[10px] font-bold text-white line-clamp-2 leading-relaxed">
                      {banner.title}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
                <div className="flex flex-col gap-1 min-w-0">
                  <h3 className="text-sm md:text-base font-black text-gray-900 truncate">{banner.title}</h3>
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                    <span className="flex items-center gap-1.5"><ExternalLink className="size-3" /> {banner.link}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end mr-4 hidden sm:flex">
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      banner.status === "active" ? "text-emerald-600" : "text-gray-400"
                    )}>
                      {banner.status}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400">Click to change</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-gray-100" onClick={() => handleToggleStatus(banner.id)}>
                      <Settings2 className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-gray-100">
                      <MoveUp className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-gray-100">
                      <MoveDown className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-500" onClick={() => handleDelete(banner.id)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
