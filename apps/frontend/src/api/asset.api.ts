import API from './axios'

export interface AssetUserSummary {
  _id: string
  name: string
  email: string
}

export interface Asset {
  _id: string
  userId?: string | AssetUserSummary
  sharedWith?: AssetUserSummary[]
  originalName?: string
  name?: string
  url?: string
  type?: string
  size?: number
  status?: string
  metadata?: {
    thumbnails?: Array<{
      url?: string
      objectName?: string
      size?: number
      contentType?: string
    }>
    variants?: Array<{
      url?: string
      objectName?: string
      size?: number
      contentType?: string
      resolution?: string
    }>
  }
  createdAt?: string
  updatedAt?: string
}

export interface AssetQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  type?: string
}

export interface AssetsMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  search: string
  status: string
  type: string
}

export interface GetAssetsResponse {
  success: boolean
  data: Asset[]
  meta: AssetsMeta
}

export interface UploadAssetsResponse {
  success: boolean
  data: Asset[]
}

export interface DeleteAssetResponse {
  success: boolean
  message: string
}

export interface ShareAssetResponse {
  success: boolean
  message: string
  data: Asset
}

export const getAssets = (params?: AssetQueryParams) =>
  API.get<GetAssetsResponse>('/assets', { params }).then((res) => res.data)

export const uploadAssets = (files: File[]) => {
  const formData = new FormData()

  files.forEach((file: File) => formData.append('files', file))

  return API.post<UploadAssetsResponse>('/assets/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data)
}

export const deleteAsset = (assetId: string) =>
  API.delete<DeleteAssetResponse>(`/assets/${assetId}`).then((res) => res.data)

export const shareAsset = (assetId: string, userId: string) =>
  API.post<ShareAssetResponse>(`/assets/${assetId}/share`, { userId }).then((res) => res.data)
