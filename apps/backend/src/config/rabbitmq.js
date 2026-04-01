import * as amqp from 'amqplib'
import { RABBITMQ_ASSET_QUEUE, RABBITMQ_URL } from '@/config/env'

let connectionPromise
let channelPromise

export const connectRabbitMQ = async () => {
  if (!connectionPromise) {
    connectionPromise = amqp.connect(RABBITMQ_URL)
  }

  return connectionPromise
}

export const getChannel = async () => {
  if (!channelPromise) {
    channelPromise = connectRabbitMQ().then(async (connection) => {
      const channel = await connection.createChannel()
      await channel.assertQueue(RABBITMQ_ASSET_QUEUE, { durable: true })
      return channel
    })
  }

  return channelPromise
}

export const publishAssetMessage = async (message) => {
  const channel = await getChannel()

  channel.sendToQueue(RABBITMQ_ASSET_QUEUE, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  })
}

export const startAssetConsumer = async (handler) => {
  const channel = await getChannel()
  await channel.prefetch(1)

  await channel.consume(RABBITMQ_ASSET_QUEUE, async (message) => {
    if (!message) {
      return
    }

    try {
      const payload = JSON.parse(message.content.toString())
      await handler(payload)
      channel.ack(message)
    } catch (error) {
      console.error('RabbitMQ asset consumer failed:', error)
      channel.nack(message, false, false)
    }
  })
}
