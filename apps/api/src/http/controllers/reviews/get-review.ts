import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { Review } from '@/infra/database/mongodb/models/reviews'

export async function getReview(request: FastifyRequest, reply: FastifyReply) {
  const getReviewParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = getReviewParamsSchema.parse(request.params)

  const review = await Review.findById(id)

  if (!review) {
    throw new Error('Review not found')
  }

  return reply.send({
    review,
  })
}
