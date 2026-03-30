const amqp = require('amqplib')
const { RABBITMQ_ASSET_QUEUE, RABBITMQ_URL } = require('./env')

let connectionPromise
let channelPromise

const connectRabbitMQ = async () => {
  if (!connectionPromise) {
    connectionPromise = amqp.connect(RABBITMQ_URL)
  }

  return connectionPromise
}

const getChannel = async () => {
  if (!channelPromise) {
    channelPromise = connectRabbitMQ().then(async (connection) => {
      const channel = await connection.createChannel()
      await channel.assertQueue(RABBITMQ_ASSET_QUEUE, { durable: true })
      return channel
    })
  }

  return channelPromise
}

const publishAssetMessage = async (message) => {
  const channel = await getChannel()

  channel.sendToQueue(RABBITMQ_ASSET_QUEUE, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  })
}

const startAssetConsumer = async (handler) => {
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

module.exports = {
  connectRabbitMQ,
  getChannel,
  publishAssetMessage,
  startAssetConsumer,
}
