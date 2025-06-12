import { eq } from 'drizzle-orm'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { postgresDb } from '@/infra/database/postgresql/connection'
import { categories, products } from '@/infra/database/postgresql/schema'

export async function updateProduct(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateProductParamsSchema = z.object({
    id: z.string().uuid(),
  })
  const updateProductBodySchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    categoryId: z.string().uuid(),
    stock: z.number().min(0),
  })

  const { id } = updateProductParamsSchema.parse(request.params)
  const { name, description, price, categoryId, stock } =
    updateProductBodySchema.parse(request.body)

  const [product] = await postgresDb
    .select()
    .from(products)
    .where(eq(products.id, id))

  if (!product) {
    throw new Error('Product not found')
  }

  if (product.categoryId !== categoryId) {
    const categoryExists = await postgresDb
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))

    if (!categoryExists) {
      throw new Error('Category not found')
    }
  }

  if (price <= 0) {
    throw new Error('Price need be great than 0')
  }

  if (stock < 0) {
    throw new Error('Stock should not be negative')
  }

  const [updatedProduct] = await postgresDb
    .update(products)
    .set({
      name,
      description,
      price: price.toString(),
      categoryId,
      stock,
    })
    .where(eq(products.id, id))
    .returning()

  return reply.send({
    product: updatedProduct,
  })
}
