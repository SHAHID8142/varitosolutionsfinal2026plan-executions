/**
 * @file product-form.tsx
 * @description Comprehensive form for creating and editing products.
 *              Includes details, pricing, inventory, and image management.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { 
  Save, 
  X, 
  Info, 
  DollarSign, 
  Warehouse, 
  Image as ImageIcon,
  Trash2,
  Globe
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageUploader } from "./image-uploader"
import { toast } from "sonner"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface ProductData {
  id?: string
  name?: string
  sku?: string
  category?: string
  price?: number
  costPrice?: number
  stock?: number
  status?: string
  images?: string[]
}

interface ProductFormProps {
  initialData?: ProductData
  isEditing?: boolean
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const [activeSection, setActiveSection] = React.useState<"basic" | "pricing" | "media">("basic")
  const [images, setImages] = React.useState<string[]>(initialData?.images || [])
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast.success(isEditing ? "Product updated successfully" : "Product created successfully")
      window.location.href = "/admin/products"
    }, 1500)
  }

  const sections: { id: "basic" | "pricing" | "media"; label: string; icon: React.ElementType }[] = [
    { id: "basic", label: "Basic Info", icon: Info },
    { id: "pricing", label: "Pricing & Stock", icon: DollarSign },
    { id: "media", label: "Product Media", icon: ImageIcon },
  ]

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      
      {/* Form Navigation Header */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-3xl bg-white border border-gray-100 shadow-sm w-fit">
        {sections.map((section) => {
          const Icon = section.icon
          const isActive = activeSection === section.id
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex items-center gap-3 px-6 h-12 rounded-2xl transition-all duration-300",
                isActive 
                  ? "bg-primary text-white font-black shadow-lg shadow-primary/20" 
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-600 font-bold"
              )}
            >
              <Icon className="size-4" />
              <span className="text-sm">{section.label}</span>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Main Form Fields */}
        <div className="lg:col-span-8">
          
          {/* Section: Basic Info */}
          {activeSection === "basic" && (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Essential Details</h2>
                  <p className="text-gray-500 font-medium">Define the core identity of your product.</p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Product Name (English) *</label>
                    <Input defaultValue={initialData?.name} placeholder="e.g. Luxury Emerald Gold Faucet" className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 font-bold text-gray-900 focus:bg-white" required />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Product Name (Bengali)</label>
                    <Input placeholder="উন্নত মানের কল" className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 font-bold text-gray-900 focus:bg-white" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Category *</label>
                      <Select defaultValue={initialData?.category ?? "sanitary"}>
                        <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 font-bold text-gray-900">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl p-2 border-gray-100">
                          <SelectItem value="sanitary" className="rounded-xl font-bold h-10">Sanitary Ware</SelectItem>
                          <SelectItem value="packaging" className="rounded-xl font-bold h-10">Packaging Materials</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">SKU (Unique) *</label>
                      <Input defaultValue={initialData?.sku} placeholder="VR-SAN-001" className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 font-bold text-gray-900 focus:bg-white uppercase" required />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Full Description *</label>
                    <Textarea 
                      placeholder="Describe the product features, benefits, and specifications..." 
                      className="min-h-[200px] rounded-[32px] border-gray-100 bg-gray-50/50 p-8 font-medium text-gray-700 focus:bg-white" 
                      required 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Pricing & Stock */}
          {activeSection === "pricing" && (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-10">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Pricing & Inventory</h2>
                  <p className="text-gray-500 font-medium">Configure margins, sales, and stock levels.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="flex flex-col gap-6 p-8 rounded-[32px] bg-primary/5 border border-primary/20">
                    <h3 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                      <DollarSign className="size-4" /> Financials
                    </h3>
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cost Price (BDT) *</label>
                        <Input type="number" defaultValue={initialData?.costPrice} placeholder="2200" className="h-12 rounded-xl border-primary/20 bg-white font-bold" required />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Selling Price (BDT) *</label>
                        <Input type="number" defaultValue={initialData?.price} placeholder="3800" className="h-12 rounded-xl border-primary/20 bg-white font-bold" required />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sale Price (Optional)</label>
                        <Input type="number" placeholder="3200" className="h-12 rounded-xl border-primary/20 bg-white font-bold" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6 p-8 rounded-[32px] bg-blue-50/50 border border-blue-100">
                    <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                      <Warehouse className="size-4" /> Inventory
                    </h3>
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Initial Stock *</label>
                        <Input type="number" defaultValue={initialData?.stock} placeholder="100" className="h-12 rounded-xl border-blue-100 bg-white font-bold" required />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Minimum Order Qty</label>
                        <Input type="number" defaultValue="1" className="h-12 rounded-xl border-blue-100 bg-white font-bold" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Unit</label>
                        <Select defaultValue="piece">
                          <SelectTrigger className="h-12 rounded-xl border-blue-100 bg-white font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-blue-100">
                            <SelectItem value="piece">Piece</SelectItem>
                            <SelectItem value="roll">Roll</SelectItem>
                            <SelectItem value="pack">Pack</SelectItem>
                            <SelectItem value="meter">Meter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Media */}
          {activeSection === "media" && (activeSection === "media" && (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Product Showcase</h2>
                  <p className="text-gray-500 font-medium">Upload high-quality images to attract customers. The first image will be the primary one.</p>
                </div>

                <ImageUploader images={images} onChange={setImages} maxImages={6} />
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar: Status & Actions */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-8">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Publish Settings</h3>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-50">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-gray-900">Active Status</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Visible in store</span>
                </div>
                {/* Simplified Toggle Placeholder */}
                <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 size-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" loading={isLoading} className="h-16 rounded-[24px] font-black text-lg gap-3 shadow-xl shadow-primary/20 w-full">
                  <Save className="size-6" /> {isEditing ? "Update Product" : "Save & Publish"}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="h-12 rounded-xl font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 w-full"
                  onClick={() => window.history.back()}
                >
                  <X className="size-4 mr-2" /> Cancel Changes
                </Button>
              </div>
            </div>
          </section>

          {/* SEO Preview Card */}
          <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-6 opacity-60">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Globe className="size-4" /> SEO Preview (Auto)
            </h3>
            <div className="flex flex-col gap-2">
              <span className="text-primary text-sm font-black underline line-clamp-1">https://varito.com/product/luxury-emerald-gold...</span>
              <span className="text-blue-700 text-lg font-black line-clamp-2">Luxury Emerald Gold Faucet - Varito Solutions</span>
              <p className="text-gray-500 text-xs line-clamp-2 font-medium">Premium quality sanitary ware at the best price in Bangladesh...</p>
            </div>
          </section>

          {isEditing && (
            <section className="bg-red-50 p-8 rounded-[40px] border border-red-100 flex flex-col gap-4 mt-auto">
              <h3 className="text-sm font-black text-red-900 uppercase tracking-widest flex items-center gap-2">
                <Trash2 className="size-4" /> Danger Zone
              </h3>
              <p className="text-xs font-medium text-red-700 leading-relaxed">
                Deleting this product will hide it from the store permanently. This action cannot be easily undone.
              </p>
              <Button variant="outline" className="border-red-200 bg-white text-red-600 hover:bg-red-100 rounded-xl font-black text-xs h-12 uppercase tracking-widest">
                Delete Product
              </Button>
            </section>
          )}

        </div>

      </div>

    </form>
  )
}
