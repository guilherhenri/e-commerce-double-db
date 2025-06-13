import { eq } from 'drizzle-orm'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { Review } from '@/infra/database/mongodb/models/reviews'
import { postgresDb } from '@/infra/database/postgresql/connection'
import { products } from '@/infra/database/postgresql/schema'

export async function getProductReviews(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getProductReviewsParamsSchema = z.object({
    productId: z.string().uuid(),
  })

  const { productId } = getProductReviewsParamsSchema.parse(request.params)

  const [product] = await postgresDb
    .select()
    .from(products)
    .where(eq(products.id, productId))

  if (!product) {
    throw new Error('Product not found')
  }

  const reviews = await Review.find({
    productId,
  }).exec()

  return reply.send({
    reviews,
  })
}
