/**
 * @file constants/routes.ts
 * @description All application route paths as typed constants.
 *              Import from here instead of hardcoding strings.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-23
 */

// ─────────────────────────────────────────────
// PUBLIC SHOP ROUTES
// ─────────────────────────────────────────────

export const ROUTES = {
  home: "/",
  shop: "/shop",
  product: (slug: string) => `/products/${slug}`,
  category: (slug: string) => `/category/${slug}`,
  cart: "/cart",
  checkout: "/checkout",
  orderTracking: (orderNumber: string) => `/order/${orderNumber}`,
  auth: {
    login: "/login",
    logout: "/logout",
  },

  // ─────────────────────────────────────────
  // API — PUBLIC
  // ─────────────────────────────────────────
  api: {
    products: "/api/products",
    product: (slug: string) => `/api/products/${slug}`,
    categories: "/api/categories",
    banners: "/api/banners",
    flashDeal: "/api/flash-deal",
    validateCoupon: "/api/coupons/validate",
    orders: "/api/orders",
    order: (orderNumber: string) => `/api/orders/${orderNumber}`,
    paymentInitiate: "/api/payment/initiate",
    paymentWebhook: "/api/payment/webhook",
    paymentCallback: "/api/payment/callback",
    authOtp: "/api/auth/otp",
    authVerify: "/api/auth/verify",
  },

  // ─────────────────────────────────────────
  // ADMIN UI
  // ─────────────────────────────────────────
  admin: {
    login: "/admin/login",
    dashboard: "/admin",
    orders: "/admin/orders",
    order: (id: string) => `/admin/orders/${id}`,
    products: "/admin/products",
    product: (id: string) => `/admin/products/${id}`,
    newProduct: "/admin/products/new",
    categories: "/admin/categories",
    banners: "/admin/banners",
    flashDeals: "/admin/flash-deals",
    coupons: "/admin/coupons",
    customers: "/admin/customers",
    customer: (id: string) => `/admin/customers/${id}`,
    inventory: "/admin/inventory",
    analytics: "/admin/analytics",
    settings: "/admin/settings",
    users: "/admin/users",
    auditLog: "/admin/audit-log",
  },

  // ─────────────────────────────────────────
  // ADMIN API
  // ─────────────────────────────────────────
  adminApi: {
    dashboard: "/api/admin/dashboard",
    orders: "/api/admin/orders",
    order: (id: string) => `/api/admin/orders/${id}`,
    orderStatus: (id: string) => `/api/admin/orders/${id}/status`,
    orderPayment: (id: string) => `/api/admin/orders/${id}/payment`,
    orderNotes: (id: string) => `/api/admin/orders/${id}/notes`,
    orderCourier: (id: string) => `/api/admin/orders/${id}/courier`,
    orderRefund: (id: string) => `/api/admin/orders/${id}/refund`,
    ordersExport: "/api/admin/orders/export",
    products: "/api/admin/products",
    product: (id: string) => `/api/admin/products/${id}`,
    productStock: (id: string) => `/api/admin/products/${id}/stock`,
    upload: "/api/admin/upload",
    categories: "/api/admin/categories",
    category: (id: string) => `/api/admin/categories/${id}`,
    categoriesReorder: "/api/admin/categories/reorder",
    customers: "/api/admin/customers",
    customer: (id: string) => `/api/admin/customers/${id}`,
    customerBan: (id: string) => `/api/admin/customers/${id}/ban`,
    customerUnban: (id: string) => `/api/admin/customers/${id}/unban`,
    banners: "/api/admin/banners",
    banner: (id: string) => `/api/admin/banners/${id}`,
    bannersReorder: "/api/admin/banners/reorder",
    flashDeals: "/api/admin/flash-deals",
    flashDeal: (id: string) => `/api/admin/flash-deals/${id}`,
    coupons: "/api/admin/coupons",
    coupon: (id: string) => `/api/admin/coupons/${id}`,
    inventory: "/api/admin/inventory",
    inventoryAdjust: "/api/admin/inventory/adjust",
    inventoryLog: "/api/admin/inventory/log",
    inventoryExport: "/api/admin/inventory/export",
    analyticsRevenue: "/api/admin/analytics/revenue",
    analyticsOrders: "/api/admin/analytics/orders",
    analyticsProducts: "/api/admin/analytics/products",
    analyticsCustomers: "/api/admin/analytics/customers",
    analyticsInventory: "/api/admin/analytics/inventory",
    settings: "/api/admin/settings",
    users: "/api/admin/users",
    user: (id: string) => `/api/admin/users/${id}`,
    auditLog: "/api/admin/audit-log",
  },
} as const
