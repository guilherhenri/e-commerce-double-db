import { eq } from 'drizzle-orm'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { postgresDb } from '@/infra/database/postgresql/connection'
import { products } from '@/infra/database/postgresql/schema'

export async function deleteProduct(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteProductParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = deleteProductParamsSchema.parse(request.params)

  const [productExists] = await postgresDb
    .select()
    .from(products)
    .where(eq(products.id, id))

  if (!productExists) {
    throw new Error('Product not found')
  }

  await postgresDb.delete(products).where(eq(products.id, id))

  return reply.status(204).send()
}
