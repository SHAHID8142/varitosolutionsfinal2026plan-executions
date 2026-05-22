/**
 * @file header.tsx
 * @description Root layout header component.
 *              Sticky navigation with logo, search bar, and cart access.
 *              Adapts layout for mobile and desktop viewports.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import * as React from "react"
import Link from "next/link"
import { Menu, ShoppingCart, User, Phone, Package, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/layout/search-bar"
import { cn } from "@/lib/utils"

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md transition-all",
      isScrolled ? "shadow-lg shadow-gray-200/20 py-2" : "py-4 border-b border-gray-200/50"
    )}>
      {/* Top Bar (Desktop Only) */}
      <div className="hidden lg:block border-b border-gray-50 pb-2 mb-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-xs font-medium text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="size-3" />
              Hotline: <a href="tel:+8801814214220" className="text-primary">+880 1814-214220</a>
            </span>
            <span>আপনার বিশ্বস্ত অনলাইন দোকান</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Mobile Header */}
        <div className="flex items-center justify-between lg:hidden">
          <Button variant="ghost" size="icon" className="size-10" aria-label="Open menu">
            <Menu className="size-6" />
          </Button>

          <Link href="/" className="flex items-center gap-1.5">
            <Package className="size-7 text-primary" />
            <span className="text-xl font-bold tracking-tight text-gray-900">Varito</span>
          </Link>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-10 relative" aria-label="Notifications">
              <Bell className="size-5" />
              <span className="absolute top-2 right-2 size-2 bg-danger-500 rounded-full" />
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="size-10 relative" aria-label="View cart">
                <ShoppingCart className="size-6" />
                <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white ring-2 ring-white">
                  3
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Package className="size-8 text-primary" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight leading-none text-gray-900">Varito</span>
              <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Solutions</span>
            </div>
          </Link>

          <div className="flex-1 max-w-2xl">
            <SearchBar />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/account">
              <Button variant="ghost" className="gap-2 text-gray-700">
                <User className="size-5" />
                <div className="flex flex-col items-start text-xs font-bold leading-none">
                  <span className="text-gray-400 font-normal">Hello, Sign in</span>
                  <span>My Account</span>
                </div>
              </Button>
            </Link>
            
            <Link href="/cart">
              <Button variant="primary" className="gap-3 h-11 px-6 shadow-lg shadow-primary/20">
                <div className="relative">
                  <ShoppingCart className="size-5" />
                  <span className="absolute -top-3 -right-3 flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white ring-2 ring-primary">
                    3
                  </span>
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[10px] opacity-80 font-normal uppercase">Your Cart</span>
                  <span className="text-sm">৳12,450</span>
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Search (below header on scroll) */}
        {!isScrolled && (
          <div className="mt-4 lg:hidden">
            <SearchBar placeholder="Search sanitary, packaging..." />
          </div>
        )}
      </div>
    </header>
  )
}
