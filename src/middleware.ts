/**
 * @file middleware.ts
 * @description Next.js middleware for admin route protection.
 *              Admin UI pages redirect unauthenticated users to /admin/login.
 *              Admin API routes return 401 JSON — auth is re-verified in each handler.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

// ─────────────────────────────────────────────
// ROUTE MATCHERS
// ─────────────────────────────────────────────

/** Admin UI pages that require a valid session */
const ADMIN_PAGES = "/admin"

/** Public admin routes that bypass auth */
const PUBLIC_ADMIN_ROUTES = ["/admin/login"]

function isPublic(pathname: string): boolean {
  return PUBLIC_ADMIN_ROUTES.some((p) => pathname.startsWith(p))
}

function isAdminPage(pathname: string): boolean {
  return pathname.startsWith(ADMIN_PAGES) && !pathname.startsWith("/api/admin")
}

// ─────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect admin UI pages — API routes handle their own auth
  if (!isAdminPage(pathname) || isPublic(pathname)) {
    return NextResponse.next()
  }

  // Check for Supabase auth token in cookies (set by client-side auth)
  const supabaseToken =
    request.cookies.get("sb-access-token")?.value ??
    request.cookies.get("supabase-auth-token")?.value

  if (!supabaseToken) {
    const loginUrl = new URL("/admin/login", request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verify token against Supabase
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("[middleware] Critical environment variables are missing! NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is undefined.")
      throw new Error("Missing Supabase configuration in environment variables.")
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data, error } = await supabase.auth.getUser(supabaseToken)
    if (error || !data.user) {
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("next", pathname)
      return NextResponse.redirect(loginUrl)
    }
  } catch (error) {
    console.error("[middleware] Verification error:", error)
    const loginUrl = new URL("/admin/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
