/**
 * @file seed-admin.ts
 * @description One-time script to insert the admin user record into the database.
 *              Run ONCE with: npx tsx scripts/seed-admin.ts
 *              The Supabase user (varitosolutions26@gmail.com) must already exist.
 *
 * @owner    Antigravity Inspector
 * @updated  2026-05-24
 */

import { createClient } from "@supabase/supabase-js"
import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import { users } from "../src/db/schema"
import { eq } from "drizzle-orm"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

// ── Validate env ──────────────────────────────
const DATABASE_URL = process.env.DATABASE_URL!
const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const ADMIN_EMAIL = "varitosolutions26@gmail.com"

if (!DATABASE_URL || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing required env vars. Check your .env.local file.")
  process.exit(1)
}

// ── Clients ────────────────────────────────────
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const sql = neon(DATABASE_URL)
const db = drizzle(sql)

// ── Main ───────────────────────────────────────
async function main() {
  console.log(`🔍 Looking up Supabase user: ${ADMIN_EMAIL}`)

  // 1. Get the Supabase user ID by email
  const { data: supabaseList, error: listError } = await supabase.auth.admin.listUsers()
  if (listError) {
    console.error("❌ Failed to list Supabase users:", listError.message)
    process.exit(1)
  }

  const supaUser = supabaseList.users.find((u) => u.email === ADMIN_EMAIL)
  if (!supaUser) {
    console.error(`❌ No Supabase user found with email: ${ADMIN_EMAIL}`)
    console.error("   Make sure you have signed up on supabase.com with this email.")
    process.exit(1)
  }

  console.log(`✅ Found Supabase user: ${supaUser.id}`)

  // 2. Check if already in our DB
  const existing = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.supabaseId, supaUser.id))
    .limit(1)

  if (existing.length > 0) {
    console.log(`ℹ️  User already exists in DB with id: ${existing[0].id} and role: ${existing[0].role}`)
    
    // Ensure the role is super_admin
    if (existing[0].role !== "super_admin") {
      await db
        .update(users)
        .set({ role: "super_admin" })
        .where(eq(users.supabaseId, supaUser.id))
      console.log(`✅ Updated role to super_admin`)
    } else {
      console.log(`✅ Role is already super_admin — no changes needed.`)
    }
    return
  }

  // 3. Insert into our users table
  const [newUser] = await db
    .insert(users)
    .values({
      supabaseId: supaUser.id,
      phone: "01814214220", // Placeholder — update via admin panel later
      name: "Varito Admin",
      email: ADMIN_EMAIL,
      role: "super_admin",
    })
    .returning({ id: users.id })

  console.log(`✅ Admin user created in DB with id: ${newUser.id}`)
  console.log(`\n🎉 Done! You can now log in at http://localhost:3000/admin/login`)
  console.log(`   Email:    ${ADMIN_EMAIL}`)
  console.log(`   Password: (your Supabase password)`)
}

main().catch((err) => {
  console.error("❌ Script failed:", err)
  process.exit(1)
})
