/**
 * @file announcement-bar.tsx
 * @description Persistent announcement banner shown at the very top of all pages.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import * as React from "react"

export function AnnouncementBar() {
  return (
    <div className="bg-emerald-950 text-white py-2.5 text-center text-xs font-bold tracking-wider relative z-[60]">
      🔥 Flash Sale: 20% OFF on all Packaging Materials! Use Code: <span className="text-emerald-400">VARITO20</span>
    </div>
  )
}
