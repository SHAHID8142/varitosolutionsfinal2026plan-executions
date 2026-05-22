/**
 * @file admin-header.tsx
 * @description Top header bar for the Admin Panel.
 *              Contains global search, notifications, and admin profile summary.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { Search, Bell, User, ExternalLink, Sun } from "lucide-react"
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
import { toast } from "sonner"

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

/** Top header bar with global search, notifications, and admin profile dropdown. */
export function AdminHeader() {
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      toast.info(`Searching admin for: ${searchQuery}`)
    }
  }

  return (
    <header className="sticky top-0 z-30 h-20 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8">
      
      {/* Global Admin Search */}
      <form onSubmit={handleSearch} className="hidden md:flex items-center w-full max-w-md relative">
        <Search className="absolute left-4 size-4 text-gray-400" />
        <Input 
          type="text" 
          placeholder="Search orders, products, or customers..." 
          className="h-11 pl-11 pr-4 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-50 transition-all text-sm font-medium"
          aria-label="Search admin panel"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <kbd className="absolute right-4 hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 bg-white px-1.5 font-mono text-[10px] font-medium text-gray-400">
          <span className="text-xs">⌘</span>K
        </kbd>
      </form>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        
        {/* View Store Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="hidden sm:flex gap-2 text-xs font-black uppercase tracking-wider text-gray-500 hover:text-emerald-600 rounded-lg"
          onClick={() => window.open('/', '_blank')}
        >
          View Store <ExternalLink className="size-3" />
        </Button>

        <div className="h-8 w-px bg-gray-100 mx-2 hidden sm:block" />

        {/* Theme Toggle Placeholder */}
        <Button variant="ghost" size="icon" aria-label="Toggle theme" className="text-gray-400 hover:text-gray-900 rounded-xl">
          <Sun className="size-5" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" aria-label="View notifications" className="relative text-gray-400 hover:text-gray-900 rounded-xl">
          <Bell className="size-5" />
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full ring-2 ring-white" />
        </Button>

        {/* Admin Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="pl-2 pr-1 h-12 gap-3 hover:bg-gray-50 rounded-xl flex items-center cursor-pointer outline-none group">
              <div className="flex flex-col items-end text-right hidden lg:flex">
                <span className="text-sm font-black text-gray-900 leading-none">Shahidul Islam</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Super Admin</span>
              </div>
              <div className="size-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-sm border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <User className="size-5" />
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
