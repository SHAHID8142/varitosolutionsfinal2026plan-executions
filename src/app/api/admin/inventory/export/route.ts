/**
 * @file api/admin/inventory/export/route.ts
 * @description Admin (super_admin): export current inventory as CSV.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { products, categories } from "@/db/schema"
import { asc, eq, isNull } from "drizzle-orm"
import { requireAdmin, isAuthError } from "@/lib/admin-auth"

function escapeCSV(value: string | number | null | undefined): string {
  const str = String(value ?? "")
  return str.includes(",") || str.includes('"') || str.includes("\n")
    ? `"${str.replace(/"/g, '""')}"`
    : str
}

export async function GET(request: Request) {
  const admin = await requireAdmin(request, { role: "super_admin" })
  if (isAuthError(admin)) return admin

  const rows = await db
    .select({
      name: products.name,
      sku: products.sku,
      stock: products.stock,
      price: products.price,
      categoryName: categories.name,
      isActive: products.isActive,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(isNull(products.deletedAt))
    .orderBy(asc(products.name))

  const headers = ["Product Name", "SKU", "Stock", "Price (BDT)", "Category", "Active"]
  const csvRows = [
    headers.join(","),
    ...rows.map((r) =>
      [r.name, r.sku, r.stock, r.price, r.categoryName, r.isActive ? "Yes" : "No"]
        .map(escapeCSV)
        .join(",")
    ),
  ]

  const date = new Date().toISOString().split("T")[0]
  return new NextResponse(csvRows.join("\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="inventory-${date}.csv"`,
    },
  })
}
