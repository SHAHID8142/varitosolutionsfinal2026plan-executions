/**
 * @file messages-inbox.tsx
 * @description Admin messages inbox — two-panel layout with conversation list + thread view.
 *              Real-time updates via Supabase Realtime channel subscription.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { Search, Send, CheckCircle2, XCircle, RotateCcw } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface AdminConversation {
  id: number
  subject: string
  status: string
  unreadStaff: number
  unreadCustomer: number
  lastMessageAt: string
  orderId: number | null
  customerId: string
  customerName: string | null
  customerPhone: string
  latestMessage: string | null
  createdAt: string
}

interface Message {
  id: number
  conversationId: number
  senderId: string
  senderRole: string
  content: string
  isRead: boolean
  createdAt: string
}

interface ThreadDetail {
  conversation: AdminConversation
  messages: Message[]
}

type StatusTab = "all" | "open" | "resolved" | "closed"

// ─────────────────────────────────────────────
// SUPABASE CLIENT
// ─────────────────────────────────────────────

function getBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return null
  return createClient(url, anon)
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function formatTime(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()

  if (diff < 60_000) return "just now"
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
}

function statusColor(status: string) {
  switch (status) {
    case "open":
      return "bg-primary/10 text-primary"
    case "resolved":
      return "bg-green-100 text-green-700"
    case "closed":
      return "bg-gray-100 text-gray-500"
    default:
      return "bg-gray-100 text-gray-500"
  }
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

/**
 * Admin messages inbox with two-panel layout.
 * Left: filterable conversation list.
 * Right: active thread with reply box and real-time updates.
 */
