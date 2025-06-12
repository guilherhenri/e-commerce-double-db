import { eq } from 'drizzle-orm'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { postgresDb } from '@/infra/database/postgresql/connection'
import { users } from '@/infra/database/postgresql/schema'

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  const updateUserParamsSchema = z.object({
    id: z.string().uuid(),
  })
  const updateUserBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
  })

  const { id } = updateUserParamsSchema.parse(request.params)
  const { name, email } = updateUserBodySchema.parse(request.body)

  const [user] = await postgresDb.select().from(users).where(eq(users.id, id))

  if (!user) {
    throw new Error('User not found')
  }

  if (user.email !== email) {
    const [emailAlreadyInUse] = await postgresDb
      .select()
      .from(users)
      .where(eq(users.email, email))

    if (emailAlreadyInUse) {
      throw new Error('Email already in use')
    }
  }

  const [updatedUser] = await postgresDb
    .update(users)
    .set({
      name,
      email,
    })
    .where(eq(users.id, id))
    .returning()

  return reply.send({
    user: updatedUser,
  })
}
