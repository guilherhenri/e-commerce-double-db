import { eq } from 'drizzle-orm'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { postgresDb } from '@/infra/database/postgresql/connection'
import { orders, orderStatusEnum } from '@/infra/database/postgresql/schema'

const statusSequence = [
  'pending',
  'paid',
  'preparing',
  'shipping',
  'delivered',
] as const

type OrderStatus = (typeof orderStatusEnum.enumValues)[number]

function validateStatusTransition(
  currentStatus: OrderStatus,
  newStatus: OrderStatus,
): boolean {
  if (currentStatus === 'canceled') {
    return false
  }

  if (newStatus === 'canceled') {
    return true
  }

  const currentIndex = statusSequence.indexOf(currentStatus)
  const newIndex = statusSequence.indexOf(newStatus)

  if (currentIndex === -1 || newIndex === -1) {
    return false
  }

  return newIndex === currentIndex + 1
}

export async function updateOrderStatus(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateOrderStatusParamsSchema = z.object({
    id: z.string().uuid(),
  })
  const updateOrderStatusBodySchema = z.object({
    status: z.enum(orderStatusEnum.enumValues),
  })

  const { id } = updateOrderStatusParamsSchema.parse(request.params)
  const { status } = updateOrderStatusBodySchema.parse(request.body)

  const [order] = await postgresDb
    .select()
    .from(orders)
    .where(eq(orders.id, id))

  if (!order) {
    throw new Error('Order not found')
  }

  if (!validateStatusTransition(order.status, status)) {
    throw new Error('Invalid next status')
  }

  const [updatedOrder] = await postgresDb
    .update(orders)
    .set({
      status,
    })
    .where(eq(orders.id, id))
    .returning()

  return reply.status(201).send({
    order: updatedOrder,
  })
}
