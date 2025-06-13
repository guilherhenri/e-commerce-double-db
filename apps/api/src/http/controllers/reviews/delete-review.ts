import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { Review } from '@/infra/database/mongodb/models/reviews'

export async function deleteReview(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteReviewParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = deleteReviewParamsSchema.parse(request.params)

  const review = await Review.findById(id)

  if (!review) {
    throw new Error('Review not found')
  }

  await review.deleteOne()

  return reply.status(204).send()
}
