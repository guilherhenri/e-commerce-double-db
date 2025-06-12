import type { FastifyReply, FastifyRequest } from 'fastify'

import { postgresDb } from '@/infra/database/postgresql/connection'
import { users } from '@/infra/database/postgresql/schema'

export async function listUsers(request: FastifyRequest, reply: FastifyReply) {
  const listUsers = await postgresDb.select().from(users)

  return reply.send({
    users: listUsers,
  })
}
