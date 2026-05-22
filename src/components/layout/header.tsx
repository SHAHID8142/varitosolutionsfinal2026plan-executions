/**
 * @file header.tsx
 * @description Root layout header component.
 *              Sticky navigation with logo, search bar, and cart access.
 *              Adapts layout for mobile and desktop viewports.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, ShoppingCart, User, Phone, Package, Bell, Home, Grid, Zap, Star, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/layout/search-bar"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"

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
          <Sheet>
            <SheetTrigger render={
              <Button variant="ghost" size="icon" className="size-10" aria-label="Open menu">
                <Menu className="size-6" />
              </Button>
            } />
            <SheetContent side="left" className="w-[300px] p-0 flex flex-col">
              <SheetHeader className="p-6 border-b border-gray-100 flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="size-6 text-primary" />
                  <SheetTitle className="text-xl font-bold">Varito Menu</SheetTitle>
                </div>
              </SheetHeader>
              
              <div className="flex-1 overflow-y-auto py-6">
                <nav className="flex flex-col gap-2 px-4">
                  {[
                    { label: "Home", icon: Home, href: "/" },
                    { label: "Shop All", icon: ShoppingBag, href: "/products" },
                    { label: "Categories", icon: Grid, href: "/categories" },
                    { label: "Flash Deals", icon: Zap, href: "/deals" },
                    { label: "New Arrivals", icon: Star, href: "/new" },
                    { label: "My Profile", icon: User, href: "/account" },
                  ].map((item) => (
                    <SheetClose 
                      key={item.label}
                      render={
                        <Link
                          href={item.href}
                          className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-gray-50 transition-colors font-bold text-gray-700"
                        >
                          <item.icon className="size-5 text-gray-400" />
                          {item.label}
                        </Link>
                      }
                    />
                  ))}
                </nav>
              </div>

              <div className="p-6 mt-auto border-t border-gray-100 bg-gray-50/50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Customer Support</p>
                <div className="flex flex-col gap-4">
                  <a href="tel:+8801814214220" className="flex items-center gap-3 text-sm font-bold text-gray-900">
                    <Phone className="size-4 text-primary" /> +880 1814-214220
                  </a>
                  <Link href="/help" className="text-xs font-bold text-primary hover:underline uppercase tracking-wider">
                    Visit Help Center
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-1.5">
            <Package className="size-7 text-primary" />
            <span className="text-xl font-bold tracking-tight text-gray-900">Varito</span>
          </Link>

          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="size-10 relative" 
              aria-label="Notifications"
              onClick={() => toast.info("You have no new notifications.")}
            >
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
