import type { FastifyInstance } from 'fastify'

import { createCategory } from './controllers/categories/create-category'
import { deleteCategory } from './controllers/categories/delete-category'
import { getCategory } from './controllers/categories/get-category'
import { listCategories } from './controllers/categories/list-categories'
import { updateCategory } from './controllers/categories/update-category'
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

  app.get('/categories', listCategories)
  app.get('/categories/:id', getCategory)
  app.post('/categories', createCategory)
  app.put('/categories/:id', updateCategory)
  app.delete('/categories/:id', deleteCategory)
}
