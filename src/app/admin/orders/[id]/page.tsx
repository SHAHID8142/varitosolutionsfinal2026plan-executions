/**
 * @file page.tsx
 * @path /admin/orders/[id]
 * @description Detailed view of a single order for administrators.
 *              Includes item list, customer details, payment info, and timeline.
 *              Allows status updates, admin notes, and invoice printing.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  Printer, 
  CreditCard, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  Package,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Clock
} from "lucide-react"
import Image from "next/image"
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

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

const ORDER = {
  id: "VR-2026-0001",
  date: "May 22, 2026 at 10:30 AM",
  status: "pending" as OrderStatus,
  paymentMethod: "Cash on Delivery (COD)",
  paymentStatus: "unpaid",
  subtotal: 12450,
  shipping: 120,
  codFee: 40,
  discount: 0,
  total: 12610,
  customer: {
    name: "Karim Ahmed",
    phone: "01711122233",
    email: "karim.ahmed@example.com",
    address: "House 12, Road 4, Sector 7, Uttara, Dhaka-1230",
    orderCount: 5,
    joinedDate: "Jan 15, 2026"
  },
  items: [
    {
      id: "1",
      name: "Luxury Emerald Gold Faucet - Dual Handle Bathroom Mixer",
      sku: "VR-SAN-001",
      image: "https://placehold.co/100x100/10b981/white.png?text=Faucet",
      price: 3800,
      quantity: 3,
      total: 11400
    },
    {
      id: "2",
      name: "Heavy Duty Packaging Tape (6 Pack)",
      sku: "VR-PKG-005",
      image: "https://placehold.co/100x100/10b981/white.png?text=Tape",
      price: 720,
      quantity: 1,
      total: 720
    },
    {
      id: "3",
      name: "Bubble Wrap (10 Meter Roll)",
      sku: "VR-PKG-012",
      image: "https://placehold.co/100x100/10b981/white.png?text=Bubble",
      price: 330,
      quantity: 1,
      total: 330
    }
  ],
  timeline: [
    { status: "pending", title: "Order Placed", description: "Customer placed the order from the online store.", timestamp: "10:30 AM", user: "System" },
  ] as TimelineEvent[]
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function OrderDetailPage({ params: _params }: { params: { id: string } }) {
  const [status, setStatus] = React.useState<OrderStatus>(ORDER.status)
  const [note, setNote] = React.useState("")
  const [isUpdating, setIsUpdating] = React.useState(false)

  const handleUpdateStatus = () => {
    setIsUpdating(true)
    setTimeout(() => {
      setIsUpdating(false)
      toast.success(`Order status updated to ${status}`)
    }, 1000)
  }

  const handleAddNote = () => {
    if (!note.trim()) return
    toast.success("Internal note added successfully")
    setNote("")
  }

  return (
    <div className="flex flex-col gap-10">
      
      {/* Header Area */}
      <div className="flex flex-col gap-6">
        <Link 
          href="/admin/orders" 
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-emerald-600 transition-colors w-fit uppercase tracking-widest"
        >
          <ArrowLeft className="size-4" /> Back to Orders
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">Order {ORDER.id}</h1>
              <OrderStatusBadge status={status} className="h-8 px-4" />
            </div>
            <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-emerald-500" />
                {ORDER.date}
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <CreditCard className="size-4 text-emerald-500" />
                {ORDER.paymentMethod}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/admin/orders/${ORDER.id}/print`}>
              <Button variant="outline" className="h-12 px-6 rounded-xl gap-2 font-black border-gray-200 bg-white uppercase tracking-widest text-xs">
                <Printer className="size-4" /> Print Invoice
              </Button>
            </Link>
            <Button className="h-12 px-8 rounded-xl font-black shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-xs">
              Confirm Order
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: Order Details */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* 1. Order Items */}
          <section className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                <Package className="text-emerald-600 size-6" /> Order Items
              </h2>
              <Badge variant="outline" className="rounded-lg h-7 px-3 bg-gray-50 font-bold border-gray-100 text-gray-500">
                {ORDER.items.length} Items
              </Badge>
            </div>
            
            <div className="flex flex-col divide-y divide-gray-50">
              {ORDER.items.map((item) => (
                <div key={item.id} className="p-8 flex items-center gap-6 hover:bg-gray-50/50 transition-colors">
                  <div className="size-20 rounded-2xl bg-gray-100 border border-gray-100 shrink-0 relative overflow-hidden shadow-inner">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{item.sku}</span>
                    <h3 className="text-base font-black text-gray-900 line-clamp-1">{item.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm font-bold text-gray-400">
                      <span>৳{item.price.toLocaleString()} × {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-lg font-black text-gray-900">৳{item.total.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Summary Footer */}
            <div className="p-8 bg-gray-50/50 flex flex-col items-end gap-3 border-t border-gray-50">
              <div className="w-full max-w-xs flex flex-col gap-3">
                <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-wider">
                  <span>Subtotal</span>
                  <span>৳{ORDER.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-wider">
                  <span>Shipping Fee</span>
                  <span>৳{ORDER.shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-wider">
                  <span>COD Charge</span>
                  <span>৳{ORDER.codFee.toLocaleString()}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-2xl font-black text-gray-900 uppercase tracking-tight">
                  <span>Total</span>
                  <span className="text-emerald-600">৳{ORDER.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Update Status & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Update Status */}
            <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-6">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                <CheckCircle2 className="text-emerald-600 size-6" /> Update Status
              </h2>
              <div className="flex flex-col gap-4">
                <Select value={status} onValueChange={(val) => setStatus(val as OrderStatus)}>
                  <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 font-bold text-gray-700">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl p-2 border-gray-100">
                    <SelectItem value="pending" className="rounded-xl font-bold h-10">Pending</SelectItem>
                    <SelectItem value="confirmed" className="rounded-xl font-bold h-10">Confirmed</SelectItem>
                    <SelectItem value="shipped" className="rounded-xl font-bold h-10">Shipped</SelectItem>
                    <SelectItem value="delivered" className="rounded-xl font-bold h-10">Delivered</SelectItem>
                    <SelectItem value="cancelled" className="rounded-xl font-bold h-10 text-red-600">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleUpdateStatus} loading={isUpdating} className="h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/10">
                  Save Status
                </Button>
              </div>
            </section>

            {/* Internal Notes */}
            <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-6">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                <MessageSquare className="text-emerald-600 size-6" /> Admin Notes
              </h2>
              <div className="flex flex-col gap-4">
                <Textarea 
                  placeholder="Add internal note for staff..." 
                  className="rounded-2xl border-gray-100 bg-gray-50/50 min-h-[56px] py-4 px-5 font-medium text-gray-700 focus:bg-white"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <Button variant="secondary" onClick={handleAddNote} className="h-14 rounded-2xl font-black uppercase tracking-widest text-xs bg-gray-100 border-none">
                  Add Note
                </Button>
              </div>
            </section>

          </div>
        </div>

        {/* RIGHT COLUMN: Customer & Timeline */}
        <div className="lg:col-span-4 flex flex-col gap-10">
          
          {/* 1. Customer Info Card */}
          <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 size-48 bg-emerald-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700" />
            
            <div className="flex items-center gap-5 relative z-10">
              <div className="size-16 rounded-3xl bg-emerald-600 flex items-center justify-center text-white shadow-xl shadow-emerald-200">
                <User className="size-8" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">{ORDER.customer.name}</h3>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Customer ID: #C-5820</span>
              </div>
            </div>

            <Separator className="bg-gray-50" />

            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex items-start gap-4">
                <MapPin className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Shipping Address</span>
                  <p className="text-sm font-bold text-gray-700 leading-relaxed">{ORDER.customer.address}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Phone className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Phone Number</span>
                  <a href={`tel:${ORDER.customer.phone}`} className="text-sm font-black text-gray-900 hover:text-emerald-600 transition-colors">{ORDER.customer.phone}</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Email Address</span>
                  <a href={`mailto:${ORDER.customer.email}`} className="text-sm font-bold text-gray-700 hover:text-emerald-600 transition-colors">{ORDER.customer.email}</a>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-[32px] bg-gray-950 text-white flex justify-between items-center relative z-10">
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight">{ORDER.customer.orderCount}</span>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-400">Total Orders</span>
              </div>
              <Separator orientation="vertical" className="h-10 bg-white/10" />
              <div className="flex flex-col items-end">
                <span className="text-xs font-black uppercase tracking-wider text-right">Loyal Customer</span>
                <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest mt-1">Since {ORDER.customer.joinedDate}</span>
              </div>
            </div>
          </section>

          {/* 2. Order Timeline */}
          <section className="flex flex-col gap-8 px-2">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
              <Clock className="text-emerald-600 size-6" /> Order History
            </h2>
            <OrderTimeline events={ORDER.timeline} />
          </section>

          {/* 3. Fraud Risk / Trust Signals */}
          <section className="bg-amber-50 p-8 rounded-[40px] border border-amber-100 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="size-6 text-amber-600" />
              <h3 className="text-sm font-black text-amber-900 uppercase tracking-widest">Verification Status</h3>
            </div>
            <p className="text-xs font-medium text-amber-700 leading-relaxed">
              This is a first-time COD order. We recommend calling the customer to verify the address before confirming the order.
            </p>
            <Button variant="outline" className="mt-2 border-amber-200 bg-white text-amber-700 hover:bg-amber-100 rounded-xl font-black text-[10px] uppercase tracking-widest h-10">
              Call to Verify
            </Button>
          </section>

        </div>

      </div>

    </div>
  )
}
