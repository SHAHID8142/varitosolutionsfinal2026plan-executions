/**
 * @file admin-breadcrumb.tsx
 * @description Breadcrumb navigation for the Admin Panel pages.
 *              Shows current location within the admin hierarchy.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

/** Renders a dynamic breadcrumb trail derived from the current pathname. */
export function AdminBreadcrumb() {
  const pathname = usePathname()
  
  // Split pathname into segments and filter out empty strings
  const segments = pathname.split("/").filter(Boolean)

  return (
    <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 px-1 overflow-x-auto no-scrollbar py-1">
      <Link 
        href="/admin" 
        className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors shrink-0"
      >
        <Home className="size-3.5" />
        <span>Admin</span>
      </Link>

      {segments.map((segment, index) => {
        // Skip "admin" segment as we already added it above
        if (segment === "admin") return null

        const href = `/${segments.slice(0, index + 1).join("/")}`
        const isLast = index === segments.length - 1
        
        // Format segment: "products" -> "Products", "new-order" -> "New Order"
        const label = segment
          .split("-")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")

        return (
          <React.Fragment key={href}>
            <ChevronRight className="size-3 text-gray-300 shrink-0" />
            {isLast ? (
              <span className="text-gray-900 shrink-0">{label}</span>
            ) : (
              <Link 
                href={href} 
                className="hover:text-emerald-600 transition-colors shrink-0"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
