/**
 * @file page.tsx
 * @path /checkout
 * @description Checkout page — reads from CartContext, collects address, payment method,
 *              validates coupon, and calls POST /api/orders to place the real order.
 *
 * @owner    Gemini Design Agent / Claude Backend Agent
 * @updated  2026-05-24
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShieldCheck, Lock, CreditCard, Tag, X, CheckCircle2, Loader2, ShoppingCart } from "lucide-react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AddressForm, type AddressData } from "@/components/shop/address-form"
import { PaymentMethodSelector } from "@/components/shop/payment-method-selector"
import { OrderSummary } from "@/components/shop/order-summary"
import { EmptyState } from "@/components/ui/empty-state"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useCart } from "@/components/providers/cart-provider"

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const SHIPPING = 80
const COD_FEE = 40

// ─────────────────────────────────────────────
// COUPON WIDGET
// ─────────────────────────────────────────────

interface AppliedCoupon {
  code: string
  discountType: "percentage" | "fixed"
  discountValue: number
  discountAmount: number
}

interface CouponWidgetProps {
  subtotal: number
  onApply: (coupon: AppliedCoupon) => void
  onRemove: () => void
  applied: AppliedCoupon | null
}

/**
 * Coupon input field with live validation against POST /api/coupons/validate.
 * Shows success state with discount amount when a valid coupon is applied.
 */
function CouponWidget({ subtotal, onApply, onRemove, applied }: CouponWidgetProps) {
  const [code, setCode] = React.useState("")
  const [isValidating, setIsValidating] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleApply = async () => {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) return
    setError(null)
    setIsValidating(true)

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed, orderSubtotal: subtotal }),
      })
      const json = await res.json()

      if (!res.ok) {
        setError(json.error ?? "Invalid coupon code")
        return
      }

      const { discountType, discountValue, discountAmount } = json.data
      onApply({ code: trimmed, discountType, discountValue, discountAmount })
      setCode("")
      toast.success(`Coupon "${trimmed}" applied! You saved ৳${discountAmount.toLocaleString()}`)
    } catch {
      setError("Could not validate coupon. Please try again.")
    } finally {
      setIsValidating(false)
    }
  }

  const handleRemove = () => {
    onRemove()
    setError(null)
    toast.info("Coupon removed")
  }

  if (applied) {
    return (
      <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/20">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="size-5 text-primary shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm font-black text-gray-900 uppercase tracking-wide">{applied.code}</span>
            <span className="text-xs text-primary font-bold">−৳{applied.discountAmount.toLocaleString()} discount applied</span>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="size-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          aria-label="Remove coupon"
        >
          <X className="size-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(null) }}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            placeholder="Enter coupon code"
            className={cn(
              "pl-9 h-12 rounded-xl font-bold uppercase tracking-widest text-sm",
              error && "border-red-300 focus-visible:ring-red-200"
            )}
            disabled={isValidating}
          />
        </div>
        <Button
          onClick={handleApply}
          disabled={!code.trim() || isValidating}
          className="h-12 px-6 rounded-xl font-black shrink-0"
        >
          {isValidating ? <Loader2 className="size-4 animate-spin" /> : "Apply"}
        </Button>
      </div>
      {error && <p className="text-xs text-red-500 font-bold px-1">{error}</p>}
    </div>
  )
}

// ─────────────────────────────────────────────
// ADDRESS VALIDATION
// ─────────────────────────────────────────────

const PHONE_RE = /^01[3-9]\d{8}$/

function validateAddress(addr: AddressData): Partial<Record<keyof AddressData, string>> {
  const errs: Partial<Record<keyof AddressData, string>> = {}
  if (!addr.name.trim()) errs.name = "Name is required"
  if (!PHONE_RE.test(addr.phone.trim())) errs.phone = "Enter a valid Bangladesh phone number (01XXXXXXXXX)"
  if (!addr.district) errs.district = "Select a district"
  if (!addr.thana) errs.thana = "Select a thana"
  if (!addr.area.trim()) errs.area = "Area is required"
  return errs
}

// ─────────────────────────────────────────────
// MAIN PAGE EXPORT
// ─────────────────────────────────────────────

const EMPTY_ADDRESS: AddressData = {
  name: "", phone: "", district: "", thana: "", area: "", road: "", house: "", landmark: "",
}

