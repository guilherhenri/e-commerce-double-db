import { eq } from 'drizzle-orm'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { postgresDb } from '@/infra/database/postgresql/connection'
import { users } from '@/infra/database/postgresql/schema'

export async function registerUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
  })

  const { name, email } = registerBodySchema.parse(request.body)

  const [emailAlreadyInUse] = await postgresDb
    .select()
    .from(users)
    .where(eq(users.email, email))

  if (emailAlreadyInUse) {
    throw new Error('Email already in use')
  }

  const [user] = await postgresDb
    .insert(users)
    .values({
      name,
      email,
    })
    .returning()

  return reply.status(201).send({
    user,
  })
}
