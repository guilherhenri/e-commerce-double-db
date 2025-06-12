import { defineConfig } from 'drizzle-kit'

import { env } from './src/config/env'

export default defineConfig({
  out: './drizzle',
  schema: './src/infra/database/postgresql/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.POSTGRES_DATABASE_URL,
  },
})
