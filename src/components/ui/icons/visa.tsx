/**
 * @file visa.tsx
 * @description Custom SVG component for the Visa/Card logo.
 *              Used in payment selection and footer.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import * as React from "react"

export function VisaIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" rx="4" fill="#1A1F71" />
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="black" fontFamily="sans-serif">VISA</text>
    </svg>
  )
}
