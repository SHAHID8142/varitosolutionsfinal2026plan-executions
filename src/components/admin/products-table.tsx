/**
 * @file products-table.tsx
 * @description Advanced table for managing products in the Admin Panel.
 *              Includes search, category filtering, quick stock/price edit,
 *              and low stock highlighting.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  Package, 
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// ─────────────────────────────────────────────
// TYPES & MOCK DATA
// ─────────────────────────────────────────────

interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  costPrice: number
  stock: number
  status: "active" | "inactive"
  image: string
}

const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Luxury Emerald Gold Faucet", sku: "VR-SAN-001", category: "Sanitary Ware", price: 3800, costPrice: 2200, stock: 12, status: "active", image: "https://placehold.co/100x100/10b981/white.png?text=Faucet" },
  { id: "2", name: "Premium Kitchen Mixer Tap", sku: "VR-SAN-002", category: "Sanitary Ware", price: 3200, costPrice: 1800, stock: 4, status: "active", image: "https://placehold.co/100x100/10b981/white.png?text=Mixer" },
  { id: "3", name: "Heavy Duty Packaging Tape (6 Pack)", sku: "VR-PKG-005", category: "Packaging", price: 720, costPrice: 450, stock: 150, status: "active", image: "https://placehold.co/100x100/10b981/white.png?text=Tape" },
  { id: "4", name: "Bubble Wrap (10 Meter Roll)", sku: "VR-PKG-012", category: "Packaging", price: 330, costPrice: 180, stock: 8, status: "active", image: "https://placehold.co/100x100/10b981/white.png?text=Bubble" },
  { id: "5", name: "Anti-Rust Shower Set", sku: "VR-SAN-015", category: "Sanitary Ware", price: 5800, costPrice: 3500, stock: 0, status: "inactive", image: "https://placehold.co/100x100/10b981/white.png?text=Shower" },
  { id: "6", name: "Large Carton Box (20x20x20)", sku: "VR-PKG-022", category: "Packaging", price: 85, costPrice: 45, stock: 500, status: "active", image: "https://placehold.co/100x100/10b981/white.png?text=Box" },
]

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export function ProductsTable() {
  const [search, setSearch] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("all")
  const [editingStockId, setEditingStockId] = React.useState<string | null>(null)
  const [editingPriceId, setEditingPriceId] = React.useState<string | null>(null)
  
  const filteredProducts = MOCK_PRODUCTS.filter(prod => {
    const matchesSearch = 
      prod.name.toLowerCase().includes(search.toLowerCase()) || 
      prod.sku.toLowerCase().includes(search.toLowerCase())
    
    const matchesCategory = categoryFilter === "all" || prod.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const handleQuickSave = (type: "stock" | "price") => {
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`)
    setEditingStockId(null)
    setEditingPriceId(null)
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Filters & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 max-w-md relative">
          <Search className="absolute left-4 size-4 text-gray-400" />
          <Input 
            placeholder="Search products by name or SKU..." 
            className="pl-11 h-12 rounded-xl border-gray-100 bg-white shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="h-12 px-5 rounded-xl gap-2 font-bold border border-gray-100 bg-white flex items-center hover:bg-gray-50 outline-none transition-colors shadow-sm">
                <Filter className="size-4" />
                Category: {categoryFilter === "all" ? "All" : categoryFilter}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
              <DropdownMenuItem onClick={() => setCategoryFilter("all")} className="rounded-xl font-bold">All Categories</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setCategoryFilter("Sanitary Ware")} className="rounded-xl font-bold">Sanitary Ware</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("Packaging")} className="rounded-xl font-bold">Packaging</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="h-12 px-5 rounded-xl gap-2 font-bold border-gray-100 bg-white shadow-sm">
            Bulk Actions
          </Button>
        </div>
      </div>

      {/* Table Surface */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-4 md:px-6 py-5">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Product <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th className="px-4 md:px-6 py-5">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Price
                  </div>
                </th>
                <th className="px-4 md:px-6 py-5">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Stock
                  </div>
                </th>
                <th className="px-4 md:px-6 py-5">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Status
                  </div>
                </th>
                <th className="px-4 md:px-6 py-5 text-right">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((prod) => {
                const isLowStock = prod.stock > 0 && prod.stock < 10
                const isOutOfStock = prod.stock <= 0

                return (
                  <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 md:px-6 py-4 md:py-5">
                      <div className="flex items-center gap-2 md:gap-4">
                        <div className={cn(
                          "size-10 md:size-14 rounded-xl md:rounded-2xl border border-gray-100 overflow-hidden shrink-0 bg-gray-50 relative",
                          isOutOfStock && "opacity-50 grayscale"
                        )}>
                          <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[8px] md:text-[10px] font-black text-emerald-600 uppercase tracking-widest">{prod.sku}</span>
                          <span className="text-xs md:text-sm font-black text-gray-900 truncate max-w-[120px] md:max-w-none">{prod.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 md:py-5">
                      {editingPriceId === prod.id ? (
                        <div className="flex items-center gap-2">
                          <Input 
                            defaultValue={prod.price} 
                            className="h-8 md:h-9 w-20 md:w-24 rounded-lg font-black text-xs md:text-sm" 
                            type="number"
                            autoFocus
                          />
                          <Button size="icon" className="size-7 md:size-8 rounded-lg" onClick={() => handleQuickSave("price")}>
                            <Check className="size-3 md:size-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-0.5 group/price cursor-pointer" onClick={() => setEditingPriceId(prod.id)}>
                          <div className="flex items-center gap-1 md:gap-2">
                            <span className="text-xs md:text-sm font-black text-gray-900">৳{prod.price.toLocaleString()}</span>
                            <Edit3 className="size-3 text-gray-300 opacity-0 group-hover/price:opacity-100 hidden md:block" />
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-4 md:px-6 py-4 md:py-5">
                      {editingStockId === prod.id ? (
                        <div className="flex items-center gap-2">
                          <Input 
                            defaultValue={prod.stock} 
                            className="h-8 md:h-9 w-16 md:w-20 rounded-lg font-black text-xs md:text-sm" 
                            type="number"
                            autoFocus
                          />
                          <Button size="icon" className="size-7 md:size-8 rounded-lg" onClick={() => handleQuickSave("stock")}>
                            <Check className="size-3 md:size-4" />
                          </Button>
                        </div>
                      ) : (
                        <div 
                          className="flex items-center gap-2 md:gap-3 group/stock cursor-pointer w-fit"
                          onClick={() => setEditingStockId(prod.id)}
                        >
                          <div className={cn(
                            "flex flex-col",
                            isLowStock && "text-amber-600",
                            isOutOfStock && "text-red-600"
                          )}>
                            <span className="text-xs md:text-sm font-black">{prod.stock}</span>
                            <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest opacity-60">Stock</span>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-4 md:px-6 py-4 md:py-5">
                      <Badge 
                        variant={prod.status === "active" ? "verified" : "outline"}
                        className={cn(
                          "uppercase text-[8px] md:text-[9px] font-black tracking-widest px-1 md:px-2",
                          prod.status === "inactive" && "bg-gray-100 text-gray-400 border-gray-200"
                        )}
                      >
                        {prod.status}
                      </Badge>
                    </td>
                    <td className="px-4 md:px-6 py-4 md:py-5 text-right">
                      <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/products/${prod.id}/edit`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9 rounded-xl hover:bg-emerald-50 hover:text-emerald-600">
                            <Edit3 className="size-4" />
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-8 w-8 md:h-9 md:w-9 rounded-xl hover:bg-gray-100 flex items-center justify-center outline-none transition-colors">
                              <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
                            <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="rounded-xl font-bold h-10 cursor-pointer">
                              <Package className="mr-2 size-4 text-blue-500" /> View Stock Log
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl font-bold h-10 cursor-pointer">
                              {prod.status === "active" ? "Deactivate Product" : "Activate Product"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="rounded-xl font-bold h-10 cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700">
                              <Trash2 className="mr-2 size-4" /> Delete Product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-5 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Showing <span className="text-gray-900">{filteredProducts.length}</span> of <span className="text-gray-900">{MOCK_PRODUCTS.length}</span> products
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-gray-100 bg-white" disabled>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-emerald-100 bg-emerald-50 text-emerald-700 font-black">
              1
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-gray-100 bg-white">
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
