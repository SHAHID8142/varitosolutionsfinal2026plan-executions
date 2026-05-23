/**
 * @file constants/payment-methods.ts
 * @description Payment method configuration: labels, fees, icons, descriptions.
 *              Used in checkout UI and order summaries.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

export type PaymentMethodId = "cod" | "bkash" | "nagad" | "card"

export interface PaymentMethod {
  id: PaymentMethodId
  label: string
  labelBn: string
  description: string
  fee: number
  /** Relative path to icon in /public/icons/ */
  icon: string
  available: boolean
}

export const PAYMENT_METHODS: Record<PaymentMethodId, PaymentMethod> = {
  cod: {
    id: "cod",
    label: "Cash on Delivery",
    labelBn: "ক্যাশ অন ডেলিভারি",
    description: "Pay when your order arrives",
    fee: 40,
    icon: "/icons/cod.svg",
    available: true,
  },
  bkash: {
    id: "bkash",
    label: "bKash",
    labelBn: "বিকাশ",
    description: "Pay via bKash mobile banking",
    fee: 0,
    icon: "/icons/bkash.svg",
    available: true,
  },
  nagad: {
    id: "nagad",
    label: "Nagad",
    labelBn: "নগদ",
    description: "Pay via Nagad mobile banking",
    fee: 0,
    icon: "/icons/nagad.svg",
    available: true,
  },
  card: {
    id: "card",
    label: "Credit / Debit Card",
    labelBn: "ক্রেডিট / ডেবিট কার্ড",
    description: "Pay via Visa, Mastercard, or local cards",
    fee: 0,
    icon: "/icons/card.svg",
    available: true,
  },
}

export const PAYMENT_METHOD_LIST = Object.values(PAYMENT_METHODS)

/** Fee charged for Cash on Delivery orders in BDT */
export const COD_FEE = 40
