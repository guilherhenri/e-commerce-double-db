import { Schema } from 'mongoose'

export interface Reviews {
  productId: string
  userId: string
  rating: number
  title: string
  comment: string
  createdAt: Date
}

export const reviewsSchema = new Schema<Reviews>({
  productId: { type: String, required: true, index: true },
  userId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: String,
  comment: String,
  createdAt: { type: Date, default: Date.now },
})
