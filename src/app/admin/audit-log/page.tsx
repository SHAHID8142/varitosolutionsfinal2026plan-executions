/**
 * @file page.tsx
 * @path /admin/audit-log
 * @description Admin Audit Log page.
 *              Displays a record of all significant administrator actions.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { History, Download, ShieldAlert } from "lucide-react"
import { AuditLogTable } from "@/components/admin/audit-log-table"
import { Button } from "@/components/ui/button"

export default function AdminAuditLogPage() {
  return (
    <div className="flex flex-col gap-10">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
              <History className="size-6" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">Audit Log</h1>
          </div>
          <p className="text-gray-500 font-medium">Transparency and accountability tracking for all administrative operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold border-gray-100 bg-white shadow-sm">
            <Download className="mr-2 size-4" /> Export Security Log
          </Button>
        </div>
      </div>

      {/* Security Banner */}
      <div className="p-6 rounded-[32px] bg-amber-50 border border-amber-100 flex items-center gap-4">
        <div className="size-12 rounded-2xl bg-white border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
          <ShieldAlert className="size-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black text-amber-900 uppercase tracking-widest">Compliance Mode Active</span>
          <span className="text-xs font-bold text-amber-700">Logs are permanent and cannot be deleted or modified. IP addresses and device fingerprints are captured.</span>
        </div>
      </div>

      {/* Main Table Section */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <AuditLogTable />
      </section>

    </div>
  )
}
