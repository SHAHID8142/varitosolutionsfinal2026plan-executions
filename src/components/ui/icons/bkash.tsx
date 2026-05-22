/**
 * @file bkash.tsx
 * @description Custom SVG component for the bKash logo.
 *              Used in payment selection and footer.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import * as React from "react"

export function BkashIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
      <path d="M11 6h2v12h-2zm-4 4h2v8H7zm8 0h2v8h-2z" />
      {/* Simplified geometric representation for branding consistency */}
      <circle cx="12" cy="12" r="9" fill="#D12053" />
      <text x="12" y="15" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="sans-serif">bK</text>
    </svg>
  )
}
