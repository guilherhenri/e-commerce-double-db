import { eq, inArray } from 'drizzle-orm'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { postgresDb } from '@/infra/database/postgresql/connection'
import { orders, products, users } from '@/infra/database/postgresql/schema'

export async function getOrder(request: FastifyRequest, reply: FastifyReply) {
  const getOrderParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = getOrderParamsSchema.parse(request.params)

  const [order] = await postgresDb
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
    .where(eq(orders.id, id))
    .leftJoin(users, eq(orders.userId, users.id))

  if (!order) {
    throw new Error('Order not found')
  }

  const allProductIds = order.items.map((item) => item.productId)

  const productsData = await postgresDb
    .select()
    .from(products)
    .where(inArray(products.id, allProductIds))

  const productsMap = new Map(
    productsData.map((product) => [product.id, product]),
  )

  const orderWithProducts = {
    ...order,
    items: order.items.map((item) => ({
      ...item,
      product: productsMap.get(item.productId),
    })),
  }

  return reply.send({
    order: orderWithProducts,
  })
}
