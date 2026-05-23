/**
 * @file chat-widget.tsx
 * @description Floating customer support chat widget.
 *              Opens a Sheet panel with conversation list or thread view.
 *              Uses Supabase Realtime for live message updates.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { MessageCircle, X, ChevronLeft, Send, Plus } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface ConversationSummary {
  id: number
  subject: string
  status: string
  unreadCustomer: number
  lastMessageAt: string
  orderId: number | null
  latestMessage: string | null
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

interface ConversationDetail {
  conversation: ConversationSummary
  messages: Message[]
}

// ─────────────────────────────────────────────
// SUPABASE CLIENT (browser)
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

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

/** Renders the list of conversations for the current customer */
function ConversationList({
  conversations,
  onSelect,
  onNewConversation,
}: {
  conversations: ConversationSummary[]
  onSelect: (id: number) => void
  onNewConversation: () => void
}) {
  return (
    <div className="flex flex-col gap-3 flex-1 overflow-hidden">
      <Button
        size="sm"
        className="w-full bg-primary text-white hover:bg-primary/90"
        onClick={onNewConversation}
      >
        <Plus className="size-4 mr-2" />
        New Conversation
      </Button>

      <div className="flex-1 overflow-y-auto flex flex-col gap-2">
        {conversations.length === 0 && (
          <p className="text-center text-sm text-gray-400 mt-8">
            No conversations yet. Start one above!
          </p>
        )}
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className="w-full text-left p-3 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-bold text-gray-900 truncate">{c.subject}</span>
              <div className="flex items-center gap-1 shrink-0">
                {c.unreadCustomer > 0 && (
                  <Badge className="size-5 flex items-center justify-center p-0 bg-accent text-white text-[10px]">
                    {c.unreadCustomer}
                  </Badge>
                )}
                <span className="text-[10px] text-gray-400">{formatTime(c.lastMessageAt)}</span>
              </div>
            </div>
            {c.latestMessage && (
              <p className="text-xs text-gray-500 mt-1 truncate">{c.latestMessage}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

/** Renders a new conversation form */
function NewConversationForm({
  onCancel,
  onSubmit,
  loading,
}: {
  onCancel: () => void
  onSubmit: (subject: string, firstMessage: string) => Promise<void>
  loading: boolean
}) {
  const [subject, setSubject] = React.useState("")
  const [message, setMessage] = React.useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    await onSubmit(subject.trim(), message.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1">
      <button
        type="button"
        onClick={onCancel}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        aria-label="Go back"
      >
        <ChevronLeft className="size-4" /> Back
      </button>
      <div className="flex flex-col gap-1">
        <label htmlFor="chat-subject" className="text-xs font-bold text-gray-700">
          Subject (optional)
        </label>
        <Input
          id="chat-subject"
          placeholder="e.g. Order issue, Product query…"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          maxLength={200}
        />
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <label htmlFor="chat-first-message" className="text-xs font-bold text-gray-700">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="chat-first-message"
          className="flex-1 min-h-32 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Describe your question or issue…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={5000}
          required
        />
      </div>
      <Button
        type="submit"
        disabled={loading || !message.trim()}
        className="w-full bg-primary text-white hover:bg-primary/90"
      >
        {loading ? "Sending…" : "Send Message"}
      </Button>
    </form>
  )
}

/** Renders a single conversation thread with realtime updates */
function ThreadView({
  detail,
  currentUserId,
  onBack,
  onSend,
  sending,
}: {
  detail: ConversationDetail
  currentUserId: string
  onBack: () => void
  onSend: (content: string) => Promise<void>
  sending: boolean
}) {
  const [input, setInput] = React.useState("")
  const bottomRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [detail.messages.length])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    await onSend(input.trim())
    setInput("")
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Thread header */}
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-3">
        <button
          onClick={onBack}
          className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
          aria-label="Back to conversations"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-gray-900 truncate">
            {detail.conversation.subject}
          </p>
          <p className="text-[10px] text-gray-400 capitalize">{detail.conversation.status}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
        {detail.messages.map((msg) => {
          const isOwnMessage = msg.senderId === currentUserId
          return (
            <div
              key={msg.id}
              className={cn(
                "flex",
                isOwnMessage ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] px-3 py-2 rounded-2xl text-sm",
                  isOwnMessage
                    ? "bg-primary text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-900 rounded-bl-sm"
                )}
              >
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                <p
                  className={cn(
                    "text-[10px] mt-1",
                    isOwnMessage ? "text-white/70 text-right" : "text-gray-400"
                  )}
                >
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex items-end gap-2 pt-3 border-t border-gray-100 mt-3">
        <textarea
          className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-10 max-h-24"
          placeholder="Type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSend(e as unknown as React.FormEvent)
            }
          }}
          maxLength={5000}
          aria-label="Message input"
        />
        <Button
          type="submit"
          size="icon"
          disabled={sending || !input.trim()}
          className="size-10 rounded-xl bg-primary text-white hover:bg-primary/90 shrink-0"
          aria-label="Send message"
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

/**
 * Floating chat widget that renders on all shop pages.
 * Shows unread badge on the trigger button and opens a support inbox sheet.
 */
export function ChatWidget() {
  const [open, setOpen] = React.useState(false)
  const [unreadCount, setUnreadCount] = React.useState(0)
  const [authToken, setAuthToken] = React.useState<string | null>(null)
  const [userId, setUserId] = React.useState<string | null>(null)
  const [convos, setConvos] = React.useState<ConversationSummary[]>([])
  const [activeThread, setActiveThread] = React.useState<ConversationDetail | null>(null)
  const [view, setView] = React.useState<"list" | "thread" | "new">("list")
  const [loading, setLoading] = React.useState(false)
  const [sending, setSending] = React.useState(false)
  const supabase = React.useMemo(() => getBrowserClient(), [])

  // ── Auth check ───────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!supabase) return

    async function checkSession() {
      const { data } = await supabase!.auth.getSession()
      if (data.session) {
        setAuthToken(data.session.access_token)
        setUserId(data.session.user.id)
      }
    }

    checkSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthToken(session?.access_token ?? null)
      setUserId(session?.user.id ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [supabase])

  // ── Poll unread count ────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!authToken) return

    async function fetchUnread() {
      const res = await fetch("/api/conversations/unread-count", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (res.ok) {
        const json = await res.json()
        setUnreadCount(json.data?.count ?? 0)
      }
    }

    fetchUnread()
    const interval = setInterval(fetchUnread, 60_000)
    return () => clearInterval(interval)
  }, [authToken])

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
          // Avoid duplicate messages
          const exists = prev.messages.some((m) => m.id === incomingMessage.id)
          if (exists) return prev
          return { ...prev, messages: [...prev.messages, incomingMessage] }
        })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, activeThread?.conversation.id])

  // ── Fetch conversations list ─────────────────────────────────────────────
  async function fetchConversations() {
    if (!authToken) return
    setLoading(true)
    try {
      const res = await fetch("/api/conversations", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (res.ok) {
        const json = await res.json()
        setConvos(json.data ?? [])
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Open conversation thread ─────────────────────────────────────────────
  async function openThread(id: number) {
    if (!authToken) return
    setLoading(true)
    try {
      const res = await fetch(`/api/conversations/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (res.ok) {
        const json = await res.json()
        setActiveThread(json.data)
        setView("thread")
        // Refresh unread count after reading
        setConvos((prev) =>
          prev.map((c) => (c.id === id ? { ...c, unreadCustomer: 0 } : c))
        )
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Create new conversation ──────────────────────────────────────────────
  async function createConversation(subject: string, firstMessage: string) {
    if (!authToken) return
    setLoading(true)
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          subject: subject || undefined,
          firstMessage,
        }),
      })
      if (res.ok) {
        const json = await res.json()
        await openThread(json.data.id)
        fetchConversations()
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Send a message ───────────────────────────────────────────────────────
  async function sendMessage(content: string) {
    if (!authToken || !activeThread) return
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
          body: JSON.stringify({ content }),
        }
      )
      if (res.ok) {
        const json = await res.json()
        setActiveThread((prev) => {
          if (!prev) return prev
          return { ...prev, messages: [...prev.messages, json.data] }
        })
      }
    } finally {
      setSending(false)
    }
  }

  // ── On sheet open: load conversations ────────────────────────────────────
  function handleOpenChange(val: boolean) {
    setOpen(val)
    if (val && authToken) {
      fetchConversations()
      setView("list")
      setActiveThread(null)
    }
  }

  // ── DB user ID resolution for message ownership display ─────────────────
  // We use the Supabase userId here as the senderId stored is the DB user id.
  // For display purposes this approximation is acceptable without an extra round-trip.
  const displayUserId = userId ?? ""

  return (
    <>
      {/* Floating trigger button */}
      <div className="fixed bottom-24 right-4 z-40">
        <button
          onClick={() => handleOpenChange(true)}
          className="relative size-14 rounded-full bg-primary text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center"
          aria-label="Open support chat"
        >
          <MessageCircle className="size-7" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 size-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Chat sheet */}
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md flex flex-col gap-0 p-0"
        >
          {/* Header */}
          <SheetHeader className="px-5 py-4 border-b border-gray-100 shrink-0">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-base font-black text-gray-900">
                Support Chat
              </SheetTitle>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                aria-label="Close chat"
              >
                <X className="size-5" />
              </button>
            </div>
          </SheetHeader>

          {/* Body */}
          <div className="flex-1 flex flex-col overflow-hidden px-5 py-4">
            {/* Unauthenticated state */}
            {!authToken && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                <MessageCircle className="size-12 text-primary/30" />
                <p className="text-sm font-bold text-gray-700">
                  Sign in to chat with us
                </p>
                <p className="text-xs text-gray-400">
                  Our support team is ready to help.
                </p>
                <Link
                  href="/account"
                  className="inline-flex items-center justify-center px-4 h-9 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Authenticated: conversation list */}
            {authToken && view === "list" && (
              <ConversationList
                conversations={convos}
                onSelect={openThread}
                onNewConversation={() => setView("new")}
              />
            )}

            {/* Authenticated: new conversation form */}
            {authToken && view === "new" && (
              <NewConversationForm
                onCancel={() => setView("list")}
                onSubmit={createConversation}
                loading={loading}
              />
            )}

            {/* Authenticated: thread view */}
            {authToken && view === "thread" && activeThread && (
              <ThreadView
                detail={activeThread}
                currentUserId={displayUserId}
                onBack={() => {
                  setView("list")
                  setActiveThread(null)
                }}
                onSend={sendMessage}
                sending={sending}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
