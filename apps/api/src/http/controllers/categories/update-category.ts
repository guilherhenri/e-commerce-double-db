import { eq } from 'drizzle-orm'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { postgresDb } from '@/infra/database/postgresql/connection'
import { categories } from '@/infra/database/postgresql/schema'

export async function updateCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateCategoryParamsSchema = z.object({
    id: z.string().uuid(),
  })
  const updateCategoryBodySchema = z.object({
    name: z.string(),
  })

  const { id } = updateCategoryParamsSchema.parse(request.params)
  const { name } = updateCategoryBodySchema.parse(request.body)

  const [category] = await postgresDb
    .select()
    .from(categories)
    .where(eq(categories.id, id))

  if (!category) {
    throw new Error('Category not found')
  }

  const [updatedCategory] = await postgresDb
    .update(categories)
    .set({
      name,
    })
    .where(eq(categories.id, id))
    .returning()

  return reply.status(201).send({
    category: updatedCategory,
  })
}
