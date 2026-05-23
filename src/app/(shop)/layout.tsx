/**
 * @file layout.tsx
 * @path /src/app/(shop)/layout.tsx
 * @description Layout wrapper for all customer-facing shop pages.
 *              Includes the persistent AnnouncementBar.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import * as React from "react"
import { AnnouncementBar } from "@/components/layout/announcement-bar"
import { ChatWidget } from "@/components/shop/chat-widget"

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AnnouncementBar />
      {children}
      <ChatWidget />
    </>
  )
}
