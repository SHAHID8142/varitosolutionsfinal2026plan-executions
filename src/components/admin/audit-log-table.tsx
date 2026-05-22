/**
 * @file audit-log-table.tsx
 * @description Advanced table for tracking administrator actions.
 *              Includes who, what, when, and from where.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { 
  Search, 
  User, 
  Globe, 
  Monitor,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
// TYPES & MOCK DATA
// ─────────────────────────────────────────────

interface AuditEntry {
  id: string
  admin: string
  action: string
  target: string
  timestamp: string
  ip: string
  device: string
  severity: "info" | "warning" | "danger"
}

const MOCK_LOGS: AuditEntry[] = [
  { id: "1", admin: "Shahidul Islam", action: "Updated Product Price", target: "VR-SAN-001", timestamp: "2 mins ago", ip: "103.120.201.5", device: "MacBook Pro / Chrome", severity: "info" },
  { id: "2", admin: "System", action: "Inventory Alert Generated", target: "VR-PKG-012", timestamp: "15 mins ago", ip: "127.0.0.1", device: "Server Core", severity: "warning" },
  { id: "3", admin: "Karim Admin", action: "Banned Customer", target: "C-5820", timestamp: "1 hour ago", ip: "103.120.201.5", device: "Windows PC / Firefox", severity: "danger" },
  { id: "4", admin: "Shahidul Islam", action: "Created Coupon", target: "EID2026", timestamp: "2 hours ago", ip: "103.120.201.5", device: "iPhone 15 / Safari", severity: "info" },
  { id: "5", admin: "System", action: "Maintenance Mode Enabled", target: "Global Settings", timestamp: "5 hours ago", ip: "127.0.0.1", device: "Admin Script", severity: "warning" },
]

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export function AuditLogTable() {
  const [search, setSearch] = React.useState("")

  const filteredLogs = MOCK_LOGS.filter(log => 
    log.admin.toLowerCase().includes(search.toLowerCase()) || 
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.target.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 max-w-md relative">
          <Search className="absolute left-4 size-4 text-gray-400" />
          <Input 
            placeholder="Search logs by admin, action or target..." 
            className="pl-11 h-12 rounded-xl border-gray-100 bg-white shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 px-5 rounded-xl gap-2 font-bold border-gray-100 bg-white shadow-sm">
          <Filter className="size-4" /> Filter by Date
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Admin / User</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action Performed</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Entity</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Metadata</th>
                <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <User className="size-4 text-gray-400" />
                      </div>
                      <span className="text-sm font-black text-gray-900 truncate">{log.admin}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "size-2 rounded-full",
                        log.severity === "info" && "bg-blue-500",
                        log.severity === "warning" && "bg-amber-500",
                        log.severity === "danger" && "bg-red-500"
                      )} />
                      <span className="text-sm font-bold text-gray-700">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Badge variant="outline" className="font-mono text-[10px] border-gray-200 text-gray-500 bg-gray-50/50">
                      {log.target}
                    </Badge>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400">
                        <Globe className="size-2.5" /> {log.ip}
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400">
                        <Monitor className="size-2.5" /> {log.device}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="text-xs font-black text-gray-900">{log.timestamp}</span>
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
