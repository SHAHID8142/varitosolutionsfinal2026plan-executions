/**
 * @file announcement-bar.tsx
 * @description Persistent announcement banner shown at the very top of all pages.
 *              Uses primary color tokens for brand consistency.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

import * as React from "react"

/**
 * Top-of-page announcement bar for promotional messages.
 * Uses bg-primary (emerald) for brand consistency instead of arbitrary dark shade.
 */
export function AnnouncementBar() {
  return (
    <div className="bg-primary text-primary-foreground py-2.5 text-center text-xs font-bold tracking-wider relative z-[60]">
      Flash Sale: 20% OFF on all Packaging Materials! Use Code:{" "}
      <span className="font-black underline underline-offset-2">VARITO20</span>
    </div>
  )
}
