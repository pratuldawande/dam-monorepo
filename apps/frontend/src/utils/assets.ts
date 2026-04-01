import { type Asset } from '@/api/asset.api'

export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50]

export const formatBytes = (bytes?: number) => {
  if (!bytes) {
    return '0 B'
  }

  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

export const formatDate = (value?: string) => {
  if (!value) {
    return 'NA'
  }

  return new Date(value).toLocaleString()
}

export const getAssetPreview = (asset: Asset) => {
  if (asset.type?.startsWith('image/')) {
    return asset.url
  }

  return asset.metadata?.thumbnails?.[0]?.url
}

export const getAssetPlaceholder = (asset: Asset) => {
  const normalizedType = (asset.type || '').toLowerCase()
  const isImage = normalizedType.startsWith('image/')
  const isVideo = normalizedType.startsWith('video/')

  const label = isImage ? 'IMAGE' : isVideo ? 'VIDEO' : 'FILE'
  const bgStart = isImage ? '#0ea5e9' : isVideo ? '#f97316' : '#64748b'
  const bgEnd = isImage ? '#2563eb' : isVideo ? '#dc2626' : '#334155'
  const badge = isImage ? '#dbeafe' : isVideo ? '#ffedd5' : '#e2e8f0'
  const badgeText = isImage ? '#1d4ed8' : isVideo ? '#c2410c' : '#334155'
  const icon = isImage ? 'IMG' : isVideo ? 'VID' : 'DOC'

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><defs><linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="${bgStart}"/><stop offset="100%" stop-color="${bgEnd}"/></linearGradient></defs><rect width="320" height="180" fill="url(#bg)"/><rect x="20" y="20" width="84" height="30" rx="15" fill="${badge}"/><text x="62" y="40" text-anchor="middle" font-size="14" font-family="Arial, sans-serif" font-weight="700" fill="${badgeText}">${icon}</text><text x="160" y="102" text-anchor="middle" font-size="30" font-family="Arial, sans-serif" font-weight="700" fill="#ffffff">${label}</text></svg>`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export const getAssetOwner = (asset: Asset) => {
  if (asset.userId && typeof asset.userId === 'object') {
    return asset.userId
  }

  return undefined
}

export const getAssetOwnerId = (asset: Asset) => {
  if (asset.userId && typeof asset.userId === 'object') {
    return asset.userId._id
  }

  return asset.userId
}
