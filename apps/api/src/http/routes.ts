import type { FastifyInstance } from 'fastify'

import { registerUser } from './controllers/users/register'

export async function routes(app: FastifyInstance) {
  app.post('/users', registerUser)
}
