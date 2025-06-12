import {
  decimal,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
})

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  categoryId: uuid('category_id').references(() => categories.id),
  stock: integer('stock').default(0),
  createdAt: timestamp('created_at').defaultNow(),
})

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'paid',
  'preparing',
  'shipping',
  'delivered',
  'canceled',
])
export const paymentMethodEnum = pgEnum('payment_method', [
  'pix',
  'credit',
  'debit',
])

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  status: orderStatusEnum('status').notNull().default('pending'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  shippingAddress: varchar('shipping_address', { length: 50 }).notNull(),
  items: jsonb('items')
    .$type<{ productId: string; quantity: number; price: number }[]>()
    .notNull(),
  paymentMethod: paymentMethodEnum('payment_method').notNull(),
  orderNumber: varchar('order_number', { length: 20 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
