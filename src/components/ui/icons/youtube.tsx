/**
 * @file youtube.tsx
 * @description Custom SVG component for the YouTube logo.
 * Used in the footer and social share components.
 *
 * @owner Gemini Design Agent
 * @updated 2026-05-22
 */

import * as React from "react"

export function YoutubeIcon({ className }: { className?: string }) {
 return (
 <svg
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 className={className}
 xmlns="http://www.w3.org/2000/svg"
 >
 <path d="M22.54 6.42 a2.78 2.78 0 0 0 -1.94 -2 C18.88 4 12 4 12 4 s -6.88 0 -8.6.42 a2.78 2.78 0 0 0 -1.94 2 C1 8.14 1 12 1 12 s0 3.86.42 5.58 a2.78 2.78 0 0 0 1.94 2 c1.71.42 8.6.42 8.6.42 s6.88 0 8.6 -0.42 a2.78 2.78 0 0 0 1.94 -2 C23 15.86 23 12 23 12 s0 -3.86 -0.42 -5.58 z" />
 <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
 </svg>
 )
}
