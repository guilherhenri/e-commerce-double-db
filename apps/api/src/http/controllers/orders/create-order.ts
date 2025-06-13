import { eq, inArray } from 'drizzle-orm'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { postgresDb } from '@/infra/database/postgresql/connection'
import {
  orders,
  paymentMethodEnum,
  products,
  users,
} from '@/infra/database/postgresql/schema'
import { generateOrderNumber } from '@/utils/generate-order-number'

export async function createOrder(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createOrderBodySchema = z.object({
    userId: z.string().uuid(),
    totalAmount: z.number(),
    shippingAddress: z.string(),
    items: z
      .array(
        z.object({
          productId: z.string().uuid(),
          quantity: z.number(),
          price: z.number(),
        }),
      )
      .min(1),
    paymentMethod: z.enum(paymentMethodEnum.enumValues),
  })

  const { userId, totalAmount, shippingAddress, items, paymentMethod } =
    createOrderBodySchema.parse(request.body)

  const [user] = await postgresDb
    .select()
    .from(users)
    .where(eq(users.id, userId))

  if (!user) {
    throw new Error('User not found')
  }

  if (totalAmount <= 0) {
    throw new Error('Total amount need to be great than zero')
  }

  if (items.length <= 0) {
    throw new Error('You need send at least one item')
  }

  const productsIds = items.map((item) => item.productId)

  const result = await postgresDb.transaction(async (tx) => {
    const allProductsExists = await tx
      .select()
      .from(products)
      .where(inArray(products.id, productsIds))
      .for('update')

    if (allProductsExists.length !== productsIds.length) {
      throw new Error('Product not found')
    }

    for (const itemProduct of items) {
      const dbProduct = allProductsExists.find(
        (product) => product.id === itemProduct.productId,
      )

      if (!dbProduct?.stock) {
        throw new Error('Product not found')
      }

      if (dbProduct.stock < itemProduct.quantity) {
        throw new Error(
          `Product ${dbProduct.name || dbProduct.id} doesn't have enough stock. Available: ${dbProduct.stock}, Requested: ${itemProduct.quantity}`,
        )
      }
    }

    for (const itemProduct of items) {
      const dbProduct = allProductsExists.find(
        (product) => product.id === itemProduct.productId,
      )

      if (!dbProduct?.stock) {
        throw new Error('Product not found')
      }

      await tx
        .update(products)
        .set({
          stock: dbProduct.stock - itemProduct.quantity,
        })
        .where(eq(products.id, itemProduct.productId))
    }

    const orderNumber = generateOrderNumber()

    const [order] = await postgresDb
      .insert(orders)
      .values({
        userId,
        totalAmount: totalAmount.toString(),
        shippingAddress,
        items,
        paymentMethod,
        orderNumber,
      })
      .returning()

    return order
  })

  return reply.status(201).send({
    order: result,
  })
}
