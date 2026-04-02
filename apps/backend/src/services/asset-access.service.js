import {
  MINIO_BUCKET,
  MINIO_ENDPOINT,
  MINIO_PORT,
  MINIO_PUBLIC_BASE_URL,
  MINIO_USE_SSL,
} from '@/config/env'

const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '')

const buildAssetAccessUrl = ({ objectName }) => {
  if (!objectName) {
    return undefined
  }

  if (MINIO_PUBLIC_BASE_URL) {
    return `${trimTrailingSlash(MINIO_PUBLIC_BASE_URL)}/${MINIO_BUCKET}/${objectName}`
  }

  const protocol = MINIO_USE_SSL === 'true' ? 'https' : 'http'

  return `${protocol}://${MINIO_ENDPOINT}:${MINIO_PORT}/${MINIO_BUCKET}/${objectName}`
}

const withAccessUrl = async (file) => ({
  ...file,
  url: buildAssetAccessUrl({
    objectName: file?.objectName,
  }),
})

export const serializeAsset = async (asset) => {
  if (!asset) {
    return asset
  }

  const thumbnails = await Promise.all((asset.metadata?.thumbnails || []).map(withAccessUrl))
  const variants = await Promise.all((asset.metadata?.variants || []).map(withAccessUrl))

  return {
    ...asset,
    url: buildAssetAccessUrl({
      objectName: asset.filename,
    }),
    metadata: asset.metadata
      ? {
          ...asset.metadata,
          thumbnails,
          variants,
        }
      : asset.metadata,
  }
}

export const serializeAssets = (assets) => Promise.all(assets.map(serializeAsset))
