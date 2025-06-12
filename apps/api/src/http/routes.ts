import type { FastifyInstance } from 'fastify'

import { profile } from './controllers/users/profile'
import { registerUser } from './controllers/users/register'

export async function routes(app: FastifyInstance) {
  app.get('/users/:id/profile', profile)
  app.post('/users', registerUser)
}