/** Checkout page — reads live cart, collects address, places real order via POST /api/orders. */
export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()

  const [address, setAddress] = React.useState<AddressData>(EMPTY_ADDRESS)
  const [addrErrors, setAddrErrors] = React.useState<Partial<Record<keyof AddressData, string>>>({})
  const [paymentMethod, setPaymentMethod] = React.useState<"cod" | "bkash" | "nagad" | "card">("cod")
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false)
  const [appliedCoupon, setAppliedCoupon] = React.useState<AppliedCoupon | null>(null)

  const codFee = paymentMethod === "cod" ? COD_FEE : 0
  const discount = appliedCoupon?.discountAmount ?? 0
  const total = subtotal + SHIPPING + codFee - discount

  const handlePlaceOrder = async () => {
    // Validate address first
    const errors = validateAddress(address)
    if (Object.keys(errors).length > 0) {
      setAddrErrors(errors)
      toast.error("Please fill in all required delivery fields.")
      return
    }
    setAddrErrors({})

    if (items.length === 0) {
      toast.error("Your cart is empty.")
      return
    }

    setIsPlacingOrder(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, qty: i.quantity })),
          address: {
            name: address.name.trim(),
            phone: address.phone.trim(),
            district: address.district,
            thana: address.thana,
            area: address.area.trim(),
            road: address.road.trim() || undefined,
            house: address.house.trim() || undefined,
            landmark: address.landmark.trim() || undefined,
          },
          paymentMethod,
          couponCode: appliedCoupon?.code || undefined,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        toast.error(json.error ?? "Failed to place order. Please try again.")
        return
      }

      // COD — order confirmed, redirect to order confirmation
      if (paymentMethod === "cod") {
        clearCart()
        router.push(`/order/${json.data.orderNumber}`)
        return
      }

      // Online payment — redirect to aamarPay payment URL
      if (json.data.paymentUrl) {
        clearCart()
        window.location.href = json.data.paymentUrl
        return
      }

      // Fallback
      clearCart()
      router.push(`/order/${json.data.orderNumber}`)
    } catch {
      toast.error("Network error. Please check your connection and try again.")
    } finally {
      setIsPlacingOrder(false)
    }
  }

  // Empty cart — show empty state
  if (items.length === 0 && !isPlacingOrder) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50/50">
        <Header />
        <main className="flex-1 flex items-center justify-center p-8">
          <EmptyState
            icon={<ShoppingCart className="size-10" />}
            title="Your cart is empty"
            description="Add some products to your cart before checking out."
            cta={<Link href="/products"><Button variant="primary" size="lg">Browse Products</Button></Link>}
          />
        </main>
        <Footer />
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">

          {/* Checkout Header */}
          <div className="flex flex-col gap-6 mb-10">
            <Link
              href="/cart"
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors w-fit"
            >
              <ArrowLeft className="size-4" /> Back to Cart
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Checkout</h1>
                <Badge variant="verified" className="h-7 px-3 bg-primary/5 text-primary border-primary/20 flex gap-1.5 items-center">
                  <Lock className="size-3" /> Secure Transaction
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* LEFT: Checkout Forms */}
            <div className="lg:col-span-8 flex flex-col gap-8">

              {/* 1. Delivery Address */}
              <section className="flex flex-col gap-4">
                <div className="flex items-center gap-3 px-1">
                  <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm">1</div>
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Delivery Address</h2>
                </div>
                <AddressForm value={address} onChange={setAddress} errors={addrErrors} />
              </section>

              {/* 2. Payment Method */}
              <section className="flex flex-col gap-4">
                <div className="flex items-center gap-3 px-1">
                  <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm">2</div>
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Payment Method</h2>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-sm text-gray-500 mb-6 font-medium">
                    Choose how you&apos;d like to pay. Cash on Delivery is available for all orders inside Bangladesh.
                  </p>
                  <PaymentMethodSelector selected={paymentMethod} onChange={setPaymentMethod} />
                </div>
              </section>

              {/* 3. Coupon */}
              <section className="flex flex-col gap-4">
                <div className="flex items-center gap-3 px-1">
                  <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm">3</div>
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Coupon Code</h2>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">(Optional)</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <CouponWidget
                    subtotal={subtotal}
                    applied={appliedCoupon}
                    onApply={setAppliedCoupon}
                    onRemove={() => setAppliedCoupon(null)}
                  />
                </div>
              </section>

              {/* SSL note */}
              <div className="flex items-center gap-3 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <ShieldCheck className="size-10 text-primary shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-black text-gray-900 uppercase tracking-wide">SSL Secure Payment</span>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    Your personal and payment information is encrypted and protected.
                    We never store your card details on our servers.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT: Order Summary Sidebar */}
            <div className="lg:col-span-4 sticky top-32 flex flex-col gap-6">
              <OrderSummary
                subtotal={subtotal}
                shipping={SHIPPING}
                codFee={codFee}
                discount={discount}
              />

              {appliedCoupon && (
                <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-primary/5 border border-primary/20 text-xs font-bold">
                  <span className="text-gray-600 uppercase tracking-wider">Coupon {appliedCoupon.code}</span>
                  <span className="text-primary">−৳{appliedCoupon.discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-900 text-white">
                <span className="text-sm font-black uppercase tracking-wider">Grand Total</span>
                <span className="text-lg font-black">৳{total.toLocaleString()}</span>
              </div>

              <Button
                size="lg"
                className="w-full py-8 text-xl font-black shadow-xl shadow-primary/20 gap-3"
                onClick={handlePlaceOrder}
                loading={isPlacingOrder}
              >
                {paymentMethod === "cod" ? "Confirm Order" : "Proceed to Pay"}
                {paymentMethod !== "cod" && <CreditCard className="size-6" />}
              </Button>

              {/* Cart items summary */}
              <div className="flex flex-col gap-6 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Order Items ({items.length})</h3>
                <div className="flex flex-col gap-4 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <div className="size-12 rounded-lg bg-gray-50 border border-gray-100 shrink-0 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="size-full object-cover" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-gray-900 line-clamp-1">{item.name}</span>
                        <span className="text-[10px] text-gray-500 font-medium">
                          Qty: {item.quantity} × ৳{(item.salePrice ?? item.price).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/cart" className="text-xs font-black text-primary uppercase tracking-wider text-center hover:underline">
                  Edit Cart Items
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </div>
  )
}
