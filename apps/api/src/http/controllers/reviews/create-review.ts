import { and, eq, sql } from 'drizzle-orm'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { Review } from '@/infra/database/mongodb/models/reviews'
import { postgresDb } from '@/infra/database/postgresql/connection'
import { orders, products, users } from '@/infra/database/postgresql/schema'

export async function createReview(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createReviewBodySchema = z.object({
    userId: z.string().uuid(),
    productId: z.string().uuid(),
    rating: z.number().min(1).max(5),
    title: z.string(),
    comment: z.string(),
  })

  const { userId, productId, rating, title, comment } =
    createReviewBodySchema.parse(request.body)

  const [user] = await postgresDb
    .select()
    .from(users)
    .where(eq(users.id, userId))

  if (!user) {
    throw new Error('User not found')
  }

  const [product] = await postgresDb
    .select()
    .from(products)
    .where(eq(products.id, productId))

  if (!product) {
    throw new Error('Product not found')
  }

  const userDeliveredOrders = await postgresDb
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.userId, userId),
        eq(orders.status, 'delivered'),
        sql`EXISTS (
          SELECT 1 FROM jsonb_array_elements(${orders.items}) AS item
          WHERE item->>'productId' = ${productId}
        )`,
      ),
    )

  if (userDeliveredOrders.length <= 0) {
    throw new Error('User need at least one delivered order to make a review')
  }

  const userReviews = await Review.find({
    userId,
    productId,
  })
    .select('*')
    .exec()

  if (userReviews.length >= userDeliveredOrders.length) {
    throw new Error('User already make a review for this product')
  }

  const review = await Review.create({
    title,
    comment,
    rating,
    userId,
    productId,
  })

  return reply.status(201).send({
    review,
  })
}
