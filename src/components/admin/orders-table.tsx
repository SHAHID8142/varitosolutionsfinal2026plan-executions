/**
 * @file orders-table.tsx
 * @description Advanced tab-based order management system with contextual actions.
 *              Includes courier partner customer scorecard for trust verification.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { 
  Search, 
  ArrowUpDown, 
  MoreHorizontal, 
  Eye, 
  Printer, 
  Download,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Package,
  Truck,
  UserCheck,
  UserX,
  RotateCcw,
  CircleDollarSign,
  ClipboardCheck,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  History
} from "lucide-react"
import { 
  OrderStatusBadge, 
  type OrderStatus 
} from "./order-status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// ─────────────────────────────────────────────
// TYPES & MOCK DATA
// ─────────────────────────────────────────────

interface CourierTrust {
  successRate: number
  totalOrders: number
  cancellationRate: number
  trustLevel: "high" | "medium" | "low"
}

interface Order {
  id: string
  customer: string
  phone: string
  date: string
  total: number
  status: OrderStatus
  paymentMethod: "COD" | "bKash" | "Nagad" | "Card"
  paymentStatus: "paid" | "unpaid" | "partially_paid"
  courierTrust?: CourierTrust
}

const MOCK_ORDERS: Order[] = [
  { 
    id: "VR-2026-0001", 
    customer: "Karim Ahmed", 
    phone: "01711122233", 
    date: "2026-05-22 10:30", 
    total: 4500, 
    status: "pending", 
    paymentMethod: "COD", 
    paymentStatus: "unpaid",
    courierTrust: { successRate: 98, totalOrders: 42, cancellationRate: 2, trustLevel: "high" }
  },
  { 
    id: "VR-2026-0002", 
    customer: "Sultana Begum", 
    phone: "01822233344", 
    date: "2026-05-22 09:15", 
    total: 3200, 
    status: "approved", 
    paymentMethod: "bKash", 
    paymentStatus: "paid",
    courierTrust: { successRate: 85, totalOrders: 12, cancellationRate: 15, trustLevel: "medium" }
  },
  { id: "VR-2026-0003", customer: "Tanvir Hasan", phone: "01933344455", date: "2026-05-21 18:45", total: 1250, status: "packing", paymentMethod: "Nagad", paymentStatus: "paid" },
  { id: "VR-2026-0004", customer: "Nabila Tabassum", phone: "01544455566", date: "2026-05-21 14:20", total: 5800, status: "shipping", paymentMethod: "Card", paymentStatus: "paid" },
  { 
    id: "VR-2026-0005", 
    customer: "Rafiqul Islam", 
    phone: "01355566677", 
    date: "2026-05-21 11:05", 
    total: 850, 
    status: "not_received", 
    paymentMethod: "COD", 
    paymentStatus: "unpaid",
    courierTrust: { successRate: 40, totalOrders: 5, cancellationRate: 60, trustLevel: "low" }
  },
  { id: "VR-2026-0006", customer: "Moushumi Akter", phone: "01666677788", date: "2026-05-20 16:30", total: 2750, status: "delivered", paymentMethod: "COD", paymentStatus: "unpaid" },
  { id: "VR-2026-0007", customer: "Jasim Uddin", phone: "01777788899", date: "2026-05-20 13:10", total: 9400, status: "refunded", paymentMethod: "bKash", paymentStatus: "paid" },
]

const WORKFLOW_TABS = [
  { id: "all", label: "All Orders" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "packing", label: "Packing" },
  { id: "shipping", label: "Shipping" },
  { id: "handover", label: "Handover" },
  { id: "delivered", label: "Delivered" },
  { id: "not_received", label: "Not Received" },
  { id: "cancelled", label: "Cancelled" },
  { id: "returned", label: "Return" },
  { id: "refunded", label: "Refund" },
]

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

function CourierScorecard({ trust }: { trust: CourierTrust }) {
  const isHigh = trust.trustLevel === "high"
  const isLow = trust.trustLevel === "low"

  return (
    <div className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-2xl border transition-all cursor-help",
      isHigh ? "bg-emerald-50 border-emerald-100 text-emerald-700" : 
      isLow ? "bg-red-50 border-red-100 text-red-700" : 
      "bg-amber-50 border-amber-100 text-amber-700"
    )}>
      {isHigh ? <ShieldCheck className="size-4 shrink-0" /> : isLow ? <ShieldAlert className="size-4 shrink-0" /> : <AlertCircle className="size-4 shrink-0" />}
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-black uppercase tracking-tighter">Courier Score</span>
        <span className="text-[9px] font-bold opacity-80">{trust.successRate}% Success ({trust.totalOrders} total)</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export function OrdersTable() {
  const [search, setSearch] = React.useState("")
  const [activeTab, setActiveTab] = React.useState<string>("all")

  const filteredOrders = MOCK_ORDERS.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(search.toLowerCase()) || 
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.phone.includes(search)
    
    const matchesTab = activeTab === "all" || order.status === activeTab

    return matchesSearch && matchesTab
  })

  /** Returns contextual menu items based on order status. */
  const getContextualActions = (order: Order) => {
    const common = [
      <DropdownMenuItem key="view" className="rounded-xl font-bold h-10 cursor-pointer">
        <Eye className="mr-2 size-4 text-gray-500" /> View Details
      </DropdownMenuItem>,
      <DropdownMenuItem key="print" className="rounded-xl font-bold h-10 cursor-pointer">
        <Printer className="mr-2 size-4 text-blue-500" /> Print Invoice
      </DropdownMenuItem>
    ]

    switch (order.status) {
      case "pending":
        return [
          <DropdownMenuLabel key="label">Pending Confirmation</DropdownMenuLabel>,
          ...common,
          <DropdownMenuSeparator key="sep" />,
          <DropdownMenuItem key="approve" onClick={() => toast.success("Order Approved")} className="rounded-xl font-bold h-10 cursor-pointer text-emerald-600 focus:bg-emerald-50">
            <CheckCircle2 className="mr-2 size-4" /> Approve Order
          </DropdownMenuItem>,
          <DropdownMenuItem key="cancel" className="rounded-xl font-bold h-10 cursor-pointer text-red-600 focus:bg-red-50">
            <XCircle className="mr-2 size-4" /> Cancel Order
          </DropdownMenuItem>
        ]
      case "approved":
        return [
          <DropdownMenuLabel key="label">Warehouse Queue</DropdownMenuLabel>,
          ...common,
          <DropdownMenuSeparator key="sep" />,
          <DropdownMenuItem key="pack" onClick={() => toast.info("Moving to Packing")} className="rounded-xl font-bold h-10 cursor-pointer text-cyan-600 focus:bg-cyan-50">
            <Package className="mr-2 size-4" /> Start Packing
          </DropdownMenuItem>,
          <DropdownMenuItem key="cancel" className="rounded-xl font-bold h-10 cursor-pointer text-red-600 focus:bg-red-50">
            <XCircle className="mr-2 size-4" /> Cancel Order
          </DropdownMenuItem>
        ]
      case "packing":
        return [
          <DropdownMenuLabel key="label">Logistics Handover</DropdownMenuLabel>,
          ...common,
          <DropdownMenuSeparator key="sep" />,
          <DropdownMenuItem key="ship" onClick={() => toast.info("Handed over to courier")} className="rounded-xl font-bold h-10 cursor-pointer text-purple-600 focus:bg-purple-50">
            <Truck className="mr-2 size-4" /> Handover to Courier
          </DropdownMenuItem>,
          <DropdownMenuItem key="label-print" className="rounded-xl font-bold h-10 cursor-pointer">
            <ClipboardCheck className="mr-2 size-4" /> Print Shipping Label
          </DropdownMenuItem>
        ]
      case "shipping":
        return [
          <DropdownMenuLabel key="label">Transit Management</DropdownMenuLabel>,
          ...common,
          <DropdownMenuItem key="track" className="rounded-xl font-bold h-10 cursor-pointer">
            <ExternalLink className="mr-2 size-4 text-purple-500" /> Track Courier
          </DropdownMenuItem>,
          <DropdownMenuSeparator key="sep" />,
          <DropdownMenuItem key="deliver" className="rounded-xl font-bold h-10 cursor-pointer text-emerald-600">
            <UserCheck className="mr-2 size-4" /> Mark Delivered
          </DropdownMenuItem>,
          <DropdownMenuItem key="fail" className="rounded-xl font-bold h-10 cursor-pointer text-orange-600">
            <UserX className="mr-2 size-4" /> Mark Not Received
          </DropdownMenuItem>
        ]
      case "delivered":
        return [
          <DropdownMenuLabel key="label">Completed Order</DropdownMenuLabel>,
          ...common,
          <DropdownMenuSeparator key="sep" />,
          <DropdownMenuItem key="return" className="rounded-xl font-bold h-10 cursor-pointer text-amber-600">
            <RotateCcw className="mr-2 size-4" /> Initiate Return
          </DropdownMenuItem>
        ]
      case "returned":
        return [
          <DropdownMenuLabel key="label">RTO Processing</DropdownMenuLabel>,
          ...common,
          <DropdownMenuSeparator key="sep" />,
          <DropdownMenuItem key="refund" className="rounded-xl font-bold h-10 cursor-pointer text-pink-600">
            <CircleDollarSign className="mr-2 size-4" /> Process Refund
          </DropdownMenuItem>
        ]
      default:
        return [...common, <DropdownMenuSeparator key="sep" />, <DropdownMenuItem key="history" className="rounded-xl font-bold h-10 cursor-pointer"><History className="mr-2 size-4" /> View Logs</DropdownMenuItem>]
    }
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header & Tabs */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Order Management</h2>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-3 max-w-md relative">
              <Search className="absolute left-4 size-4 text-gray-400" />
              <Input 
                placeholder="ID, Name or Phone..." 
                className="pl-11 h-12 w-[300px] rounded-xl border-gray-100 bg-white shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-12 px-5 rounded-xl gap-2 font-bold border-gray-100 bg-white shadow-sm">
              <Download className="size-4" />
              Export
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-0 p-0 h-auto flex-wrap gap-2">
            {WORKFLOW_TABS.map(tab => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className={cn(
                  "h-10 rounded-full border border-gray-100 bg-white px-5 text-[10px] font-black tracking-widest transition-all",
                  "data-selected:bg-emerald-600 data-selected:text-white data-selected:border-emerald-600 data-selected:shadow-lg data-selected:shadow-emerald-200"
                )}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Table Surface */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/30">
                <th className="px-6 py-5">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Order Details <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th className="px-6 py-5">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Courier Insights
                  </div>
                </th>
                <th className="px-6 py-5">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Amount & Pay
                  </div>
                </th>
                <th className="px-6 py-5">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Workflow
                  </div>
                </th>
                <th className="px-6 py-5 text-right">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-black text-gray-900">{order.id}</span>
                      <div className="flex flex-col leading-tight">
                        <span className="text-xs font-bold text-gray-700 truncate max-w-[150px]">{order.customer}</span>
                        <span className="text-[10px] font-bold text-gray-400">{order.phone}</span>
                      </div>
                      <span className="text-[9px] font-bold text-gray-300 uppercase">{order.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {order.courierTrust ? (
                      <CourierScorecard trust={order.courierTrust} />
                    ) : (
                      <span className="text-[10px] font-bold text-gray-300 uppercase italic">No courier history</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-black text-gray-900">৳{order.total.toLocaleString()}</span>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className={cn(
                          "text-[9px] font-black uppercase px-1.5 py-0",
                          order.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
                        )}>
                          {order.paymentStatus}
                        </Badge>
                        <span className="text-[9px] font-bold text-gray-400">{order.paymentMethod}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-10 px-4 rounded-xl border border-gray-100 hover:bg-gray-50 flex items-center justify-center gap-2 outline-none transition-all font-black text-[10px] uppercase tracking-widest text-gray-500">
                            Options <MoreHorizontal className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 p-2 rounded-[24px] shadow-2xl border-gray-100">
                          {getContextualActions(order)}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="size-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-200">
                        <Package className="size-10" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-lg font-black text-gray-900 uppercase">Empty Workflow</p>
                        <p className="text-sm font-bold text-gray-400">No orders found in the &quot;{activeTab}&quot; stage.</p>
                      </div>
                      <Button 
                        variant="primary" 
                        onClick={() => setActiveTab("all")} 
                        className="rounded-full px-8 font-black uppercase tracking-widest shadow-xl shadow-emerald-200"
                      >
                        Show All Orders
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Logistics Pipeline: <span className="text-gray-900">{filteredOrders.length}</span> active tasks in this view
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-gray-100" disabled>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-10 px-5 rounded-xl border-emerald-200 bg-emerald-50 text-emerald-700 font-black">
              1
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-gray-100">
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
