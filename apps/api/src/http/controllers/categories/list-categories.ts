import type { FastifyReply, FastifyRequest } from 'fastify'

import { postgresDb } from '@/infra/database/postgresql/connection'
import { categories } from '@/infra/database/postgresql/schema'

export async function listCategories(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listCategories = await postgresDb.select().from(categories)

  return reply.send({
    categories: listCategories,
  })
}
