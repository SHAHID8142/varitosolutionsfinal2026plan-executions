/**
 * @file shipping-label-printable.tsx
 * @description Thermal-sized (4x6 inch) printable shipping label for couriers.
 *              Includes barcode, order ID, customer info, and COD amount.
 *              Optimized for high-contrast black & white printing.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import * as React from "react"
import { QrCode } from "lucide-react"

interface ShippingLabelPrintableProps {
  order: {
    id: string
    total: number
    paymentMethod: string
    customer: {
      name: string
      phone: string
      address: string
    }
  }
}

export function ShippingLabelPrintable({ order }: ShippingLabelPrintableProps) {
  const isCod = order.paymentMethod.toLowerCase().includes("cod")

  return (
    <div className="bg-white w-[100mm] h-[150mm] mx-auto text-black font-sans print:w-full print:h-screen print:p-0 shadow-lg border-2 border-black p-4 flex flex-col gap-4 overflow-hidden">
      
      {/* Label Header */}
      <div className="flex justify-between items-center border-b-4 border-black pb-2">
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tighter">VARITO</span>
          <span className="text-[8px] font-bold tracking-[0.2em] uppercase">Solutions</span>
        </div>
        <div className="text-right flex flex-col">
          <span className="text-xs font-black uppercase tracking-widest">Courier Copy</span>
          <span className="text-[10px] font-bold">Ref: {order.id}</span>
        </div>
      </div>

      {/* Barcode Placeholder */}
      <div className="flex flex-col items-center gap-2 border-b-2 border-black pb-4">
        <div className="w-full h-24 bg-black flex flex-col items-center justify-center text-white gap-2">
          {/* In a real app, this would be a Barcode component */}
          <div className="flex gap-1 w-full px-8 h-12 overflow-hidden">
            {[...Array(40)].map((_, i) => (
              <div key={i} className="bg-white h-full" style={{ width: `${(i % 4) + 1}px` }} />
            ))}
          </div>
          <span className="text-sm font-mono font-bold tracking-[0.5em]">{order.id}</span>
        </div>
      </div>

      {/* Recipient Info */}
      <div className="flex flex-col gap-2 flex-1">
        <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2 py-1 w-fit">To: Recipient</span>
        <div className="flex flex-col px-1">
          <span className="text-xl font-black uppercase">{order.customer.name}</span>
          <span className="text-sm font-bold mt-1 leading-tight">{order.customer.address}</span>
          <span className="text-2xl font-black mt-4 border-2 border-black px-4 py-2 text-center">
            {order.customer.phone}
          </span>
        </div>
      </div>

      {/* COD Info */}
      <div className="border-t-4 border-black pt-4 mt-auto">
        <div className="flex items-stretch justify-between gap-4 h-32">
          <div className="flex-1 border-2 border-black p-2 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-black uppercase tracking-widest mb-1">COD Amount</span>
            <span className="text-3xl font-black">
              {isCod ? `৳${order.total.toLocaleString()}` : "৳0"}
            </span>
            <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Collect Cash</span>
          </div>
          <div className="size-32 border-2 border-black p-2 flex items-center justify-center shrink-0">
            {/* In a real app, this would be a dynamic QR code for tracking */}
            <QrCode className="size-24" />
          </div>
        </div>
      </div>

      {/* Sender Info (Small) */}
      <div className="text-[8px] font-bold border-t border-black pt-2 flex justify-between uppercase">
        <span>From: Varito Solutions (+8801814214220)</span>
        <span>CTG, Bangladesh</span>
      </div>

    </div>
  )
}
