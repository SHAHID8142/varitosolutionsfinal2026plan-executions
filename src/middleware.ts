/**
 * @file middleware.ts
 * @description Next.js edge middleware for RBAC route protection.
 *              Protects /admin routes by verifying Supabase JWT.
 *              Admin role is re-checked server-side in each API route handler —
 *              middleware only gates access, not permission level.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

// ─────────────────────────────────────────────
// ROUTE MATCHERS
// ─────────────────────────────────────────────

/** Admin UI pages that require a valid Supabase session */
const PROTECTED_ADMIN_PAGES = ["/admin"]

/** Admin API routes that require a valid Supabase session */
const PROTECTED_ADMIN_API = ["/api/admin"]

/** Public routes that bypass all auth checks */
const PUBLIC_ROUTES = [
  "/admin/login",
  "/api/products",
  "/api/categories",
  "/api/auth",
  "/api/payment/webhook",
]

function isProtected(pathname: string): boolean {
  if (PUBLIC_ROUTES.some((p) => pathname.startsWith(p))) return false
  return (
    PROTECTED_ADMIN_PAGES.some((p) => pathname.startsWith(p)) ||
    PROTECTED_ADMIN_API.some((p) => pathname.startsWith(p))
  )
}

// ─────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!isProtected(pathname)) {
    return NextResponse.next()
  }

  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // API routes return 401 JSON; pages redirect to login
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Authentication required", code: "UNAUTHENTICATED" },
        { status: 401 }
      )
    }

    const loginUrl = new URL("/admin/login", request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all paths except static files and Next.js internals.
     * This middleware only acts on admin routes — all other paths
     * pass through immediately via the isProtected() check above.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
