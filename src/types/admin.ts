/**
 * @file admin.ts
 * @description Shared TypeScript types for the admin panel.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-22
 */

import type { ElementType } from "react"

/** A single navigation entry in the admin sidebar. */
export interface SidebarItem {
  label: string
  href: string
  icon: ElementType
  superAdminOnly?: boolean
}
