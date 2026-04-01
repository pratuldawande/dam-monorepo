import app from '@/app'
import { connectDB } from '@/config/db'
import { ensureBucketExists } from '@/config/minio'
import { connectRabbitMQ, startAssetConsumer } from '@/config/rabbitmq'
import { processAsset } from '@/services/asset.service'
import { PORT } from '@/config/env'

const startServer = async () => {
  await connectDB()
  await ensureBucketExists()
  await connectRabbitMQ()
  await startAssetConsumer(processAsset)

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
  })
}

startServer().catch((error) => {
  console.error('Failed to start backend:', error)
  process.exit(1)
})
