import { fastifyCors } from '@fastify/cors'
import { fastify } from 'fastify'

import { env } from '@/config/env'
import { mongoDb } from '@/infra/database/mongodb/connection'

import { routes } from './routes'

const app = fastify()

app.register(fastifyCors, { origin: '*' })

app.register(routes, {
  prefix: '/api/v1',
})

const runServer = async () => {
  await mongoDb()

  app.listen({ port: env.PORT }).then(() => {
    console.log('HTTP Server Running!')
  })
}

runServer()
