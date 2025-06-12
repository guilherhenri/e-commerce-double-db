import { eq } from 'drizzle-orm'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { postgresDb } from '@/infra/database/postgresql/connection'
import { users } from '@/infra/database/postgresql/schema'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const profileParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = profileParamsSchema.parse(request.params)

  const [user] = await postgresDb.select().from(users).where(eq(users.id, id))

  if (!user) {
    throw new Error('User not found')
  }

  return reply.send({
    user,
  })
}
