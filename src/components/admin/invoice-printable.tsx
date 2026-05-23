/**
 * @file invoice-printable.tsx
 * @description A4-sized printable invoice component for customers.
 *              Includes order details, customer info, and business branding.
 *              Designed with @media print in mind for perfect paper output.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import * as React from "react"
import { Package2 } from "lucide-react"

interface InvoicePrintableProps {
  order: {
    id: string
    date: string
    paymentMethod: string
    subtotal: number
    shipping: number
    codFee: number
    total: number
    customer: {
      name: string
      phone: string
      address: string
    }
    items: Array<{
      name: string
      sku: string
      price: number
      quantity: number
      total: number
    }>
  }
}

export function InvoicePrintable({ order }: InvoicePrintableProps) {
  return (
    <div className="bg-white p-12 w-[210mm] min-h-[297mm] mx-auto text-gray-900 font-sans print:p-8 print:w-full print:shadow-none shadow-lg border border-gray-100">
      
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-primary pb-8 mb-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-xl bg-primary flex items-center justify-center text-white">
              <Package2 className="size-8" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black tracking-tighter">VARITO</span>
              <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">Solutions</span>
            </div>
          </div>
          <div className="text-xs font-medium text-gray-500 max-w-xs leading-relaxed">
            123 Market Road, Khatunganj, Chattogram, Bangladesh<br />
            Phone: +880 1814-214220 | Email: info@varitosolutions.com
          </div>
        </div>
        
        <div className="flex flex-col items-end text-right gap-2">
          <h1 className="text-4xl font-black text-primary uppercase tracking-tight">INVOICE</h1>
          <div className="flex flex-col">
            <span className="text-sm font-black text-gray-900">#{order.id}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{order.date}</span>
          </div>
        </div>
      </div>

      {/* Bill To / Ship To */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-black text-primary uppercase tracking-widest border-b border-primary/20 pb-1 w-fit">Bill To / Ship To</span>
          <div className="flex flex-col">
            <span className="text-lg font-black text-gray-900">{order.customer.name}</span>
            <span className="text-sm font-medium text-gray-600 mt-1">{order.customer.address}</span>
            <span className="text-sm font-black text-gray-900 mt-2">{order.customer.phone}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 items-end text-right">
          <span className="text-xs font-black text-primary uppercase tracking-widest border-b border-primary/20 pb-1 w-fit">Payment Info</span>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-gray-900">{order.paymentMethod}</span>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status: Unpaid (COD)</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-12">
        <thead>
          <tr className="bg-gray-50 text-left border-y border-gray-100">
            <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
            <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Price</th>
            <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Qty</th>
            <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {order.items.map((item, i) => (
            <tr key={i}>
              <td className="px-4 py-5">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-gray-900">{item.name}</span>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{item.sku}</span>
                </div>
              </td>
              <td className="px-4 py-5 text-sm font-bold text-gray-600 text-right">৳{item.price.toLocaleString()}</td>
              <td className="px-4 py-5 text-sm font-bold text-gray-600 text-center">{item.quantity}</td>
              <td className="px-4 py-5 text-sm font-black text-gray-900 text-right">৳{item.total.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div className="flex justify-end mb-12">
        <div className="w-64 flex flex-col gap-3">
          <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-wider">
            <span>Subtotal</span>
            <span>৳{order.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-wider">
            <span>Shipping</span>
            <span>৳{order.shipping.toLocaleString()}</span>
          </div>
          {order.codFee > 0 && (
            <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-wider">
              <span>COD Charge</span>
              <span>৳{order.codFee.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-2xl font-black text-primary uppercase tracking-tight border-t-2 border-primary pt-3 mt-2">
            <span>Total</span>
            <span>৳{order.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Footer / Thank You */}
      <div className="mt-auto pt-12 border-t border-gray-100 flex flex-col items-center gap-4 text-center">
        <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Thank you for your business!</p>
        <p className="text-xs font-medium text-gray-400 max-w-md">
          Please check the products upon delivery. If you find any issues, contact our support within 7 days.
          Keep this invoice for warranty claims.
        </p>
        <div className="mt-8 flex gap-8 opacity-30 grayscale scale-75">
          {/* Logo placeholders for courier partners */}
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

    </div>
  )
}
