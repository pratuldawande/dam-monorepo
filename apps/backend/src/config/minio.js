import * as Minio from 'minio'
import {
  MINIO_ACCESS_KEY,
  MINIO_BUCKET,
  MINIO_ENDPOINT,
  MINIO_PORT,
  MINIO_SECRET_KEY,
  MINIO_USE_SSL,
} from '@/config/env'

const minioClient = new Minio.Client({
  endPoint: MINIO_ENDPOINT,
  port: parseInt(MINIO_PORT),
  useSSL: MINIO_USE_SSL,
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
})

const policy = {
  Version: '2012-10-17',
  Statement: [
    {
      Action: ['s3:GetObject'],
      Effect: 'Allow',
      Principal: { AWS: ['*'] },
      Resource: [`arn:aws:s3:::${MINIO_BUCKET}/*`],
    },
  ],
}

export const ensureBucketExists = async () => {
  const exists = await minioClient.bucketExists(MINIO_BUCKET)

  if (!exists) {
    await minioClient.makeBucket(MINIO_BUCKET, 'us-east-1')
  }

  await minioClient.setBucketPolicy(MINIO_BUCKET, JSON.stringify(policy))
}

export { minioClient }
