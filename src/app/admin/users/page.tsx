/**
 * @file page.tsx
 * @path /admin/users
 * @description Admin Users management page.
 *              Allows creation and role management of administrative accounts.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { ShieldAlert, Plus, ShieldCheck } from "lucide-react"
import { UserTable } from "@/components/admin/users/user-table"
import { Button } from "@/components/ui/button"

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-10">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldAlert className="size-6" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">Admin Users</h1>
          </div>
          <p className="text-gray-500 font-medium">Manage internal access, assign roles, and audit administrator accounts.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="rounded-xl font-black shadow-lg shadow-emerald-500/20">
            <Plus className="mr-2 size-4" /> Create Admin
          </Button>
        </div>
      </div>

      {/* Info Alert */}
      <div className="p-6 rounded-[32px] bg-blue-50 border border-blue-100 flex items-center gap-4">
        <div className="size-12 rounded-2xl bg-white border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
          <ShieldCheck className="size-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black text-blue-900 uppercase tracking-widest">Access Control</span>
          <span className="text-xs font-bold text-blue-700">Only Super Admins can manage other administrative accounts. Managers and Editors have limited permissions.</span>
        </div>
      </div>

      {/* Main Table Section */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <UserTable />
      </section>

    </div>
  )
}
