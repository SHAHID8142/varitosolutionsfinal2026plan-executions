/**
 * @file page.tsx
 * @path /account
 * @description Root account page. Redirects users to their profile.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import { redirect } from "next/navigation"

export default function AccountPage() {
  redirect("/account/profile")
}
