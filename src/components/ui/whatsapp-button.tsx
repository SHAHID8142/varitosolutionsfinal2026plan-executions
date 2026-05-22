/**
 * @file whatsapp-button.tsx
 * @description Floating WhatsApp button for quick customer support.
 *              Fixed to the bottom-right corner of the viewport.
 *
 * @example
 * <WhatsAppButton phoneNumber="8801700000000" message="Hello, I have a question!" />
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { WhatsAppIcon } from "@/components/ui/icons/whatsapp"

interface WhatsAppButtonProps {
  phoneNumber?: string
  message?: string
  className?: string
}

export function WhatsAppButton({
  phoneNumber = "8801814214220", // Default business number
  message = "Hello Varito Solutions! I want to know more about your products.",
  className,
}: WhatsAppButtonProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-20 right-4 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 active:scale-95 md:bottom-6 md:right-6",
        className
      )}
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon className="size-8" />
      
      {/* Pulse effect to attract attention */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-20 animate-ping -z-10" />
    </a>
  )
}
