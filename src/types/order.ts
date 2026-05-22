/**
 * @file order.ts
 * @description Shared order type definitions used across API and UI.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-22
 */

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned"

export type PaymentStatus = "pending" | "pending_cod" | "paid" | "failed" | "refunded"

export type PaymentMethod = "cod" | "bkash" | "nagad" | "card"

export interface OrderItemPublic {
  name: string
  qty: number
  price: number
  image: string | null
}

export interface OrderPublic {
  orderNumber: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  items: OrderItemPublic[]
  total: number
  deliveryCharge: number
  codFee: number
  address: { name: string; district: string; thana: string }
  createdAt: string
  estimatedDelivery?: string
}
