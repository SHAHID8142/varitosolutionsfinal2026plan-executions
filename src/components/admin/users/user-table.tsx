/**
 * @file user-table.tsx
 * @description Advanced table for managing administrative users.
 *              Includes role management and access control.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { 
  Search, 
  MoreHorizontal, 
  Trash2, 
  Edit3, 
  UserCircle, 
  Key,
  ShieldAlert
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
// TYPES & MOCK DATA
// ─────────────────────────────────────────────

interface AdminUser {
  id: string
  name: string
  email: string
  role: "super_admin" | "manager" | "editor"
  lastLogin: string
  status: "active" | "inactive"
}

const MOCK_USERS: AdminUser[] = [
  { id: "1", name: "Shahidul Islam", email: "shahid@varito.com", role: "super_admin", lastLogin: "Active Now", status: "active" },
  { id: "2", name: "Karim Admin", email: "karim@varito.com", role: "manager", lastLogin: "2 hours ago", status: "active" },
  { id: "3", name: "Sultana Editor", email: "sultana@varito.com", role: "editor", lastLogin: "Yesterday", status: "active" },
  { id: "4", name: "Former Staff", email: "staff@varito.com", role: "editor", lastLogin: "3 months ago", status: "inactive" },
]

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export function UserTable() {
  const [search, setSearch] = React.useState("")

  const filteredUsers = MOCK_USERS.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 max-w-md relative">
          <Search className="absolute left-4 size-4 text-gray-400" />
          <Input 
            placeholder="Search by name or email..." 
            className="pl-11 h-12 rounded-xl border-gray-100 bg-white shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Administrator</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Access</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <UserCircle className="size-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-900">{user.name}</span>
                        <span className="text-[10px] font-bold text-gray-400">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Badge variant="outline" className={cn(
                      "uppercase text-[8px] font-black tracking-widest px-2 h-5",
                      user.role === "super_admin" && "border-emerald-200 text-emerald-600 bg-emerald-50",
                      user.role === "manager" && "border-blue-200 text-blue-600 bg-blue-50",
                      user.role === "editor" && "border-purple-200 text-purple-600 bg-purple-50"
                    )}>
                      {user.role.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-gray-500">{user.lastLogin}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "size-2 rounded-full",
                        user.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-gray-300"
                      )} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-gray-100">
                        <Edit3 className="size-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-9 w-9 rounded-xl hover:bg-gray-100 flex items-center justify-center outline-none transition-colors">
                            <MoreHorizontal className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
                          <DropdownMenuItem className="rounded-xl font-bold h-10 cursor-pointer">
                            <Key className="mr-2 size-4 text-amber-500" /> Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-xl font-bold h-10 cursor-pointer">
                            <ShieldAlert className="mr-2 size-4 text-blue-500" /> Change Permissions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="rounded-xl font-bold h-10 cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700">
                            <Trash2 className="mr-2 size-4" /> Remove Access
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
