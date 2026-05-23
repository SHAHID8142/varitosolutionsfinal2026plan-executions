/**
 * @file bottom-nav.tsx
 * @description Mobile-only bottom navigation bar.
 *              Provides quick access to main shop sections.
 *              Respects mobile safe areas (home indicator).
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Grid, Search, ShoppingCart, User } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Categories", icon: Grid, href: "/categories" },
  { label: "Search", icon: Search, href: "/search" },
  { label: "Cart", icon: ShoppingCart, href: "/cart", badge: 3 },
  { label: "Profile", icon: User, href: "/account" },
]

/**
 * Mobile-only bottom navigation bar.
 * Hidden on lg+ screens. Respects iOS safe area via pb-[env(safe-area-inset-bottom)].
 * Each nav item is 64px wide with a 16px icon — touches are handled by the full Link area.
 */
export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-gray-200/50 pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-colors",
                isActive ? "text-primary" : "text-gray-400"
              )}
            >
              <div className="relative">
                <Icon className={cn("size-6", isActive && "fill-primary/10")} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex size-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wide">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
