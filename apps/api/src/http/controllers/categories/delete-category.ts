import { eq } from 'drizzle-orm'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { postgresDb } from '@/infra/database/postgresql/connection'
import { categories } from '@/infra/database/postgresql/schema'

export async function deleteCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteCategoryParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = deleteCategoryParamsSchema.parse(request.params)

  const [category] = await postgresDb
    .select()
    .from(categories)
    .where(eq(categories.id, id))

  if (!category) {
    throw new Error('Category not found')
  }

  await postgresDb.delete(categories).where(eq(categories.id, id))

  return reply.status(204).send()
}
