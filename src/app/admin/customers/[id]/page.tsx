/**
 * @file page.tsx
 * @path /admin/customers/[id]
 * @description Detailed view of a single customer for administrators.
 *              Fetches from GET /api/admin/customers/[id].
 *              Supports ban/unban via PATCH /api/admin/users/[id].
 *
 * @owner    Gemini Design Agent / Claude Backend Agent
 * @updated  2026-05-24
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  ShoppingBag,
  Ban,
  CheckCircle2,
  MoreVertical,
  History,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { adminFetch, adminHeaders } from "@/lib/admin-fetch"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface CustomerDetail {
  id: string
  name: string | null
  phone: string | null
  email: string | null
  isBanned: boolean
  banReason: string | null
  createdAt: string
  stats: { orderCount: number; totalSpent: number }
  recentOrders: {
    id: string
    orderNumber: string
    status: string
    total: number
    createdAt: string
  }[]
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" })
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

/** Admin customer detail page — live data from API with ban/unban action. */
export default function CustomerDetailPage() {
  const params = useParams()
  const customerId = params.id as string

  const [customer, setCustomer] = React.useState<CustomerDetail | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [notFound, setNotFound] = React.useState(false)
  const [isTogglingBan, setIsTogglingBan] = React.useState(false)

  React.useEffect(() => {
    async function load() {
      const { data, error, status } = await adminFetch<CustomerDetail>(`/api/admin/customers/${customerId}`)
      if (status === 404) { setNotFound(true); setLoading(false); return }
      if (error || !data) { toast.error(error ?? "Failed to load customer"); setLoading(false); return }
      setCustomer(data)
      setLoading(false)
    }
    load()
  }, [customerId])

  const handleToggleBan = async () => {
    if (!customer) return
    setIsTogglingBan(true)
    try {
      const res = await fetch(`/api/admin/users/${customerId}`, {
        method: "PATCH",
        headers: adminHeaders(),
        body: JSON.stringify({
          isBanned: !customer.isBanned,
          banReason: customer.isBanned ? null : "Banned by admin",
        }),
      })
      const json = await res.json()
      if (!res.ok) { toast.error(json.error ?? "Failed to update"); return }
      setCustomer((prev) => prev ? { ...prev, isBanned: !prev.isBanned } : prev)
      toast.success(`Account ${customer.isBanned ? "reactivated" : "banned"} successfully`)
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setIsTogglingBan(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (notFound || !customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4 text-center">
        <AlertCircle className="size-12 text-red-400" />
        <h2 className="text-xl font-black text-gray-900">Customer Not Found</h2>
        <Link href="/admin/customers">
          <Button variant="outline" className="mt-2">Back to Customers</Button>
        </Link>
      </div>
    )
  }

  const displayName = customer.name ?? customer.phone ?? "Unknown Customer"

  return (
    <div className="flex flex-col gap-10">

      {/* Header Area */}
      <div className="flex flex-col gap-6">
        <Link
          href="/admin/customers"
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors w-fit uppercase tracking-widest"
        >
          <ArrowLeft className="size-4" /> Back to Customers
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="size-16 md:size-20 rounded-3xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
              <User className="size-8 md:size-10" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">{displayName}</h1>
                <Badge variant={customer.isBanned ? "destructive" : "verified"} className="uppercase text-[10px] px-2 h-5">
                  {customer.isBanned ? "Banned" : "Active"}
                </Badge>
              </div>
              <span className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
                Member since {formatDate(customer.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant={customer.isBanned ? "secondary" : "outline"}
              loading={isTogglingBan}
              className={cn(
                "h-12 px-6 rounded-xl gap-2 font-black uppercase tracking-widest text-xs",
                !customer.isBanned && "text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700"
              )}
              onClick={handleToggleBan}
            >
              {customer.isBanned
                ? <><CheckCircle2 className="size-4" /> Reactivate Account</>
                : <><Ban className="size-4" /> Ban Customer</>
              }
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        {/* LEFT COLUMN: Metrics & Order History */}
        <div className="lg:col-span-8 flex flex-col gap-8">

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col gap-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Spent</span>
              <span className="text-2xl font-black text-gray-900">৳{customer.stats.totalSpent.toLocaleString()}</span>
            </div>
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col gap-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Orders</span>
              <span className="text-2xl font-black text-gray-900">{customer.stats.orderCount}</span>
            </div>
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col gap-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</span>
              <span className={cn("text-lg font-black", customer.isBanned ? "text-red-600" : "text-primary")}>
                {customer.isBanned ? "Banned" : "Active"}
              </span>
            </div>
          </div>

          {/* Recent Orders */}
          <section className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                <History className="text-primary size-6" /> Order History
              </h2>
            </div>

            {customer.recentOrders.length === 0 ? (
              <div className="p-12 flex flex-col items-center gap-3 text-center">
                <ShoppingBag className="size-10 text-gray-200" />
                <p className="text-sm font-bold text-gray-400">No orders yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-50">
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {customer.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <span className="text-sm font-black text-gray-900">{order.orderNumber}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-xs font-bold text-gray-500">{formatDate(order.createdAt)}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-sm font-black text-gray-900">৳{order.total.toLocaleString()}</span>
                        </td>
                        <td className="px-8 py-5">
                          <Badge variant="outline" className="uppercase text-[9px] font-black px-2">
                            {order.status}
                          </Badge>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <Link href={`/admin/orders/${order.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                              <MoreVertical className="size-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

        </div>

        {/* RIGHT COLUMN: Contact Info */}
        <div className="lg:col-span-4 flex flex-col gap-10">

          <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-8">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Contact Details</h2>

            <div className="flex flex-col gap-6">
              {customer.phone && (
                <div className="flex items-start gap-4">
                  <Phone className="size-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</span>
                    <a href={`tel:${customer.phone}`} className="text-sm font-black text-gray-900 hover:text-primary transition-colors">{customer.phone}</a>
                  </div>
                </div>
              )}

              {customer.email && (
                <div className="flex items-start gap-4">
                  <Mail className="size-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</span>
                    <a href={`mailto:${customer.email}`} className="text-sm font-bold text-gray-700 hover:text-primary transition-colors">{customer.email}</a>
                  </div>
                </div>
              )}

              {!customer.phone && !customer.email && (
                <p className="text-sm text-gray-400 font-medium">No contact details on file.</p>
              )}
            </div>
          </section>

          {customer.isBanned && customer.banReason && (
            <section className="bg-red-50 p-8 rounded-[40px] border border-red-100 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Ban className="size-5 text-red-600" />
                <h3 className="text-sm font-black text-red-900 uppercase tracking-widest">Ban Reason</h3>
              </div>
              <p className="text-xs font-medium text-red-700 leading-relaxed">{customer.banReason}</p>
            </section>
          )}

        </div>

      </div>

    </div>
  )
}
