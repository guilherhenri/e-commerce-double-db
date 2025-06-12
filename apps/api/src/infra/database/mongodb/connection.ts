import { connect } from 'mongoose'

import { env } from '@/config/env'

export const mongoDb = async () => await connect(env.MONGO_DATABASE_URL)