export function MessagesInbox() {
  const [authToken, setAuthToken] = React.useState<string | null>(null)
  const [_adminUserId, setAdminUserId] = React.useState<string | null>(null)
  const [convos, setConvos] = React.useState<AdminConversation[]>([])
  const [activeThread, setActiveThread] = React.useState<ThreadDetail | null>(null)
  const [loadingList, setLoadingList] = React.useState(false)
  const [loadingThread, setLoadingThread] = React.useState(false)
  const [sending, setSending] = React.useState(false)
  const [replyInput, setReplyInput] = React.useState("")
  const [statusTab, setStatusTab] = React.useState<StatusTab>("all")
  const [search, setSearch] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const bottomRef = React.useRef<HTMLDivElement>(null)
  const supabase = React.useMemo(() => getBrowserClient(), [])

  // ── Debounce search input ────────────────────────────────────────────────
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  // ── Auth: get admin token ────────────────────────────────────────────────
  React.useEffect(() => {
    if (!supabase) return

    async function init() {
      const { data } = await supabase!.auth.getSession()
      if (data.session) {
        setAuthToken(data.session.access_token)
        setAdminUserId(data.session.user.id)
      }
    }

    init()

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthToken(session?.access_token ?? null)
      setAdminUserId(session?.user.id ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [supabase])

  // ── Fetch conversation list ──────────────────────────────────────────────
  const fetchConversations = React.useCallback(async () => {
    if (!authToken) return
    setLoadingList(true)
    try {
      const params = new URLSearchParams()
      if (statusTab !== "all") params.set("status", statusTab)
      if (debouncedSearch) params.set("search", debouncedSearch)

      const res = await fetch(`/api/admin/conversations?${params.toString()}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (res.ok) {
        const json = await res.json()
        setConvos(json.data ?? [])
      }
    } finally {
      setLoadingList(false)
    }
  }, [authToken, statusTab, debouncedSearch])

  React.useEffect(() => {
    if (!authToken) return
    // fetchConversations is async — setState calls happen after the await resolves, not inline
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchConversations()
  }, [authToken, statusTab, debouncedSearch, fetchConversations])

  // ── Realtime subscription for active thread ───────────────────────────────
  React.useEffect(() => {
    if (!supabase || !activeThread) return

    const channelName = `conversation-${activeThread.conversation.id}`
    const channel = supabase
      .channel(channelName)
      .on("broadcast", { event: "new-message" }, (payload) => {
        const incomingMessage = payload.payload?.message as Message | undefined
        if (!incomingMessage) return

        setActiveThread((prev) => {
          if (!prev) return prev
          const exists = prev.messages.some((m) => m.id === incomingMessage.id)
          if (exists) return prev
          return { ...prev, messages: [...prev.messages, incomingMessage] }
        })

        // Update unread counter in list
        setConvos((prev) =>
          prev.map((c) =>
            c.id === incomingMessage.conversationId
              ? { ...c, lastMessageAt: new Date().toISOString() }
              : c
          )
        )
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, activeThread?.conversation.id])

  // ── Auto-scroll to bottom on new messages ────────────────────────────────
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeThread?.messages.length])

  // ── Open thread ──────────────────────────────────────────────────────────
  async function openThread(convo: AdminConversation) {
    if (!authToken) return
    setLoadingThread(true)
    setReplyInput("")

    try {
      const res = await fetch(`/api/conversations/${convo.id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (res.ok) {
        const json = await res.json()
        setActiveThread({
          conversation: convo,
          messages: json.data.messages ?? [],
        })
        // Reset unreadStaff in local list
        setConvos((prev) =>
          prev.map((c) => (c.id === convo.id ? { ...c, unreadStaff: 0 } : c))
        )
      }
    } finally {
      setLoadingThread(false)
    }
  }

  // ── Send reply ───────────────────────────────────────────────────────────
  async function sendReply() {
    if (!authToken || !activeThread || !replyInput.trim()) return
    setSending(true)

    try {
      const res = await fetch(
        `/api/conversations/${activeThread.conversation.id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ content: replyInput.trim() }),
        }
      )
      if (res.ok) {
        const json = await res.json()
        setActiveThread((prev) => {
          if (!prev) return prev
          return { ...prev, messages: [...prev.messages, json.data] }
        })
        setReplyInput("")
      }
    } finally {
      setSending(false)
    }
  }

  // ── Update conversation status ────────────────────────────────────────────
  async function updateStatus(status: "open" | "resolved" | "closed") {
    if (!authToken || !activeThread) return

    const res = await fetch(
      `/api/admin/conversations/${activeThread.conversation.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status }),
      }
    )

    if (res.ok) {
      setActiveThread((prev) => {
        if (!prev) return prev
        return { ...prev, conversation: { ...prev.conversation, status } }
      })
      setConvos((prev) =>
        prev.map((c) =>
          c.id === activeThread.conversation.id ? { ...c, status } : c
        )
      )
    }
  }

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  return (
    <div className="flex h-[calc(100vh-200px)] min-h-96 rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm">
      {/* ── Left panel: conversation list ── */}
      <div className="w-1/3 min-w-64 border-r border-gray-100 flex flex-col">
        {/* Search */}
        <div className="p-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              id="messages-search"
              placeholder="Search customer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
            <label htmlFor="messages-search" className="sr-only">
              Search conversations
            </label>
          </div>
        </div>

        {/* Status tabs */}
        <div className="px-3 pt-2 pb-0 border-b border-gray-100">
          <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as StatusTab)}>
            <TabsList className="w-full h-8 bg-gray-100 p-0.5">
              {(["all", "open", "resolved", "closed"] as const).map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="flex-1 text-[10px] font-black capitalize data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loadingList && (
            <p className="text-center text-xs text-gray-400 mt-6">Loading…</p>
          )}
          {!loadingList && convos.length === 0 && (
            <p className="text-center text-xs text-gray-400 mt-6">No conversations</p>
          )}
          {convos.map((c) => {
            const isActive = activeThread?.conversation.id === c.id
            return (
              <button
                key={c.id}
                onClick={() => openThread(c)}
                className={cn(
                  "w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors",
                  isActive && "bg-primary/5 border-l-2 border-l-primary"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-sm font-black text-gray-900 truncate">
                    {c.customerName ?? c.customerPhone}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    {c.unreadStaff > 0 && (
                      <span className="size-4 rounded-full bg-accent text-white text-[9px] font-black flex items-center justify-center">
                        {c.unreadStaff}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-400">{formatTime(c.lastMessageAt)}</span>
                  </div>
                </div>
                <p className="text-xs font-bold text-gray-600 truncate">{c.subject}</p>
                {c.latestMessage && (
                  <p className="text-xs text-gray-400 truncate mt-0.5">{c.latestMessage}</p>
                )}
                <div className="flex items-center gap-1 mt-1">
                  <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-black", statusColor(c.status))}>
                    {c.status}
                  </span>
                  {c.orderId && (
                    <span className="text-[9px] text-primary font-bold">#{c.orderId}</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Right panel: thread view ── */}
      <div className="flex-1 flex flex-col">
        {!activeThread && (
          <div className="flex-1 flex items-center justify-center text-center px-8">
            <div className="flex flex-col items-center gap-3">
              <div className="size-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                <Search className="size-8 text-gray-300" />
              </div>
              <p className="text-sm font-bold text-gray-400">
                Select a conversation to view the thread
              </p>
            </div>
          </div>
        )}

        {activeThread && (
          <>
            {/* Thread header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 shrink-0">
              <div className="flex flex-col">
                <p className="text-sm font-black text-gray-900">
                  {activeThread.conversation.customerName ?? activeThread.conversation.customerPhone}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400">{activeThread.conversation.customerPhone}</span>
                  {activeThread.conversation.orderId && (
                    <Link
                      href={`/admin/orders?id=${activeThread.conversation.orderId}`}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Order #{activeThread.conversation.orderId}
                    </Link>
                  )}
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-black", statusColor(activeThread.conversation.status))}>
                    {activeThread.conversation.status}
                  </span>
                </div>
              </div>

              {/* Status actions */}
              <div className="flex items-center gap-2 shrink-0">
                {activeThread.conversation.status !== "resolved" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1.5 text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => updateStatus("resolved")}
                  >
                    <CheckCircle2 className="size-3.5" />
                    Resolve
                  </Button>
                )}
                {activeThread.conversation.status === "closed" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1.5"
                    onClick={() => updateStatus("open")}
                  >
                    <RotateCcw className="size-3.5" />
                    Reopen
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1.5 text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => updateStatus("closed")}
                  >
                    <XCircle className="size-3.5" />
                    Close
                  </Button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
              {loadingThread && (
                <p className="text-center text-xs text-gray-400 mt-6">Loading messages…</p>
              )}
              {activeThread.messages.map((msg) => {
                const isStaffMessage = msg.senderRole === "staff"
                return (
                  <div
                    key={msg.id}
                    className={cn("flex", isStaffMessage ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm",
                        isStaffMessage
                          ? "bg-primary text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-900 rounded-bl-sm"
                      )}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      <p
                        className={cn(
                          "text-[10px] mt-1",
                          isStaffMessage ? "text-white/70 text-right" : "text-gray-400"
                        )}
                      >
                        {isStaffMessage ? "You" : activeThread.conversation.customerName ?? "Customer"} · {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            {/* Reply box */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-end gap-3 shrink-0">
              <textarea
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-12 max-h-32"
                placeholder="Type your reply…"
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    sendReply()
                  }
                }}
                maxLength={5000}
                aria-label="Reply input"
              />
              <Button
                size="icon"
                disabled={sending || !replyInput.trim()}
                onClick={sendReply}
                className="size-10 rounded-xl bg-primary text-white hover:bg-primary/90 shrink-0"
                aria-label="Send reply"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
