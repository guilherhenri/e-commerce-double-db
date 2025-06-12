import { model } from 'mongoose'

import { type Reviews, reviewsSchema } from '../schemas/reviews'

export const Review = model<Reviews>('reviews', reviewsSchema)
