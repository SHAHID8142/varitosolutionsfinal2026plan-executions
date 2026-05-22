/**
 * @file layout.tsx
 * @path /admin
 * @description Root layout for the Admin Panel.
 *              Includes the Sidebar, Header, and Breadcrumb for authenticated pages.
 *              Excludes layout elements for the login page.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { AdminHeader } from "@/components/layout/admin-header"
import { AdminBreadcrumb } from "@/components/layout/admin-breadcrumb"
import { cn } from "@/lib/utils"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"

  if (isLoginPage) {
    return <div className="min-h-screen bg-gray-50">{children}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Sidebar - Fixed width on desktop */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className={cn(
        "flex flex-col transition-all duration-300 ease-in-out",
        "lg:pl-72" // Sidebar padding only on desktop
      )}>
        <AdminHeader />
        
        <main className="flex-1 p-4 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <AdminBreadcrumb />
            {children}
          </div>
        </main>

        {/* Admin Footer / Copy */}
        <footer className="px-8 lg:px-12 py-6 border-t border-gray-100 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
          <span>© 2026 Varito Solutions Admin</span>
          <span>Version 1.0.0 (Beta)</span>
        </footer>
      </div>
    </div>
  )
}
