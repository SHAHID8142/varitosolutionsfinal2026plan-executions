/**
 * @file nagad.tsx
 * @description Custom SVG component for the Nagad logo.
 *              Used in payment selection and footer.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import * as React from "react"

export function NagadIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" fill="#E61E26" />
      <text x="12" y="15" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="sans-serif">N</text>
      <path d="M4 12h16" stroke="white" strokeWidth="1.5" />
    </svg>
  )
}
