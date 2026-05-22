/**
 * @file admin-header.tsx
 * @description Top header bar for the Admin Panel.
 *              Contains global search, notifications, and admin profile summary.
 *              Responsive: Includes hamburger menu for mobile navigation.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { Search, Bell, User, ExternalLink, Menu } from "lucide-react"
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { AdminSidebarContent } from "./admin-sidebar"
import { toast } from "sonner"

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

/** Top header bar with global search, notifications, and admin profile dropdown. */
export function AdminHeader() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      toast.info(`Searching admin for: ${searchQuery}`)
    }
  }

  return (
    <header className="sticky top-0 z-30 h-20 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 lg:px-8">
      
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger className="lg:hidden rounded-xl text-gray-500 h-10 w-10 flex items-center justify-center hover:bg-gray-50 transition-colors outline-none">
              <Menu className="size-6" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 border-r-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Admin Navigation</SheetTitle>
            </SheetHeader>
            <AdminSidebarContent className="h-full" />
          </SheetContent>
        </Sheet>

        {/* Global Admin Search (Hidden on very small mobile) */}
        <form onSubmit={handleSearch} className="hidden sm:flex items-center w-full max-w-[200px] md:max-w-md relative">
          <Search className="absolute left-4 size-4 text-gray-400" />
          <Input 
            type="text" 
            placeholder="Search..." 
            className="h-11 pl-11 pr-4 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-50 transition-all text-sm font-medium"
            aria-label="Search admin panel"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <kbd className="absolute right-4 hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 bg-white px-1.5 font-mono text-[10px] font-medium text-gray-400">
            <span className="text-xs">⌘</span>K
          </kbd>
        </form>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 lg:gap-3">
        
        {/* View Store Button (Desktop Only) */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="hidden md:flex gap-2 text-xs font-black uppercase tracking-wider text-gray-500 hover:text-emerald-600 rounded-lg"
          onClick={() => window.open('/', '_blank')}
        >
          View Store <ExternalLink className="size-3" />
        </Button>

        <div className="h-8 w-px bg-gray-100 mx-1 lg:mx-2 hidden md:block" />

        {/* Notifications */}
        <Button variant="ghost" size="icon" aria-label="View notifications" className="relative text-gray-400 hover:text-gray-900 rounded-xl">
          <Bell className="size-5" />
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full ring-2 ring-white" />
        </Button>

        {/* Admin Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="pl-1 pr-1 lg:pl-2 h-12 gap-3 hover:bg-gray-50 rounded-xl flex items-center cursor-pointer outline-none group">
              <div className="flex flex-col items-end text-right hidden lg:flex">
                <span className="text-sm font-black text-gray-900 leading-none">Shahidul Islam</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Super Admin</span>
              </div>
              <div className="size-9 lg:size-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-sm border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                <User className="size-5 lg:size-6" />
              </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-xl border-gray-100">
            <DropdownMenuLabel className="px-3 py-2 text-xs font-black text-gray-400 uppercase tracking-widest">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-xl h-10 font-bold text-sm cursor-pointer">
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl h-10 font-bold text-sm cursor-pointer">
              Security
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="rounded-xl h-10 font-bold text-sm text-red-500 cursor-pointer focus:bg-red-50 focus:text-red-600"
              onClick={() => window.location.href = "/"}
            >
              Logout System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  )
}
