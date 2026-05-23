/**
 * @file page.tsx
 * @path /admin/orders/[id]
 * @description Detailed view of a single order for administrators.
 *              Fetches from GET /api/admin/orders/[id].
 *              Status updates via PATCH /api/admin/orders/[id]/status.
 *              Admin notes via PATCH /api/admin/orders/[id]/notes.
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
  Printer,
  CreditCard,
  User,
  MapPin,
  Phone,
  Calendar,
  Package,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Clock,
  Loader2,
} from "lucide-react"
import { OrderStatusBadge, type OrderStatus } from "@/components/admin/order-status-badge"
import { OrderTimeline, type TimelineEvent } from "@/components/admin/order-timeline"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { adminFetch, adminHeaders } from "@/lib/admin-fetch"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface OrderDetail {
  id: string
  orderNumber: string
  status: OrderStatus
  paymentStatus: string
  paymentMethod: string
  subtotal: number
  deliveryCharge: number
  codFee: number
  discount: number
  total: number
  notes: string | null
  adminNotes: string | null
  shippingAddress: {
    name: string
    phone: string
    district: string
    thana: string
    area: string | null
    road: string | null
    house: string | null
    landmark: string | null
  }
  items: {
    id: string
    name: string
    qty: number
    unitPrice: number
    total: number
  }[]
  history: {
    fromStatus: string | null
    toStatus: string
    note: string | null
    createdAt: string
  }[]
  createdAt: string
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-BD", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

function paymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    cod: "Cash on Delivery (COD)",
    bkash: "bKash",
    nagad: "Nagad",
    card: "Card",
  }
  return labels[method] ?? method
}

function historyToTimeline(history: OrderDetail["history"]): TimelineEvent[] {
  return history.map((h) => ({
    status: (h.toStatus as OrderStatus) ?? "pending",
    title: `Status: ${h.toStatus}`,
    description: h.note ?? undefined,
    timestamp: formatDateTime(h.createdAt),
  }))
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

/** Admin order detail page — fetches real order data and supports live status updates. */
export default function OrderDetailPage() {
  const params = useParams()
  const orderId = params.id as string

  const [order, setOrder] = React.useState<OrderDetail | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [notFound, setNotFound] = React.useState(false)

  const [status, setStatus] = React.useState<OrderStatus>("pending")
  const [note, setNote] = React.useState("")
  const [adminNote, setAdminNote] = React.useState("")
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false)
  const [isSavingNote, setIsSavingNote] = React.useState(false)

  React.useEffect(() => {
    async function load() {
      const { data, error, status: httpStatus } = await adminFetch<OrderDetail>(`/api/admin/orders/${orderId}`)
      if (httpStatus === 404) { setNotFound(true); return }
      if (error || !data) { toast.error(error ?? "Failed to load order"); return }
      setOrder(data)
      setStatus(data.status)
      setAdminNote(data.adminNotes ?? "")
      setLoading(false)
    }
    load()
  }, [orderId])

  const handleUpdateStatus = async () => {
    if (!order) return
    setIsUpdatingStatus(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: adminHeaders(),
        body: JSON.stringify({ status, note: note.trim() || undefined }),
      })
      const json = await res.json()
      if (!res.ok) { toast.error(json.error ?? "Failed to update status"); return }
      toast.success(`Order status updated to ${status}`)
      setNote("")
      // Refresh order data
      const { data } = await adminFetch<OrderDetail>(`/api/admin/orders/${orderId}`)
      if (data) setOrder(data)
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleSaveAdminNote = async () => {
    if (!adminNote.trim()) return
    setIsSavingNote(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/notes`, {
        method: "PATCH",
        headers: adminHeaders(),
        body: JSON.stringify({ adminNotes: adminNote }),
      })
      const json = await res.json()
      if (!res.ok) { toast.error(json.error ?? "Failed to save note"); return }
      toast.success("Admin note saved")
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setIsSavingNote(false)
    }
  }

  if (loading && !notFound) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (notFound || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4 text-center">
        <AlertCircle className="size-12 text-red-400" />
        <h2 className="text-xl font-black text-gray-900">Order Not Found</h2>
        <p className="text-gray-500 font-medium">This order does not exist or you do not have access.</p>
        <Link href="/admin/orders">
          <Button variant="outline" className="mt-2">Back to Orders</Button>
        </Link>
      </div>
    )
  }

  const timeline = historyToTimeline(order.history)
  const address = order.shippingAddress
  const fullAddress = [address.house, address.road, address.area, address.thana, address.district]
    .filter(Boolean).join(", ")

  return (
    <div className="flex flex-col gap-10">

      {/* Header Area */}
      <div className="flex flex-col gap-6">
        <Link
          href="/admin/orders"
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors w-fit uppercase tracking-widest"
        >
          <ArrowLeft className="size-4" /> Back to Orders
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">Order {order.orderNumber}</h1>
              <OrderStatusBadge status={status} className="h-8 px-4" />
            </div>
            <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                {formatDateTime(order.createdAt)}
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <CreditCard className="size-4 text-primary" />
                {paymentMethodLabel(order.paymentMethod)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/admin/orders/${orderId}/print`}>
              <Button variant="outline" className="h-12 px-6 rounded-xl gap-2 font-black border-gray-200 bg-white uppercase tracking-widest text-xs">
                <Printer className="size-4" /> Print Invoice
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 flex flex-col gap-8">

          {/* 1. Order Items */}
          <section className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                <Package className="text-primary size-6" /> Order Items
              </h2>
              <Badge variant="outline" className="rounded-lg h-7 px-3 bg-gray-50 font-bold border-gray-100 text-gray-500">
                {order.items.length} Items
              </Badge>
            </div>

            <div className="flex flex-col divide-y divide-gray-50">
              {order.items.map((item) => (
                <div key={item.id} className="p-8 flex items-center gap-6 hover:bg-gray-50/50 transition-colors">
                  <div className="size-20 rounded-2xl bg-gray-100 border border-gray-100 shrink-0 flex items-center justify-center">
                    <Package className="size-8 text-gray-300" />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <h3 className="text-base font-black text-gray-900 line-clamp-1">{item.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm font-bold text-gray-400">
                      <span>৳{item.unitPrice.toLocaleString()} × {item.qty}</span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-lg font-black text-gray-900">৳{item.total.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="p-8 bg-gray-50/50 flex flex-col items-end gap-3 border-t border-gray-50">
              <div className="w-full max-w-xs flex flex-col gap-3">
                <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-wider">
                  <span>Subtotal</span><span>৳{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-wider">
                  <span>Delivery</span><span>৳{order.deliveryCharge.toLocaleString()}</span>
                </div>
                {order.codFee > 0 && (
                  <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-wider">
                    <span>COD Fee</span><span>৳{order.codFee.toLocaleString()}</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm font-bold text-primary uppercase tracking-wider">
                    <span>Discount</span><span>−৳{order.discount.toLocaleString()}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between text-2xl font-black text-gray-900 uppercase tracking-tight">
                  <span>Total</span><span className="text-primary">৳{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Update Status & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Update Status */}
            <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-6">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                <CheckCircle2 className="text-primary size-6" /> Update Status
              </h2>
              <div className="flex flex-col gap-4">
                <Select value={status} onValueChange={(val) => { if (val) setStatus(val as OrderStatus) }}>
                  <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 font-bold text-gray-700">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl p-2 border-gray-100">
                    <SelectItem value="pending" className="rounded-xl font-bold h-10">Pending</SelectItem>
                    <SelectItem value="confirmed" className="rounded-xl font-bold h-10">Confirmed</SelectItem>
                    <SelectItem value="processing" className="rounded-xl font-bold h-10">Processing</SelectItem>
                    <SelectItem value="shipped" className="rounded-xl font-bold h-10">Shipped</SelectItem>
                    <SelectItem value="delivered" className="rounded-xl font-bold h-10">Delivered</SelectItem>
                    <SelectItem value="cancelled" className="rounded-xl font-bold h-10 text-red-600">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Optional note for this status change..."
                  className="rounded-2xl border-gray-100 bg-gray-50/50 min-h-[56px] py-4 px-5 font-medium text-gray-700"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <Button onClick={handleUpdateStatus} loading={isUpdatingStatus} className="h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/10">
                  Save Status
                </Button>
              </div>
            </section>

            {/* Admin Notes */}
            <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-6">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                <MessageSquare className="text-primary size-6" /> Admin Notes
              </h2>
              <div className="flex flex-col gap-4">
                <Textarea
                  placeholder="Internal notes for staff (not visible to customer)..."
                  className="rounded-2xl border-gray-100 bg-gray-50/50 min-h-[100px] py-4 px-5 font-medium text-gray-700 focus:bg-white"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
                <Button
                  variant="secondary"
                  onClick={handleSaveAdminNote}
                  loading={isSavingNote}
                  className="h-14 rounded-2xl font-black uppercase tracking-widest text-xs bg-gray-100 border-none"
                >
                  Save Note
                </Button>
              </div>
            </section>

          </div>
        </div>

        {/* RIGHT COLUMN: Customer & Timeline */}
        <div className="lg:col-span-4 flex flex-col gap-10">

          {/* Customer Info Card */}
          <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 size-48 bg-primary/5 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700" />

            <div className="flex items-center gap-5 relative z-10">
              <div className="size-16 rounded-3xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
                <User className="size-8" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">{address.name}</h3>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</span>
              </div>
            </div>

            <Separator className="bg-gray-50" />

            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex items-start gap-4">
                <MapPin className="size-5 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Shipping Address</span>
                  <p className="text-sm font-bold text-gray-700 leading-relaxed">{fullAddress}</p>
                  {address.landmark && (
                    <p className="text-xs text-gray-400 font-medium">Near: {address.landmark}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="size-5 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Phone Number</span>
                  <a href={`tel:${address.phone}`} className="text-sm font-black text-gray-900 hover:text-primary transition-colors">{address.phone}</a>
                </div>
              </div>
            </div>
          </section>

          {/* Order Timeline */}
          <section className="flex flex-col gap-8 px-2">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
              <Clock className="text-primary size-6" /> Order History
            </h2>
            {timeline.length > 0 ? (
              <OrderTimeline events={timeline} />
            ) : (
              <p className="text-sm text-gray-400 font-medium">No status history yet.</p>
            )}
          </section>

          {/* COD Verification Alert */}
          {order.paymentMethod === "cod" && order.status === "pending" && (
            <section className="bg-amber-50 p-8 rounded-[40px] border border-amber-100 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="size-6 text-amber-600" />
                <h3 className="text-sm font-black text-amber-900 uppercase tracking-widest">Verification Recommended</h3>
              </div>
              <p className="text-xs font-medium text-amber-700 leading-relaxed">
                This is a COD order. Call the customer to verify their address before confirming.
              </p>
              <a href={`tel:${address.phone}`}>
                <Button variant="outline" className="mt-2 border-amber-200 bg-white text-amber-700 hover:bg-amber-100 rounded-xl font-black text-[10px] uppercase tracking-widest h-10 w-full">
                  Call {address.phone}
                </Button>
              </a>
            </section>
          )}

        </div>

      </div>

    </div>
  )
}
