import 'dotenv/config'

const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://mongo:27017/dam',
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT || 'minio',
  MINIO_PORT: process.env.MINIO_PORT || 9000,
  MINIO_USE_SSL: process.env.MINIO_USE_SSL === 'true',
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY || 'admin',
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY || 'password',
  MINIO_BUCKET: process.env.MINIO_BUCKET || 'assets',
  MINIO_PUBLIC_BASE_URL: process.env.MINIO_PUBLIC_BASE_URL || '',
  RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672',
  RABBITMQ_ASSET_QUEUE: process.env.RABBITMQ_ASSET_QUEUE || 'asset-processing',
  MAX_FILE_SIZE_BYTES: process.env.MAX_FILE_SIZE_BYTES || `${1024 * 1024 * 1024}`, // Default to 1GB
  UPLOAD_TMP_DIR: process.env.UPLOAD_TMP_DIR || '/tmp/dam-uploads',
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
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
} = env

export default env
