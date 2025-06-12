import { eq } from 'drizzle-orm'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { postgresDb } from '@/infra/database/postgresql/connection'
import { categories } from '@/infra/database/postgresql/schema'

export async function createCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createCategoryBodySchema = z.object({
    name: z.string(),
  })

  const { name } = createCategoryBodySchema.parse(request.body)

  const [categoryAlreadyExists] = await postgresDb
    .select()
    .from(categories)
    .where(eq(categories.name, name))

  if (categoryAlreadyExists) {
    throw new Error('Category already exists')
  }

  const [category] = await postgresDb
    .insert(categories)
    .values({
      name,
    })
    .returning()

  return reply.status(201).send({
    category,
  })
}
