/**
 * @file schema.ts
 * @description Drizzle ORM schema — source of truth for all database tables.
 *              Run `npm run db:generate` after any change, then `npm run db:migrate`.
 *
 * @owner    Claude Backend Agent
 * @updated  2026-05-22
 */

import {
  pgTable,
  serial,
  varchar,
  text,
  decimal,
  boolean,
  timestamp,
  integer,
  uuid,
  jsonb,
  index,
  uniqueIndex,
  customType,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// ─────────────────────────────────────────────
// CUSTOM TYPES
// ─────────────────────────────────────────────

/** PostgreSQL text[] array — stores image URL arrays */
const textArray = customType<{ data: string[] }>({
  dataType() {
    return "text[]"
  },
})

// ─────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    nameBn: varchar("name_bn", { length: 100 }),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    parentId: integer("parent_id").references((): ReturnType<typeof categories.id.columnType> => categories.id, {
      onDelete: "set null",
    }),
    image: text("image"),
    sortOrder: integer("sort_order").default(0),
    isActive: boolean("is_active").default(true),
    isFeatured: boolean("is_featured").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("categories_parent_id_idx").on(table.parentId),
    index("categories_is_featured_idx").on(table.isFeatured),
  ]
)

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "parentChild",
  }),
  children: many(categories, { relationName: "parentChild" }),
  products: many(products),
}))

// ─────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 200 }).notNull(),
    nameBn: varchar("name_bn", { length: 200 }),
    slug: varchar("slug", { length: 220 }).notNull().unique(),
    description: text("description"),
    descriptionBn: text("description_bn"),
    categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    salePrice: decimal("sale_price", { precision: 10, scale: 2 }),
    costPrice: decimal("cost_price", { precision: 10, scale: 2 }).notNull(),
    stock: integer("stock").default(0).notNull(),
    unit: varchar("unit", { length: 20 }).default("piece").notNull(),
    minOrderQty: integer("min_order_qty").default(1).notNull(),
    sku: varchar("sku", { length: 50 }).notNull().unique(),
    images: textArray("images").default([]).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    totalOrders: integer("total_orders").default(0).notNull(),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("products_category_id_idx").on(table.categoryId),
    index("products_is_active_idx").on(table.isActive),
    index("products_deleted_at_idx").on(table.deletedAt),
    index("products_is_featured_idx").on(table.isFeatured),
    index("products_total_orders_idx").on(table.totalOrders),
  ]
)

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  orderItems: many(orderItems),
  reviews: many(productReviews),
  inventoryLog: many(inventoryLog),
}))

// ─────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    supabaseId: uuid("supabase_id").unique(),
    phone: varchar("phone", { length: 15 }).unique().notNull(),
    name: varchar("name", { length: 100 }),
    email: varchar("email", { length: 150 }),
    role: varchar("role", { length: 20 }).default("customer").notNull(),
    isBanned: boolean("is_banned").default(false).notNull(),
    banReason: text("ban_reason"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("users_phone_idx").on(table.phone),
    uniqueIndex("users_supabase_id_idx").on(table.supabaseId),
  ]
)

export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  orders: many(orders),
}))

// ─────────────────────────────────────────────
// ADDRESSES
// ─────────────────────────────────────────────

export const addresses = pgTable(
  "addresses",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 20 }).default("home"),
    name: varchar("name", { length: 100 }).notNull(),
    phone: varchar("phone", { length: 15 }).notNull(),
    district: varchar("district", { length: 50 }).notNull(),
    thana: varchar("thana", { length: 50 }).notNull(),
    area: varchar("area", { length: 100 }),
    road: varchar("road", { length: 150 }),
    house: varchar("house", { length: 100 }),
    landmark: varchar("landmark", { length: 200 }),
    isDefault: boolean("is_default").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("addresses_user_id_idx").on(table.userId)]
)

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, { fields: [addresses.userId], references: [users.id] }),
}))

// ─────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    orderNumber: varchar("order_number", { length: 20 }).notNull().unique(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    status: varchar("status", { length: 20 }).default("pending").notNull(),
    paymentMethod: varchar("payment_method", { length: 20 }).notNull(),
    paymentStatus: varchar("payment_status", { length: 20 }).default("pending").notNull(),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    deliveryCharge: decimal("delivery_charge", { precision: 10, scale: 2 }).default("60.00").notNull(),
    codFee: decimal("cod_fee", { precision: 10, scale: 2 }).default("0").notNull(),
    discount: decimal("discount", { precision: 10, scale: 2 }).default("0").notNull(),
    total: decimal("total", { precision: 10, scale: 2 }).notNull(),
    // Address snapshot
    customerName: varchar("customer_name", { length: 100 }).notNull(),
    customerPhone: varchar("customer_phone", { length: 15 }).notNull(),
    addressDistrict: varchar("address_district", { length: 50 }).notNull(),
    addressThana: varchar("address_thana", { length: 50 }).notNull(),
    addressArea: varchar("address_area", { length: 100 }),
    addressRoad: varchar("address_road", { length: 150 }),
    addressHouse: varchar("address_house", { length: 100 }),
    addressLandmark: varchar("address_landmark", { length: 200 }),
    // Courier
    courierName: varchar("courier_name", { length: 50 }),
    consignmentId: varchar("consignment_id", { length: 100 }),
    courierStatus: varchar("courier_status", { length: 50 }),
    // Payment gateway
    aamarpayTxnId: varchar("aamarpay_txn_id", { length: 100 }),
    aamarpayPaymentId: varchar("aamarpay_payment_id", { length: 100 }),
    notes: text("notes"),
    adminNotes: text("admin_notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("orders_order_number_idx").on(table.orderNumber),
    index("orders_user_id_idx").on(table.userId),
    index("orders_status_idx").on(table.status),
    index("orders_payment_status_idx").on(table.paymentStatus),
    index("orders_created_at_idx").on(table.createdAt),
  ]
)

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
  history: many(orderHistory),
}))

