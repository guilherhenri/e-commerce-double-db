import { eq, inArray } from 'drizzle-orm'
import type { FastifyReply, FastifyRequest } from 'fastify'

import { postgresDb } from '@/infra/database/postgresql/connection'
import { orders, products, users } from '@/infra/database/postgresql/schema'

export async function listOrders(request: FastifyRequest, reply: FastifyReply) {
  const ordersResult = await postgresDb
    .select({
      id: orders.id,
      userId: orders.userId,
      status: orders.status,
      totalAmount: orders.totalAmount,
      shippingAddress: orders.shippingAddress,
      items: orders.items,
      paymentMethod: orders.paymentMethod,
      orderNumber: orders.orderNumber,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      },
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))

  const allProductIds = [
    ...new Set(
      ordersResult.flatMap((order) =>
        order.items.map((item) => item.productId),
      ),
    ),
  ]

  const productsData = await postgresDb
    .select()
    .from(products)
    .where(inArray(products.id, allProductIds))

  const productsMap = new Map(
    productsData.map((product) => [product.id, product]),
  )

  const listOrdersWithProducts = ordersResult.map((order) => ({
    ...order,
    items: order.items.map((item) => ({
      ...item,
      product: productsMap.get(item.productId),
    })),
  }))

  return reply.send({
    orders: listOrdersWithProducts,
  })
}
