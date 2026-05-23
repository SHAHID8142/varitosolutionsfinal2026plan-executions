/**
 * @file realtime.ts
 * @description Server-side Supabase admin client for broadcasting real-time messages
 *              to conversation channels. Called from API routes after DB inserts.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

import { createClient } from "@supabase/supabase-js"

// ─────────────────────────────────────────────
// CLIENT
// ─────────────────────────────────────────────

/**
 * Creates a Supabase admin client for server-side broadcast operations.
 * We create lazily to avoid issues in edge environments.
 */
function getRealtimeClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    realtime: { params: { eventsPerSecond: 10 } },
  })
}

// ─────────────────────────────────────────────
// BROADCAST
// ─────────────────────────────────────────────

/**
 * Broadcast a new message to all subscribers of a conversation channel.
 * Called from API routes after inserting a message into the DB.
 *
 * @param conversationId - The numeric conversation ID
 * @param payload - The message payload to broadcast (serializable object)
 */
export async function broadcastMessage(
  conversationId: number,
  payload: object
): Promise<void> {
  try {
    const supabase = getRealtimeClient()
    const channel = supabase.channel(`conversation-${conversationId}`)

    await channel.send({
      type: "broadcast",
      event: "new-message",
      payload,
    })

    // Unsubscribe immediately — this is a fire-and-forget server broadcast
    await supabase.removeChannel(channel)
  } catch {
    // Non-fatal: real-time broadcast failure should not break the API response.
    // The client will refetch on next poll if broadcast is missed.
  }
}
