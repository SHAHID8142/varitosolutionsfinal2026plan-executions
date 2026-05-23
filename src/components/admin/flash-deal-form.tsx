/**
 * @file flash-deal-form.tsx
 * @description Form for creating or editing a Flash Deal.
 *              Includes product selection, pricing, and scheduling.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Zap, Calendar, Package, DollarSign, Clock, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FlashDealCountdown } from "./flash-deal-countdown"
import { toast } from "sonner"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface FlashDealFormProps {
  initialData?: {
    productId: string;
    flashPrice: string;
    startsAt: string;
    endsAt: string;
    maxQty: string;
    isActive: boolean;
  }
}

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

const MOCK_PRODUCTS = [
  { id: 1, name: "Luxury Emerald Gold Faucet", price: 4500, stock: 12 },
  { id: 2, name: "Premium Kitchen Mixer Tap", price: 3200, stock: 45 },
  { id: 3, name: "Heavy Duty Packaging Tape (6 Pack)", price: 850, stock: 150 },
]

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export function FlashDealForm({ initialData }: FlashDealFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    productId: initialData?.productId || "",
    flashPrice: initialData?.flashPrice || "",
    startsAt: initialData?.startsAt || "",
    endsAt: initialData?.endsAt || "",
    maxQty: initialData?.maxQty || "",
    isActive: initialData?.isActive ?? true,
  })

  const selectedProduct = MOCK_PRODUCTS.find(p => p.id.toString() === formData.productId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validation
    if (!formData.productId || !formData.flashPrice || !formData.startsAt || !formData.endsAt) {
      toast.error("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    if (selectedProduct && Number(formData.flashPrice) >= selectedProduct.price) {
      toast.error(`Flash price must be lower than regular price (৳${selectedProduct.price})`)
      setIsLoading(false)
      return
    }

    try {
      // TODO: Actual API call
      console.log("Submitting flash deal:", formData)
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate network
      
      toast.success(initialData ? "Flash deal updated successfully" : "Flash deal created successfully")
      router.push("/admin/flash-deals")
    } catch (error) {
      toast.error("Failed to save flash deal")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Main Configuration */}
      <div className="lg:col-span-2 space-y-8">
        <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-8">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Zap className="size-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-tight">Deal Information</CardTitle>
                <CardDescription>Select a product and set the promotional price.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {/* Product Selection */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Package className="size-4" /> Select Product <span className="text-red-500">*</span>
              </label>
              <Select 
                value={formData.productId} 
                onValueChange={(v) => setFormData({ ...formData, productId: v || "" })}
              >
                <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50/30 font-bold focus:ring-emerald-500/20">
                  <SelectValue placeholder="Choose a product for the flash deal" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100">
                  {MOCK_PRODUCTS.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()} className="font-medium rounded-xl h-12">
                      {product.name} (৳{product.price})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="size-4" /> Flash Price (BDT) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
                  <Input
                    type="number"
                    value={formData.flashPrice}
                    onChange={(e) => setFormData({ ...formData, flashPrice: e.target.value })}
                    placeholder="0.00"
                    className="h-14 pl-10 rounded-2xl border-gray-100 bg-gray-50/30 font-black focus:ring-emerald-500/20"
                    required
                  />
                </div>
                {selectedProduct && (
                  <p className="text-xs text-gray-400 font-medium">
                    Regular Price: ৳{selectedProduct.price} (Margin will be reduced)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <Package className="size-4" /> Quantity Cap (Optional)
                </label>
                <Input
                  type="number"
                  value={formData.maxQty}
                  onChange={(e) => setFormData({ ...formData, maxQty: e.target.value })}
                  placeholder="Unlimited"
                  className="h-14 rounded-2xl border-gray-100 bg-gray-50/30 font-bold focus:ring-emerald-500/20"
                />
                <p className="text-xs text-gray-400 font-medium">Max units available for this deal.</p>
              </div>
            </div>

            {/* Schedule Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="size-4" /> Start Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type="datetime-local"
                    value={formData.startsAt}
                    onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/30 font-bold focus:ring-emerald-500/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="size-4" /> End Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type="datetime-local"
                    value={formData.endsAt}
                    onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/30 font-bold focus:ring-emerald-500/20"
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar / Preview */}
      <div className="space-y-8">
        <Card className="rounded-3xl border-emerald-100 shadow-xl shadow-emerald-500/5 bg-emerald-50/30 overflow-hidden">
          <CardHeader className="bg-emerald-50 border-b border-emerald-100">
            <CardTitle className="text-lg font-black uppercase tracking-tight text-emerald-800 flex items-center gap-2">
              <Zap className="size-5" /> Live Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {formData.productId ? (
                <div className="space-y-4">
                  <div className="aspect-square rounded-2xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-200">
                    <Package size={64} strokeWidth={1} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-black text-gray-900 leading-tight">{selectedProduct?.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-primary">৳{formData.flashPrice || "0"}</span>
                      <span className="text-sm text-gray-400 line-through">৳{selectedProduct?.price}</span>
                    </div>
                  </div>

                  {formData.endsAt ? (
                    <div className="pt-4 border-t border-emerald-100">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-3 text-center">Deal Ends In</p>
                      <FlashDealCountdown targetDate={formData.endsAt} className="justify-center" />
                    </div>
                  ) : (
                    <div className="h-20 flex items-center justify-center border-2 border-dashed border-emerald-200 rounded-2xl text-emerald-300 font-bold text-xs uppercase tracking-widest italic">
                      Set end time to preview
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-emerald-300 gap-4 text-center">
                  <Package size={48} strokeWidth={1} />
                  <p className="text-sm font-bold uppercase tracking-widest leading-relaxed">
                    Select a product<br />to see preview
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Card */}
        <Card className="rounded-3xl border-gray-100 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-emerald-500/20"
              loading={isLoading}
            >
              <Save className="mr-2 size-5" /> {initialData ? "Update Deal" : "Launch Deal"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-sm bg-white border-gray-100"
              onClick={() => router.push("/admin/flash-deals")}
            >
              <X className="mr-2 size-5" /> Cancel
            </Button>
          </CardContent>
        </Card>
      </div>

    </form>
  )
}
