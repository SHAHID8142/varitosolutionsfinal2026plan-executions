/**
 * @file admin-sidebar.tsx
 * @description Sidebar navigation for the Admin Panel.
 *              Contains links to all 12 administration sections.
 *              Responsive: Hidden on mobile, fixed on desktop.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Folders,
  Users,
  BarChart3,
  Image as ImageIcon,
  Zap,
  Ticket,
  Warehouse,
  Settings,
  ShieldAlert,
  History,
  ChevronLeft,
  Package2,
  LogOut,
  MessageCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { SheetClose } from "@/components/ui/sheet"

// ─────────────────────────────────────────────
// TYPES & CONSTANTS
// ─────────────────────────────────────────────

interface SidebarItem {
  label: string
  href: string
  icon: React.ElementType
  superAdminOnly?: boolean
  /** If true, this item shows a live unread badge from the API */
  showUnreadBadge?: boolean
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Folders },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Messages", href: "/admin/messages", icon: MessageCircle, showUnreadBadge: true },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Banners & Content", href: "/admin/content", icon: ImageIcon },
  { label: "Flash Deals", href: "/admin/flash-deals", icon: Zap },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket, superAdminOnly: true },
  { label: "Inventory", href: "/admin/inventory", icon: Warehouse },
  { label: "Settings", href: "/admin/settings", icon: Settings, superAdminOnly: true },
  { label: "Admin Users", href: "/admin/users", icon: ShieldAlert, superAdminOnly: true },
  { label: "Audit Log", href: "/admin/audit-log", icon: History, superAdminOnly: true },
]

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

/**
 * Sidebar content component. 
 * Separated from layout to allow reuse in Mobile Drawer.
 */
export function AdminSidebarContent({
  isCollapsed = false,
  onCollapse,
  onClose,
  className,
}: {
  isCollapsed?: boolean
  onCollapse?: () => void
  onClose?: () => void
  className?: string
}) {
  const pathname = usePathname()
  const isSuperAdmin = true // TODO: Real auth
  const [messagesUnread, setMessagesUnread] = React.useState(0)

  // Poll admin unread message count every 60 seconds
  React.useEffect(() => {
    async function fetchUnread() {
      try {
        const res = await fetch("/api/admin/conversations/unread-count")
        if (res.ok) {
          const json = await res.json()
          setMessagesUnread(json.data?.count ?? 0)
        }
      } catch {
        // Non-fatal — sidebar badge is best-effort
      }
    }

    fetchUnread()
    const interval = setInterval(fetchUnread, 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={cn("h-full flex flex-col bg-white", className)}>
      {/* Header / Logo */}
      <div className="h-20 flex items-center px-6 border-b border-gray-50 shrink-0">
        <Link href="/admin" onClick={onClose} className="flex items-center gap-3 overflow-hidden">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
            <Package2 className="size-6" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="text-lg font-black tracking-tight text-gray-900 leading-none">VARITO</span>
              <span className="text-[10px] font-black text-primary tracking-[0.2em] uppercase">Admin Panel</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 no-scrollbar">
        <div className="px-3 flex flex-col gap-1">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
            const Icon = item.icon

            if (item.superAdminOnly && !isSuperAdmin) return null

            const content = (
              <div
                className={cn(
                  "flex items-center gap-3 px-3 h-12 rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary/10 text-primary font-black shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-bold"
                )}
              >
                <span className="relative shrink-0">
                  <Icon className={cn(
                    "size-5",
                    isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
                  )} />
                  {item.showUnreadBadge && messagesUnread > 0 && (
                    <span className="absolute -top-1 -right-1 size-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center leading-none">
                      {messagesUnread > 9 ? "9+" : messagesUnread}
                    </span>
                  )}
                </span>
                
                {!isCollapsed && (
                  <span className="text-sm truncate animate-in fade-in slide-in-from-left-1 duration-300">
                    {item.label}
                  </span>
                )}

                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </div>
            )

            if (onClose) {
              return (
                <SheetClose key={item.href} nativeButton={false} render={<Link href={item.href} onClick={onClose} />}>
                  {content}
                </SheetClose>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className="block"
              >
                {content}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer / User Profile Summary */}
      <div className="p-4 border-t border-gray-50 flex flex-col gap-2">
        {!isCollapsed && (
          <div className="mb-2 px-2 flex items-center gap-3">
            <div className="size-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <Users className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-gray-900 truncate">Super Admin</span>
              <span className="text-[10px] text-gray-400 font-bold truncate">Admin Session</span>
            </div>
          </div>
        )}

        {onCollapse && (
          <button
            onClick={onCollapse}
            className="flex items-center gap-3 px-3 h-12 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-bold transition-all w-full"
          >
            <ChevronLeft className={cn(
              "size-5 transition-transform duration-300",
              isCollapsed && "rotate-180"
            )} />
            {!isCollapsed && <span className="text-sm">Collapse Sidebar</span>}
          </button>
        )}

        <Button
          variant="ghost"
          className="justify-start gap-3 h-12 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 px-3 font-bold"
          onClick={() => window.location.href = "/"}
        >
          <LogOut className="size-5" />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </Button>
      </div>
    </div>
  )
}

/**
 * Desktop Sidebar wrapper.
 */
export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-gray-100 transition-all duration-300 ease-in-out hidden lg:flex flex-col shadow-sm",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      <AdminSidebarContent 
        isCollapsed={isCollapsed} 
        onCollapse={() => setIsCollapsed(!isCollapsed)} 
      />
    </aside>
  )
}

