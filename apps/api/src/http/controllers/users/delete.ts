import { eq } from 'drizzle-orm'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { postgresDb } from '@/infra/database/postgresql/connection'
import { users } from '@/infra/database/postgresql/schema'

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  const deleteUserParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = deleteUserParamsSchema.parse(request.params)

  const [user] = await postgresDb.select().from(users).where(eq(users.id, id))

  if (!user) {
    throw new Error('User not found')
  }

  await postgresDb.delete(users).where(eq(users.id, id))

  return reply.status(204).send()
}
