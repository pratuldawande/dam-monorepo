import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
})

const env = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
  MINIO_PORT: process.env.MINIO_PORT,
  MINIO_USE_SSL: process.env.MINIO_USE_SSL,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
  MINIO_BUCKET: process.env.MINIO_BUCKET,
  MINIO_PUBLIC_BASE_URL: process.env.MINIO_PUBLIC_BASE_URL,
  RABBITMQ_URL: process.env.RABBITMQ_URL,
  RABBITMQ_ASSET_QUEUE: process.env.RABBITMQ_ASSET_QUEUE,
  MAX_FILE_SIZE_BYTES: process.env.MAX_FILE_SIZE_BYTES,
  UPLOAD_TMP_DIR: process.env.UPLOAD_TMP_DIR,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
}

export const {
  PORT,
  MONGO_URI,
  MINIO_ENDPOINT,
  MINIO_PORT,
  MINIO_USE_SSL,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_BUCKET,
  MINIO_PUBLIC_BASE_URL,
  RABBITMQ_URL,
  RABBITMQ_ASSET_QUEUE,
  MAX_FILE_SIZE_BYTES,
  UPLOAD_TMP_DIR,
  JWT_SECRET,
  JWT_EXPIRE,
  FRONTEND_ORIGIN,
} = env

export default env
