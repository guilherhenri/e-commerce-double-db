import type { FastifyInstance } from 'fastify'

import { deleteUser } from './controllers/users/delete'
import { listUsers } from './controllers/users/list'
import { profile } from './controllers/users/profile'
import { registerUser } from './controllers/users/register'
import { updateUser } from './controllers/users/update'

export async function routes(app: FastifyInstance) {
  app.get('/users', listUsers)
  app.get('/users/:id/profile', profile)
  app.post('/users', registerUser)
  app.put('/users/:id', updateUser)
  app.delete('/users/:id', deleteUser)
}