// ─────────────────────────────────────────────
// ORDER ITEMS
// ─────────────────────────────────────────────

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .references(() => orders.id, { onDelete: "cascade" })
      .notNull(),
    productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
    productName: varchar("product_name", { length: 200 }).notNull(),
    productSku: varchar("product_sku", { length: 50 }).notNull(),
    productImage: text("product_image"),
    qty: integer("qty").notNull(),
    unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
    total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  },
  (table) => [
    index("order_items_order_id_idx").on(table.orderId),
    index("order_items_product_id_idx").on(table.productId),
  ]
)

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}))

// ─────────────────────────────────────────────
// ORDER HISTORY
// ─────────────────────────────────────────────

export const orderHistory = pgTable("order_history", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  fromStatus: varchar("from_status", { length: 20 }),
  toStatus: varchar("to_status", { length: 20 }).notNull(),
  changedBy: uuid("changed_by").references(() => users.id),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const orderHistoryRelations = relations(orderHistory, ({ one }) => ({
  order: one(orders, { fields: [orderHistory.orderId], references: [orders.id] }),
  changedByUser: one(users, { fields: [orderHistory.changedBy], references: [users.id] }),
}))

// ─────────────────────────────────────────────
// PRODUCT REVIEWS (Phase 2)
// ─────────────────────────────────────────────

export const productReviews = pgTable("product_reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  orderId: integer("order_id").references(() => orders.id),
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 150 }),
  body: text("body"),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, { fields: [productReviews.productId], references: [products.id] }),
  user: one(users, { fields: [productReviews.userId], references: [users.id] }),
}))

// ─────────────────────────────────────────────
// BANNERS
// ─────────────────────────────────────────────

export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }),
  subtitle: varchar("subtitle", { length: 300 }),
  image: text("image").notNull(),
  ctaText: varchar("cta_text", { length: 50 }),
  ctaUrl: varchar("cta_url", { length: 500 }),
  position: varchar("position", { length: 30 }).notNull(),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  startsAt: timestamp("starts_at"),
  endsAt: timestamp("ends_at"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─────────────────────────────────────────────
// COUPONS
// ─────────────────────────────────────────────

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 30 }).notNull().unique(),
  type: varchar("type", { length: 20 }).notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  minOrder: decimal("min_order", { precision: 10, scale: 2 }).default("0"),
  maxDiscount: decimal("max_discount", { precision: 10, scale: 2 }),
  usageLimit: integer("usage_limit"),
  perUserLimit: integer("per_user_limit").default(1),
  usedCount: integer("used_count").default(0),
  isActive: boolean("is_active").default(true),
  startsAt: timestamp("starts_at"),
  expiresAt: timestamp("expires_at"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const couponUses = pgTable("coupon_uses", {
  id: serial("id").primaryKey(),
  couponId: integer("coupon_id").references(() => coupons.id),
  orderId: integer("order_id").references(() => orders.id),
  userId: uuid("user_id").references(() => users.id),
  discount: decimal("discount", { precision: 10, scale: 2 }).notNull(),
  usedAt: timestamp("used_at").defaultNow().notNull(),
})

// ─────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  type: varchar("type", { length: 20 }).default("string"),
  updatedBy: uuid("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─────────────────────────────────────────────
// INVENTORY LOG
// ─────────────────────────────────────────────

export const inventoryLog = pgTable(
  "inventory_log",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id").references(() => products.id),
    type: varchar("type", { length: 20 }).notNull(),
    quantity: integer("quantity").notNull(),
    before: integer("before").notNull(),
    after: integer("after").notNull(),
    reason: text("reason"),
    orderId: integer("order_id").references(() => orders.id),
    changedBy: uuid("changed_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("inventory_log_product_id_idx").on(table.productId)]
)

export const inventoryLogRelations = relations(inventoryLog, ({ one }) => ({
  product: one(products, { fields: [inventoryLog.productId], references: [products.id] }),
}))

// ─────────────────────────────────────────────
// AUDIT LOG
// ─────────────────────────────────────────────

export const auditLog = pgTable(
  "audit_log",
  {
    id: serial("id").primaryKey(),
    adminId: uuid("admin_id").references(() => users.id),
    action: varchar("action", { length: 100 }).notNull(),
    entityType: varchar("entity_type", { length: 50 }),
    entityId: varchar("entity_id", { length: 50 }),
    changes: jsonb("changes"),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("audit_log_admin_id_idx").on(table.adminId),
    index("audit_log_entity_type_idx").on(table.entityType),
    index("audit_log_created_at_idx").on(table.createdAt),
  ]
)

// ─────────────────────────────────────────────
// TYPE EXPORTS
// ─────────────────────────────────────────────

export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Address = typeof addresses.$inferSelect
export type NewAddress = typeof addresses.$inferInsert
export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
export type OrderItem = typeof orderItems.$inferSelect
export type NewOrderItem = typeof orderItems.$inferInsert
export type OrderHistory = typeof orderHistory.$inferSelect
export type Banner = typeof banners.$inferSelect
export type NewBanner = typeof banners.$inferInsert
export type Coupon = typeof coupons.$inferSelect
export type NewCoupon = typeof coupons.$inferInsert
export type Setting = typeof settings.$inferSelect
export type InventoryLogEntry = typeof inventoryLog.$inferSelect
export type AuditLogEntry = typeof auditLog.$inferSelect
