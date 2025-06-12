import type { FastifyInstance } from 'fastify'

import { profile } from './controllers/users/profile'
import { registerUser } from './controllers/users/register'
import { updateUser } from './controllers/users/update'

export async function routes(app: FastifyInstance) {
  app.get('/users/:id/profile', profile)
  app.post('/users', registerUser)
  app.put('/users/:id', updateUser)
}
