/**
 * @file header.tsx
 * @description Root layout header component.
 *              Sticky navigation with logo, search bar, and cart access.
 *              Adapts layout for mobile and desktop viewports.
 *              Includes desktop navigation menu for easy access.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Menu, 
  ShoppingCart, 
  User, 
  Phone, 
  Package, 
  Bell, 
  Home, 
  Grid, 
  Zap, 
  Star, 
  ShoppingBag
} from "lucide-react"
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

const NAV_MENU = [
  { label: "Home", href: "/", icon: Home },
  { label: "Products", href: "/products", icon: ShoppingBag },
  { label: "Categories", href: "/categories", icon: Grid },
  { label: "Flash Deals", href: "/deals", icon: Zap },
  { label: "New Arrivals", href: "/new", icon: Star },
]

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const pathname = usePathname()

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
      isScrolled ? "shadow-lg shadow-gray-200/20" : "border-b border-gray-200/50"
    )}>
      {/* Top Bar (Desktop Only) */}
      {!isScrolled && (
        <div className="hidden lg:block border-b border-gray-50 py-2 bg-gray-50/50">
          <div className="container mx-auto px-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <Phone className="size-3 text-primary" />
                Hotline: <a href="tel:+8801814214220" className="text-gray-900">+880 1814-214220</a>
              </span>
              <span>আপনার বিশ্বস্ত অনলাইন দোকান</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-3 md:py-4">
        {/* Main Row: Logo, Search, Actions */}
        <div className="flex items-center justify-between gap-4 lg:gap-10">
          
          {/* Mobile Menu Trigger */}
          <div className="lg:hidden">
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
                    {NAV_MENU.map((item) => (
                      <SheetClose 
                        key={item.label}
                        render={
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-bold",
                              pathname === item.href ? "bg-primary text-white shadow-lg" : "text-gray-700 hover:bg-gray-50"
                            )}
                          >
                            <item.icon className={cn("size-5", pathname === item.href ? "text-white" : "text-gray-400")} />
                            {item.label}
                          </Link>
                        }
                      />
                    ))}
                    <div className="h-px bg-gray-100 my-4" />
                    <SheetClose render={
                      <Link href="/account" className="flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-gray-700">
                        <User className="size-5 text-gray-400" /> My Profile
                      </Link>
                    } />
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Package className="size-8 text-primary" />
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight leading-none text-gray-900">Varito</span>
              <span className="text-[9px] font-black text-gray-400 tracking-[0.25em] uppercase">Solutions</span>
            </div>
          </Link>

          {/* Desktop Nav (Inline with Search for space efficiency) */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_MENU.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all",
                  pathname === item.href 
                    ? "text-primary bg-primary/5" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md ml-auto">
            <SearchBar />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <Button 
              variant="ghost" 
              size="icon" 
              className="size-10 relative hidden sm:flex" 
              aria-label="Notifications"
              onClick={() => toast.info("You have no new notifications.")}
            >
              <Bell className="size-5" />
              <span className="absolute top-2 right-2 size-2 bg-danger-500 rounded-full" />
            </Button>

            <Link href="/account" className="hidden lg:block">
              <Button variant="ghost" className="gap-3 text-gray-700 h-11 px-4 rounded-xl">
                <User className="size-5 text-gray-400" />
                <div className="flex flex-col items-start text-[10px] font-black leading-none uppercase tracking-wider">
                  <span className="text-gray-400 font-bold mb-0.5 opacity-60">Sign in</span>
                  <span>Account</span>
                </div>
              </Button>
            </Link>
            
            <Link href="/cart">
              <Button variant="primary" className="gap-3 h-11 px-5 rounded-xl shadow-lg shadow-primary/20">
                <div className="relative">
                  <ShoppingCart className="size-5" />
                  <span className="absolute -top-3 -right-3 flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white ring-2 ring-primary">
                    3
                  </span>
                </div>
                <div className="hidden xl:flex flex-col items-start leading-tight">
                  <span className="text-[10px] opacity-80 font-bold uppercase tracking-widest">Cart</span>
                  <span className="text-sm font-black">৳12,450</span>
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Search (below header) */}
        <div className="mt-4 md:hidden">
          <SearchBar placeholder="Search sanitary, packaging..." />
        </div>
      </div>
    </header>
  )
}
