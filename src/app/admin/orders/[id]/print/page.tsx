/**
 * @file page.tsx
 * @path /admin/orders/[id]/print
 * @description Print-optimized page for generating invoices and shipping labels.
 *              Stripped of all UI elements except the printable content.
 *              Supports toggling between Invoice (A4) and Shipping Label (Thermal).
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

"use client"

import * as React from "react"
import { Printer, FileText, Tag, ArrowLeft } from "lucide-react"
import { InvoicePrintable } from "@/components/admin/invoice-printable"
import { ShippingLabelPrintable } from "@/components/admin/shipping-label-printable"
import { Button } from "@/components/ui/button"

// ─────────────────────────────────────────────
// MOCK DATA (Synced with detail page)
// ─────────────────────────────────────────────

const ORDER = {
  id: "VR-2026-0001",
  date: "May 22, 2026",
  paymentMethod: "Cash on Delivery (COD)",
  subtotal: 12450,
  shipping: 120,
  codFee: 40,
  total: 12610,
  customer: {
    name: "Karim Ahmed",
    phone: "01711122233",
    address: "House 12, Road 4, Sector 7, Uttara, Dhaka-1230",
  },
  items: [
    { name: "Luxury Emerald Gold Faucet - Dual Handle Bathroom Mixer", sku: "VR-SAN-001", price: 3800, quantity: 3, total: 11400 },
    { name: "Heavy Duty Packaging Tape (6 Pack)", sku: "VR-PKG-005", price: 720, quantity: 1, total: 720 },
    { name: "Bubble Wrap (10 Meter Roll)", sku: "VR-PKG-012", price: 330, quantity: 1, total: 330 }
  ]
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function OrderPrintPage() {
  const [view, setView] = React.useState<"invoice" | "label">("invoice")

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-100/50 print:bg-white flex flex-col items-center">
      
      {/* Floating Controls (Hidden on Print) */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 rounded-[24px] bg-white border border-gray-100 shadow-2xl print:hidden animate-in fade-in slide-in-from-top-4 duration-500">
        <Button 
          variant="ghost" 
          size="sm" 
          className="rounded-xl h-10 px-4 gap-2 font-bold text-gray-500 hover:text-emerald-600"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="size-4" /> Exit
        </Button>
        
        <div className="w-px h-6 bg-gray-100 mx-1" />
        
        <Button 
          variant={view === "invoice" ? "secondary" : "ghost"}
          size="sm" 
          className={view === "invoice" ? "bg-emerald-50 text-emerald-700 font-black rounded-xl h-10 px-6 gap-2" : "rounded-xl h-10 px-6 gap-2 font-bold text-gray-500"}
          onClick={() => setView("invoice")}
        >
          <FileText className="size-4" /> A4 Invoice
        </Button>
        <Button 
          variant={view === "label" ? "secondary" : "ghost"}
          size="sm" 
          className={view === "label" ? "bg-emerald-50 text-emerald-700 font-black rounded-xl h-10 px-6 gap-2" : "rounded-xl h-10 px-6 gap-2 font-bold text-gray-500"}
          onClick={() => setView("label")}
        >
          <Tag className="size-4" /> Thermal Label
        </Button>
        
        <div className="w-px h-6 bg-gray-100 mx-1" />

        <Button 
          onClick={handlePrint}
          size="sm" 
          className="rounded-xl h-10 px-6 gap-2 font-black shadow-lg shadow-emerald-500/20"
        >
          <Printer className="size-4" /> Print Document
        </Button>
      </div>

      {/* Main Print Area */}
      <main className="py-24 print:p-0">
        {view === "invoice" ? (
          <InvoicePrintable order={ORDER} />
        ) : (
          <ShippingLabelPrintable order={ORDER} />
        )}
      </main>

    </div>
  )
}
