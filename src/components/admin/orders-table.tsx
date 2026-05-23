/**
 * @file orders-table.tsx
 * @description Advanced tab-based order management system with contextual actions.
 *              Includes courier partner customer scorecard for trust verification.
 *              Optimized for high-volume processing with advanced filters and sorting.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
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
  History,
  Filter,
  Check
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

/** Generates 25 mock orders to demonstrate high-volume processing. */
const MOCK_ORDERS: Order[] = Array.from({ length: 25 }).map((_, i) => {
  const statuses: OrderStatus[] = ["pending", "approved", "packing", "shipping", "handover", "delivered", "not_received", "cancelled", "returned", "refunded"];
  const methods = ["COD", "bKash", "Nagad", "Card"] as const;
  const payStatuses = ["paid", "unpaid"] as const;
  const trustLevels = ["high", "medium", "low"] as const;
  
  const id = `VR-2026-${(1001 + i).toString().padStart(4, '0')}`;
  const status = statuses[i % statuses.length];
  const total = 500 + (Math.floor(Math.random() * 20) * 250);
  
  return {
    id,
    customer: ["Karim Ahmed", "Sultana Begum", "Tanvir Hasan", "Nabila Tabassum", "Rafiqul Islam", "Moushumi Akter", "Jasim Uddin"][i % 7],
    phone: `01${Math.floor(100000000 + Math.random() * 900000000)}`,
    date: `2026-05-${(22 - Math.floor(i / 5)).toString().padStart(2, '0')} ${10 + (i % 8)}:${(i * 7) % 60}`,
    total,
    status,
    paymentMethod: methods[i % methods.length],
    paymentStatus: payStatuses[i % 2],
    courierTrust: i % 3 === 0 ? {
      successRate: 40 + (Math.random() * 59),
      totalOrders: 5 + Math.floor(Math.random() * 50),
      cancellationRate: Math.random() * 30,
      trustLevel: trustLevels[i % 3]
    } : undefined
  }
});

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

/**
 * Compact scorecard widget showing courier trust level and delivery success rate.
 * Uses primary/destructive/warning tokens for consistent color semantics.
 */
function CourierScorecard({ trust }: { trust: CourierTrust }) {
  const isHigh = trust.trustLevel === "high"
  const isLow = trust.trustLevel === "low"

  return (
    <div className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-2xl border transition-all cursor-help",
      // primary = high trust, destructive = low trust, amber = medium trust
      isHigh ? "bg-primary/10 border-primary/20 text-primary" :
      isLow ? "bg-destructive/10 border-destructive/20 text-destructive" :
      "bg-amber-50 border-amber-100 text-amber-700"
    )}>
      {isHigh ? <ShieldCheck className="size-4 shrink-0" /> : isLow ? <ShieldAlert className="size-4 shrink-0" /> : <AlertCircle className="size-4 shrink-0" />}
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-black uppercase tracking-tighter text-inherit">Courier Score</span>
        <span className="text-[9px] font-bold opacity-80 whitespace-nowrap">{Math.floor(trust.successRate)}% Success ({trust.totalOrders} total)</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

/**
 * Order management table with workflow tabs, advanced filters, and contextual actions.
 * Tabs map to each stage of the order lifecycle; actions adapt to current status.
 */
