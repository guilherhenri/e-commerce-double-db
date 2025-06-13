import { eq } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { postgresDb } from '@/infra/database/postgresql/connection'
import { categories, products } from '@/infra/database/postgresql/schema'

export async function getProduct(request: FastifyRequest, reply: FastifyReply) {
  const getProductParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = getProductParamsSchema.parse(request.params)

  const category = alias(categories, 'category')

  const [product] = await postgresDb
    .select()
    .from(products)
    .where(eq(products.id, id))
    .leftJoin(category, eq(products.categoryId, category.id))

  if (!product) {
    throw new Error('Product not found')
  }

  return reply.send({
    product,
  })
}
