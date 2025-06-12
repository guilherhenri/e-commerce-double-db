import { drizzle } from 'drizzle-orm/node-postgres'

import { env } from '@/config/env'

export const postgresDb = drizzle(env.POSTGRES_DATABASE_URL)
