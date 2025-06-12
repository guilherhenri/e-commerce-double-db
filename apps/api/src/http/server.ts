import { fastifyCors } from '@fastify/cors'
import { fastify } from 'fastify'

import { mongoDb } from '@/infra/database/mongodb/connection'

const app = fastify()

app.register(fastifyCors, { origin: '*' })

const runServer = async () => {
  await mongoDb()

  app.listen({ port: 3333 }).then(() => {
    console.log('HTTP Server Running!')
  })
}

runServer()
