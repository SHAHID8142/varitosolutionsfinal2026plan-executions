/**
 * @file cart-provider.tsx
 * @description Client-side shopping cart backed by localStorage.
 *              Provides cart state globally via React Context.
 *              Cart items persist across page navigations and browser refreshes.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-24
 */

"use client"

import * as React from "react"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface CartItem {
  productId: number
  slug: string
  name: string
  price: number
  salePrice?: number
  image: string
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">, qty: number) => void
  updateQty: (productId: number, qty: number) => void
  removeItem: (productId: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
}

// ─────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────

const CartContext = React.createContext<CartContextValue | null>(null)

const STORAGE_KEY = "varito_cart"

function loadFromStorage(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Storage quota exceeded — fail silently
  }
}

// ─────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────

/** Wraps the app to provide cart state. Mount in the root layout. */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([])
  const [hydrated, setHydrated] = React.useState(false)

  // Load from localStorage after mount to avoid SSR mismatch
  React.useEffect(() => {
    async function hydrate() {
      setItems(loadFromStorage())
      setHydrated(true)
    }
    hydrate()
  }, [])

  // Persist to localStorage on every change (after initial hydration)
  React.useEffect(() => {
    if (hydrated) saveToStorage(items)
  }, [items, hydrated])

  const addItem = React.useCallback((item: Omit<CartItem, "quantity">, qty: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId)
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + qty } : i
        )
      }
      return [...prev, { ...item, quantity: qty }]
    })
  }, [])

  const updateQty = React.useCallback((productId: number, qty: number) => {
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i)))
  }, [])

  const removeItem = React.useCallback((productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }, [])

  const clearCart = React.useCallback(() => {
    setItems([])
  }, [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + (i.salePrice ?? i.price) * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────

/** Use cart state from any client component. Must be inside <CartProvider>. */
export function useCart(): CartContextValue {
  const ctx = React.useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>")
  return ctx
}
