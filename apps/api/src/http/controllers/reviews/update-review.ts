import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { Review } from '@/infra/database/mongodb/models/reviews'

export async function updateReview(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateReviewParamsSchema = z.object({
    id: z.string(),
  })
  const updateReviewBodySchema = z.object({
    rating: z.number().min(1).max(5),
    title: z.string(),
    comment: z.string(),
  })

  const { id } = updateReviewParamsSchema.parse(request.params)
  const { rating, title, comment } = updateReviewBodySchema.parse(request.body)

  const review = await Review.findById(id)

  if (!review) {
    throw new Error('Review not found')
  }

  review.title = title
  review.comment = comment
  review.rating = rating

  await review.save()

  return reply.send({
    review,
  })
}