export function OrdersTable() {
  const [search, setSearch] = React.useState("")
  const [activeTab, setActiveTab] = React.useState<string>("all")
  
  // Advanced Filters
  const [sortOrder, setSortOrder] = React.useState<"newest" | "oldest" | "amount_desc" | "amount_asc">("newest")
  const [paymentFilter, setPaymentFilter] = React.useState<string>("all")
  const [payStatusFilter, setPayStatusFilter] = React.useState<string>("all")

  // Filtering Logic
  const filteredOrders = React.useMemo(() => {
    return MOCK_ORDERS
      .filter(order => {
        const matchesSearch = 
          order.id.toLowerCase().includes(search.toLowerCase()) || 
          order.customer.toLowerCase().includes(search.toLowerCase()) ||
          order.phone.includes(search)
        
        const matchesTab = activeTab === "all" || order.status === activeTab
        const matchesPayment = paymentFilter === "all" || order.paymentMethod === paymentFilter
        const matchesPayStatus = payStatusFilter === "all" || order.paymentStatus === payStatusFilter

        return matchesSearch && matchesTab && matchesPayment && matchesPayStatus
      })
      .sort((a, b) => {
        if (sortOrder === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime()
        if (sortOrder === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime()
        if (sortOrder === "amount_desc") return b.total - a.total
        if (sortOrder === "amount_asc") return a.total - b.total
        return 0
      })
  }, [search, activeTab, sortOrder, paymentFilter, payStatusFilter])

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
                className="pl-11 h-12 w-[240px] md:w-[300px] rounded-xl border-gray-100 bg-white shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {/* Global Filters Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="outline" className="h-12 px-5 rounded-xl gap-2 font-bold border-gray-100 bg-white shadow-sm">
                  <Filter className="size-4" />
                  Filters
                </Button>
              } />
              <DropdownMenuContent align="end" className="w-64 p-3 rounded-[24px] shadow-2xl border-gray-100">
                <DropdownMenuLabel className="px-1 pb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort By</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setSortOrder("newest")} className="rounded-lg h-9 font-bold cursor-pointer justify-between">
                  Newest First {sortOrder === "newest" && <Check className="size-4 text-emerald-600" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("amount_desc")} className="rounded-lg h-9 font-bold cursor-pointer justify-between">
                  Highest Amount {sortOrder === "amount_desc" && <Check className="size-4 text-emerald-600" />}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="my-2" />
                
                <DropdownMenuLabel className="px-1 pb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Method</DropdownMenuLabel>
                {["all", "COD", "bKash", "Nagad", "Card"].map(m => (
                  <DropdownMenuItem key={m} onClick={() => setPaymentFilter(m)} className="rounded-lg h-9 font-bold cursor-pointer justify-between">
                    {m === "all" ? "All Methods" : m} {paymentFilter === m && <Check className="size-4 text-emerald-600" />}
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator className="my-2" />

                <DropdownMenuLabel className="px-1 pb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Status</DropdownMenuLabel>
                {["all", "paid", "unpaid"].map(s => (
                  <DropdownMenuItem key={s} onClick={() => setPayStatusFilter(s)} className="rounded-lg h-9 font-bold cursor-pointer justify-between capitalize">
                    {s === "all" ? "All Status" : s} {payStatusFilter === s && <Check className="size-4 text-emerald-600" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" className="h-12 px-5 rounded-xl gap-2 font-bold border-gray-100 bg-white shadow-sm hidden sm:flex">
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
                  "h-10 rounded-full border border-gray-100 bg-white px-5 text-[10px] font-black tracking-widest transition-all duration-200",
                  "data-selected:bg-primary data-selected:text-primary-foreground data-selected:border-primary data-selected:shadow-lg data-selected:shadow-primary/20"
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
                <th className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Order Details <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Courier Insights
                  </div>
                </th>
                <th className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Amount & Pay
                  </div>
                </th>
                <th className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Workflow
                  </div>
                </th>
                <th className="px-6 py-5 text-right whitespace-nowrap">
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
                          order.paymentStatus === "paid" ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20"
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
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl border border-transparent hover:border-gray-100 hover:bg-white flex items-center justify-center outline-none transition-all text-gray-400 hover:text-gray-900">
                              <MoreHorizontal className="size-5" />
                          </Button>
                        } />
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
                        <p className="text-lg font-black text-gray-900 uppercase">Empty Pipeline</p>
                        <p className="text-sm font-bold text-gray-400">No orders match your current filters.</p>
                      </div>
                      <Button 
                        variant="accent" 
                        onClick={() => {
                          setSearch(""); 
                          setActiveTab("all");
                          setPaymentFilter("all");
                          setPayStatusFilter("all");
                        }} 
                        className="rounded-full px-8 font-black uppercase tracking-widest shadow-xl shadow-orange-200"
                      >
                        Reset All Filters
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
            Showing <span className="text-gray-900">{filteredOrders.length}</span> results in current view
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-gray-100" disabled>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-10 px-5 rounded-xl border-primary/20 bg-primary/10 text-primary font-black">
              1
            </Button>
            <Button variant="outline" size="sm" className="h-10 px-5 rounded-xl border-gray-100 text-gray-500 font-bold hover:bg-gray-50">
              2
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
