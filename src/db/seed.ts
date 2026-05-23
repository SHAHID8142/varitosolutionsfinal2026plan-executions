/**
 * @file seed.ts
 * @description Development seed data for Varito Solutions.
 *              Run with: npx tsx src/db/seed.ts
 *              Only run against development/staging database — NOT production.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import { categories, products, users, banners, coupons, settings } from "./schema"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

const db = drizzle(neon(process.env.DATABASE_URL))

async function seed() {
  console.log("🌱 Seeding database...")

  // Categories
  console.log("  → Inserting categories...")
  const [sanitaryParent, packagingParent] = await db
    .insert(categories)
    .values([
      {
        name: "Sanitary Items",
        nameBn: "স্যানিটারি আইটেম",
        slug: "sanitary-items",
        sortOrder: 0,
      },
      {
        name: "Packaging Materials",
        nameBn: "প্যাকেজিং মেটেরিয়াল",
        slug: "packaging-materials",
        sortOrder: 1,
      },
    ])
    .returning({ id: categories.id })
    .onConflictDoNothing()

  if (sanitaryParent) {
    await db
      .insert(categories)
      .values([
        { name: "Luxury Sanitary", nameBn: "লাক্সারি স্যানিটারি", slug: "luxury-sanitary", parentId: sanitaryParent.id, sortOrder: 0 },
        { name: "Budget Sanitary", nameBn: "বাজেট স্যানিটারি", slug: "budget-sanitary", parentId: sanitaryParent.id, sortOrder: 1 },
        { name: "Bathroom Fittings", nameBn: "বাথরুম ফিটিংস", slug: "bathroom-fittings", parentId: sanitaryParent.id, sortOrder: 2 },
      ])
      .onConflictDoNothing()
  }

  if (packagingParent) {
    await db
      .insert(categories)
      .values([
        { name: "Corrugated Boxes", nameBn: "করগেটেড বাক্স", slug: "corrugated-boxes", parentId: packagingParent.id, sortOrder: 0 },
        { name: "Tape & Adhesives", nameBn: "টেপ ও আঠালো", slug: "tape-adhesives", parentId: packagingParent.id, sortOrder: 1 },
      ])
      .onConflictDoNothing()
  }

  // Products
  console.log("  → Inserting products...")
  const categoryId = sanitaryParent?.id ?? 1

  await db
    .insert(products)
    .values([
      {
        name: "Premium Ceramic Wall Tile 30x60",
        nameBn: "প্রিমিয়াম সিরামিক ওয়াল টাইল ৩০x৬০",
        slug: "premium-ceramic-wall-tile-30x60",
        description: "High-quality Italian ceramic wall tile. Perfect for bathroom and kitchen walls.",
        price: "1200",
        salePrice: "999",
        costPrice: "700",
        stock: 500,
        unit: "piece",
        minOrderQty: 10,
        sku: "VR-TILE-001",
        categoryId,
        images: ["https://placehold.co/800x800/png"],
        isActive: true,
        isFeatured: true,
      },
      {
        name: "Luxury Shower Panel Set",
        nameBn: "লাক্সারি শাওয়ার প্যানেল সেট",
        slug: "luxury-shower-panel-set",
        description: "Complete shower panel set with rainfall head, hand shower, and body jets.",
        price: "25000",
        salePrice: "22000",
        costPrice: "14000",
        stock: 25,
        unit: "set",
        minOrderQty: 1,
        sku: "VR-SHOW-001",
        categoryId,
        images: ["https://placehold.co/800x800/png"],
        isActive: true,
        isFeatured: true,
      },
      {
        name: "Standard PVC Pipe 1 inch",
        nameBn: "স্ট্যান্ডার্ড পিভিসি পাইপ ১ ইঞ্চি",
        slug: "standard-pvc-pipe-1-inch",
        description: "High-grade PVC pipe for water supply and drainage.",
        price: "180",
        costPrice: "120",
        stock: 1000,
        unit: "piece",
        minOrderQty: 5,
        sku: "VR-PIPE-001",
        categoryId,
        images: ["https://placehold.co/800x800/png"],
        isActive: true,
        isFeatured: false,
      },
      {
        name: "Budget Bathroom Faucet",
        nameBn: "বাজেট বাথরুম ফসেট",
        slug: "budget-bathroom-faucet",
        description: "Affordable chrome-plated brass faucet. Single-hole installation.",
        price: "850",
        salePrice: "750",
        costPrice: "500",
        stock: 150,
        unit: "piece",
        minOrderQty: 1,
        sku: "VR-FAUC-001",
        categoryId,
        images: ["https://placehold.co/800x800/png"],
        isActive: true,
        isFeatured: false,
      },
      {
        name: "Corrugated Box 30x20x15 cm",
        nameBn: "করগেটেড বাক্স ৩০x২০x১৫ সেমি",
        slug: "corrugated-box-30x20x15",
        description: "5-ply corrugated shipping box. Strong and lightweight for e-commerce packaging.",
        price: "45",
        costPrice: "28",
        stock: 5000,
        unit: "piece",
        minOrderQty: 50,
        sku: "VR-BOX-001",
        categoryId: packagingParent?.id ?? categoryId,
        images: ["https://placehold.co/800x800/png"],
        isActive: true,
        isFeatured: false,
      },
    ])
    .onConflictDoNothing()

  // Banners
  console.log("  → Inserting banners...")
  await db
    .insert(banners)
    .values([
      {
        title: "Premium Sanitary Items",
        subtitle: "Quality products for your home",
        image: "https://placehold.co/1920x600/png",
        ctaText: "Shop Now",
        ctaUrl: "/products?category=sanitary-items",
        position: "hero",
        sortOrder: 0,
        isActive: true,
      },
      {
        title: "Packaging Solutions",
        subtitle: "Best prices in Chattogram",
        image: "https://placehold.co/1920x600/png",
        ctaText: "Explore",
        ctaUrl: "/products?category=packaging-materials",
        position: "hero",
        sortOrder: 1,
        isActive: true,
      },
    ])
    .onConflictDoNothing()

  // Coupons
  console.log("  → Inserting coupons...")
  await db
    .insert(coupons)
    .values([
      {
        code: "WELCOME10",
        type: "percent",
        value: "10",
        maxDiscount: "500",
        minOrder: "1000",
        usageLimit: 500,
        isActive: true,
      },
      {
        code: "FLAT100",
        type: "fixed",
        value: "100",
        minOrder: "2000",
        isActive: true,
      },
    ])
    .onConflictDoNothing()

  // Settings
  console.log("  → Inserting settings...")
  const defaultSettings = [
    { key: "store_name", value: JSON.stringify("Varito Solutions") },
    { key: "store_phone", value: JSON.stringify("+8801XXXXXXXXX") },
    { key: "store_email", value: JSON.stringify("info@varito.com.bd") },
    { key: "store_address", value: JSON.stringify("Chattogram, Bangladesh") },
    { key: "delivery_charge", value: JSON.stringify(80) },
    { key: "cod_fee", value: JSON.stringify(40) },
    { key: "free_delivery_above", value: JSON.stringify(5000) },
    { key: "maintenance_mode", value: JSON.stringify(false) },
  ]

  for (const s of defaultSettings) {
    await db.insert(settings).values(s).onConflictDoNothing()
  }

  // Super admin user
  console.log("  → Inserting super admin user...")
  await db
    .insert(users)
    .values({
      supabaseId: "00000000-0000-0000-0000-000000000000",
      phone: "+8801700000000",
      name: "Super Admin",
      role: "super_admin",
    })
    .onConflictDoNothing()

  console.log("✅ Seed complete!")
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err)
  process.exit(1)
})
