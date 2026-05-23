/**
 * @file page.tsx
 * @path /admin/messages
 * @description Admin Messages inbox page.
 *              Server component — renders the MessagesInbox client component.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { MessagesInbox } from "@/components/admin/messages-inbox"

/** Admin Messages inbox — view and reply to all customer conversations. */
export default function AdminMessagesPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500">
          View and respond to customer support conversations.
        </p>
      </div>

      {/* Inbox */}
      <MessagesInbox />
    </div>
  )
}
