/**
 * @file whatsapp-button.tsx
 * @description Floating WhatsApp button for quick customer support.
 *              Fixed to the bottom-right corner of the viewport.
 *              Touch target is 56×56px (size-14) — exceeds 44px minimum.
 *              Uses CSS variable for WhatsApp brand green to avoid hardcoded hex.
 *
 * @example
 * <WhatsAppButton phoneNumber="8801700000000" message="Hello, I have a question!" />
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { WhatsAppIcon } from "@/components/ui/icons/whatsapp"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface WhatsAppButtonProps {
  phoneNumber?: string
  message?: string
  className?: string
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

/**
 * Persistent floating WhatsApp CTA button.
 * Positioned bottom-right; clears mobile bottom-nav (bottom-20 on mobile).
 * WhatsApp green uses a Tailwind arbitrary value defined at component boundary
 * to keep it maintainable without hardcoding raw hex in className props.
 */
export function WhatsAppButton({
  phoneNumber = "8801814214220", // Default Varito business number
  message = "Hello Varito Solutions! I want to know more about your products.",
  className,
}: WhatsAppButtonProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      // whatsapp-green is defined as a Tailwind color token in tailwind.config
      // Fallback inline style used only for the brand-mandated WhatsApp green
      // (not a design-system color — WhatsApp brand color is fixed by WhatsApp)
      className={cn(
        "fixed bottom-20 right-4 z-40 flex size-14 items-center justify-center rounded-full text-white shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 md:bottom-6 md:right-6",
        "bg-[color:var(--color-whatsapp,#25D366)]",
        className
      )}
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon className="size-8" />

      {/* Pulse ring to draw attention — brand green matches button */}
      <span
        className="absolute inset-0 rounded-full opacity-20 animate-ping -z-10 bg-[color:var(--color-whatsapp,#25D366)]"
        aria-hidden="true"
      />
    </a>
  )
}
