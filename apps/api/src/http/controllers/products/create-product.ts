import { eq } from 'drizzle-orm'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { postgresDb } from '@/infra/database/postgresql/connection'
import { categories, products } from '@/infra/database/postgresql/schema'

export async function createProduct(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createProductBodySchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    categoryId: z.string().uuid(),
    stock: z.number().min(0),
  })

  const { name, description, price, categoryId, stock } =
    createProductBodySchema.parse(request.body)

  const categoryExists = await postgresDb
    .select()
    .from(categories)
    .where(eq(categories.id, categoryId))

  if (!categoryExists) {
    throw new Error('Category not found')
  }

  if (price <= 0) {
    throw new Error('Price need be great than 0')
  }

  if (stock < 0) {
    throw new Error('Stock should not be negative')
  }

  const [product] = await postgresDb
    .insert(products)
    .values({
      name,
      description,
      price: price.toString(),
      categoryId,
      stock,
    })
    .returning()

  return reply.status(201).send({
    product,
  })
}
