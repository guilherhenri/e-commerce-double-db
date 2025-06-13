import type { FastifyInstance } from 'fastify'

import { createCategory } from './controllers/categories/create-category'
import { deleteCategory } from './controllers/categories/delete-category'
import { getCategory } from './controllers/categories/get-category'
import { listCategories } from './controllers/categories/list-categories'
import { updateCategory } from './controllers/categories/update-category'
import { createOrder } from './controllers/orders/create-order'
import { getOrder } from './controllers/orders/get-order'
import { listOrders } from './controllers/orders/list-orders'
import { updateOrderStatus } from './controllers/orders/update-order-status'
import { createProduct } from './controllers/products/create-product'
import { deleteProduct } from './controllers/products/delete-product'
import { getProduct } from './controllers/products/get-product'
import { listProducts } from './controllers/products/list-products'
import { updateProduct } from './controllers/products/update-product'
import { createReview } from './controllers/reviews/create-review'
import { deleteReview } from './controllers/reviews/delete-review'
import { getProductReviews } from './controllers/reviews/get-product-reviews'
import { getReview } from './controllers/reviews/get-review'
import { updateReview } from './controllers/reviews/update-review'
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

  app.get('/products', listProducts)
  app.get('/products/:id', getProduct)
  app.post('/products', createProduct)
  app.put('/products/:id', updateProduct)
  app.delete('/products/:id', deleteProduct)

  app.get('/orders', listOrders)
  app.get('/orders/:id', getOrder)
  app.post('/orders', createOrder)
  app.patch('/orders/:id/status', updateOrderStatus)

  app.get('/reviews/product/:productId', getProductReviews)
  app.get('/reviews/:id', getReview)
  app.post('/reviews', createReview)
  app.put('/reviews/:id', updateReview)
  app.delete('/reviews/:id', deleteReview)
}
