/**
 * @file api/admin/orders/export/route.ts
 * @description Admin (super_admin): export orders as CSV for a date range.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { orders } from "@/db/schema"
import { and, desc, gte, lte } from "drizzle-orm"
import { requireAdmin, isAuthError } from "@/lib/admin-auth"

const querySchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

function escapeCSV(value: string | number | null | undefined): string {
  const str = String(value ?? "")
  return str.includes(",") || str.includes('"') || str.includes("\n")
    ? `"${str.replace(/"/g, '""')}"`
    : str
}

export async function GET(request: Request) {
  const admin = await requireAdmin(request, { role: "super_admin" })
  if (isAuthError(admin)) return admin

  const url = new URL(request.url)
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams))
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid parameters", code: "VALIDATION_ERROR" }, { status: 400 })
  }

  const conditions = []
  if (parsed.data.dateFrom) {
    const from = new Date(parsed.data.dateFrom)
    if (!isNaN(from.getTime())) conditions.push(gte(orders.createdAt, from))
  }
  if (parsed.data.dateTo) {
    const to = new Date(parsed.data.dateTo)
    if (!isNaN(to.getTime())) conditions.push(lte(orders.createdAt, to))
  }

  const rows = await db
    .select({
      orderNumber: orders.orderNumber,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      paymentMethod: orders.paymentMethod,
      total: orders.total,
      customerName: orders.customerName,
      customerPhone: orders.customerPhone,
      addressDistrict: orders.addressDistrict,
      addressThana: orders.addressThana,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(orders.createdAt))
    .limit(10000)

  const headers = [
    "Order Number", "Status", "Payment Status", "Payment Method",
    "Total (BDT)", "Customer Name", "Phone", "District", "Thana", "Created At",
  ]

  const csvRows = [
    headers.join(","),
    ...rows.map((r) =>
      [r.orderNumber, r.status, r.paymentStatus, r.paymentMethod, r.total,
       r.customerName, r.customerPhone, r.addressDistrict, r.addressThana,
       r.createdAt.toISOString()]
        .map(escapeCSV)
        .join(",")
    ),
  ]

  const date = new Date().toISOString().split("T")[0]
  return new NextResponse(csvRows.join("\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="orders-${date}.csv"`,
    },
  })
}
