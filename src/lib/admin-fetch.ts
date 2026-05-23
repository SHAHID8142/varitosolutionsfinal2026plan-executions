/**
 * @file admin-fetch.ts
 * @description Client-side helper for making authenticated requests to admin API routes.
 *              Reads the Supabase access token from the `sb-access-token` cookie set at login.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-24
 */

/** Returns the admin Bearer token from cookies, or null if not logged in. */
export function getAdminToken(): string | null {
  if (typeof document === "undefined") return null
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("sb-access-token="))
      ?.split("=")[1] ?? null
  )
}

/** Builds headers with Authorization: Bearer for admin API calls. */
export function adminHeaders(extra?: Record<string, string>): Record<string, string> {
  const token = getAdminToken()
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  }
}

/**
 * Wrapper around fetch for admin API routes.
 * Automatically injects the Authorization header.
 * Returns { data, error, status }.
 */
export async function adminFetch<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null; status: number }> {
  const token = getAdminToken()
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined),
  }

  const res = await fetch(url, { ...options, headers })
  const json = await res.json().catch(() => ({}))

  if (!res.ok) {
    return { data: null, error: json.error ?? `HTTP ${res.status}`, status: res.status }
  }

  return { data: json.data ?? json, error: null, status: res.status }
}
