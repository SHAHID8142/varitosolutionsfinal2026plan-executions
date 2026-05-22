/**
 * @file category-tree.tsx
 * @description Hierarchical tree view for managing categories.
 *              Supports nested categories, quick toggle visibility,
 *              and reordering logic.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { 
  GripVertical, 
  ChevronRight, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Edit3, 
  Plus, 
  Trash2,
  Folder,
  Package
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

// ─────────────────────────────────────────────
// TYPES & MOCK DATA
// ─────────────────────────────────────────────

interface Category {
  id: string
  name: string
  slug: string
  productCount: number
  isActive: boolean
  children?: Category[]
}

const MOCK_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Sanitary Ware",
    slug: "sanitary-ware",
    productCount: 45,
    isActive: true,
    children: [
      { id: "1-1", name: "Faucets & Taps", slug: "faucets-taps", productCount: 12, isActive: true },
      { id: "1-2", name: "Shower Systems", slug: "showers", productCount: 8, isActive: true },
      { id: "1-3", name: "Basins & Sinks", slug: "basins", productCount: 15, isActive: true },
      { id: "1-4", name: "Accessories", slug: "accessories", productCount: 10, isActive: false },
    ]
  },
  {
    id: "2",
    name: "Packaging Materials",
    slug: "packaging",
    productCount: 120,
    isActive: true,
    children: [
      { id: "2-1", name: "Corrugated Cartons", slug: "cartons", productCount: 60, isActive: true },
      { id: "2-2", name: "Adhesive Tapes", slug: "tapes", productCount: 25, isActive: true },
      { id: "2-3", name: "Protective Wrap", slug: "wraps", productCount: 35, isActive: true },
    ]
  },
  {
    id: "3",
    name: "New Arrivals",
    slug: "new-arrivals",
    productCount: 12,
    isActive: true
  }
]

// ─────────────────────────────────────────────
// SUB-COMPONENT: Tree Item
// ─────────────────────────────────────────────

function CategoryItem({ category, level = 0 }: { category: Category; level?: number }) {
  const [isExpanded, setIsExpanded] = React.useState(level === 0)
  const hasChildren = category.children && category.children.length > 0

  const toggleActive = (e: React.MouseEvent) => {
    e.stopPropagation()
    toast.success(`${category.name} is now ${!category.isActive ? "Active" : "Inactive"}`)
  }

  return (
    <div className="flex flex-col">
      <div 
        className={cn(
          "group flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-sm transition-all duration-200",
          !category.isActive && "opacity-60"
        )}
        style={{ marginLeft: `${level * 32}px` }}
      >
        <div className="flex items-center gap-3 shrink-0">
          <GripVertical className="size-4 text-gray-300 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100" />
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "size-6 rounded-lg flex items-center justify-center transition-colors",
              hasChildren ? "hover:bg-gray-100 text-gray-500" : "text-gray-200 pointer-events-none"
            )}
          >
            {isExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
          </button>
        </div>

        <div className="size-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-emerald-600 shrink-0">
          <Folder className="size-5" />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-gray-900 truncate">{category.name}</span>
            <Badge variant="outline" className="text-[9px] font-bold h-4 px-1.5 border-gray-100 text-gray-400">
              /{category.slug}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-0.5">
            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
              <Package className="size-3" /> {category.productCount} Products
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-emerald-50 hover:text-emerald-600" onClick={toggleActive}>
            {category.isActive ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-gray-100">
            <Plus className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-gray-100">
            <Edit3 className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-500">
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div className="flex flex-col gap-1 mt-1 border-l-2 border-gray-50 ml-7 pl-1">
          {category.children!.map((child) => (
            <CategoryItem key={child.id} category={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export function CategoryTree() {
  return (
    <div className="flex flex-col gap-4">
      {MOCK_CATEGORIES.map((cat) => (
        <CategoryItem key={cat.id} category={cat} />
      ))}
    </div>
  )
}
