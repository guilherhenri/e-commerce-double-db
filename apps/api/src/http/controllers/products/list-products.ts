import { eq } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import type { FastifyReply, FastifyRequest } from 'fastify'

import { postgresDb } from '@/infra/database/postgresql/connection'
import { categories, products } from '@/infra/database/postgresql/schema'

export async function listProducts(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const category = alias(categories, 'category')

  const listProducts = await postgresDb
    .select()
    .from(products)
    .leftJoin(category, eq(products.categoryId, category.id))

  return reply.send({
    products: listProducts,
  })
}
