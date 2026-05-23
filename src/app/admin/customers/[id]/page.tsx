/**
 * @file page.tsx
 * @path /admin/customers/[id]
 * @description Detailed view of a single customer for administrators.
 *              Includes profile info, order history, and total value.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  ShoppingBag,
  Ban,
  CheckCircle2,
  MoreVertical,
  History
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

const CUSTOMER = {
  id: "C-5820",
  name: "Karim Ahmed",
  phone: "01711122233",
  email: "karim.ahmed@example.com",
  joinedDate: "January 15, 2026",
  status: "active",
  totalOrders: 12,
  totalSpent: 45200,
  addresses: [
    { type: "Home", text: "House 12, Road 4, Sector 7, Uttara, Dhaka-1230", isDefault: true },
    { type: "Office", text: "Flat 4A, Plot 10, Agrabad C/A, Chattogram", isDefault: false },
  ],
  orders: [
    { id: "VR-2026-0001", date: "May 22, 2026", total: 12610, status: "pending", payment: "COD" },
    { id: "VR-2026-0005", date: "May 10, 2026", total: 4500, status: "delivered", payment: "bKash" },
    { id: "VR-2026-0012", date: "April 28, 2026", total: 3200, status: "delivered", payment: "Nagad" },
    { id: "VR-2026-0024", date: "April 05, 2026", total: 8500, status: "returned", payment: "COD" },
  ]
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function CustomerDetailPage() {
  const [isBanned, setIsBanned] = React.useState(CUSTOMER.status === "banned")

  const handleToggleBan = () => {
    setIsBanned(!isBanned)
    toast.success(`Customer account ${!isBanned ? "banned" : "reactivated"} successfully`)
  }

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
                <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">{CUSTOMER.name}</h1>
                <Badge variant={isBanned ? "destructive" : "verified"} className="uppercase text-[10px] px-2 h-5">
                  {isBanned ? "Banned" : "Active"}
                </Badge>
              </div>
              <span className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Customer ID: #{CUSTOMER.id}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant={isBanned ? "secondary" : "outline"}
              className={cn(
                "h-12 px-6 rounded-xl gap-2 font-black uppercase tracking-widest text-xs",
                !isBanned && "text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700"
              )}
              onClick={handleToggleBan}
            >
              {isBanned ? <><CheckCircle2 className="size-4" /> Reactivate Account</> : <><Ban className="size-4" /> Ban Customer</>}
            </Button>
            <Button className="h-12 px-8 rounded-xl font-black shadow-lg shadow-primary/20 uppercase tracking-widest text-xs">
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: Activity & History */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col gap-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Spent</span>
              <span className="text-2xl font-black text-gray-900">৳{CUSTOMER.totalSpent.toLocaleString()}</span>
            </div>
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col gap-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Orders</span>
              <span className="text-2xl font-black text-gray-900">{CUSTOMER.totalOrders}</span>
            </div>
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col gap-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Member Since</span>
              <span className="text-lg font-black text-gray-900 truncate">{CUSTOMER.joinedDate.split(',')[1]}</span>
            </div>
          </div>

          {/* Recent Orders */}
          <section className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                <History className="text-primary size-6" /> Order History
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-50">
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {CUSTOMER.orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <span className="text-sm font-black text-gray-900">{order.id}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-bold text-gray-500">{order.date}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-black text-gray-900">৳{order.total.toLocaleString()}</span>
                          <span className="text-[9px] font-bold text-gray-400 uppercase">{order.payment}</span>
                        </div>
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
          </section>

        </div>

        {/* RIGHT COLUMN: Profile Details */}
        <div className="lg:col-span-4 flex flex-col gap-10">
          
          {/* Contact Info */}
          <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-8">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Contact Details</h2>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <Phone className="size-5 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</span>
                  <a href={`tel:${CUSTOMER.phone}`} className="text-sm font-black text-gray-900 hover:text-primary transition-colors">{CUSTOMER.phone}</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="size-5 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</span>
                  <a href={`mailto:${CUSTOMER.email}`} className="text-sm font-bold text-gray-700 hover:text-primary transition-colors">{CUSTOMER.email}</a>
                </div>
              </div>
            </div>
          </section>

          {/* Saved Addresses */}
          <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-8">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Delivery Addresses</h2>
            
            <div className="flex flex-col gap-6">
              {CUSTOMER.addresses.map((addr, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-50">
                  <MapPin className="size-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{addr.type}</span>
                      {addr.isDefault && <Badge className="text-[8px] h-3.5 px-1 bg-primary text-white border-none uppercase">Default</Badge>}
                    </div>
                    <p className="text-xs font-bold text-gray-500 leading-relaxed">{addr.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Internal CRM / Staff Notes */}
          <section className="bg-blue-50 p-8 rounded-[40px] border border-blue-100 flex flex-col gap-4">
            <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
              <ShoppingBag className="size-4" /> Buying Behavior
            </h3>
            <p className="text-xs font-medium text-blue-700 leading-relaxed">
              Frequent buyer of Sanitary items. High average order value. Usually pays via bKash. Preferred delivery time: Afternoon.
            </p>
          </section>

        </div>

      </div>

    </div>
  )
}
