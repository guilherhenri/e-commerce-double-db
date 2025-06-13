import { eq } from 'drizzle-orm'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { postgresDb } from '@/infra/database/postgresql/connection'
import { categories } from '@/infra/database/postgresql/schema'

export async function getCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getCategoryParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = getCategoryParamsSchema.parse(request.params)

  const [category] = await postgresDb
    .select()
    .from(categories)
    .where(eq(categories.id, id))

  if (!category) {
    throw new Error('Category not found')
  }

  return reply.send({
    category,
  })
}
