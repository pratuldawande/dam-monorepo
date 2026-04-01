import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteAsset,
  getAssets,
  shareAsset,
  uploadAssets,
  type AssetQueryParams,
} from '@/api/asset.api'

export const useAssets = (params?: AssetQueryParams) => {
  const queryClient = useQueryClient()

  const assetsQuery = useQuery({
    queryKey: ['assets', params],
    queryFn: () => getAssets(params),
    placeholderData: (previousData) => previousData,
  })

  const uploadMutation = useMutation({
    mutationFn: uploadAssets,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    },
  })

  const shareMutation = useMutation({
    mutationFn: ({ assetId, userId }: { assetId: string; userId: string }) =>
      shareAsset(assetId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    },
  })

  return {
    ...assetsQuery,
    uploadMutation,
    deleteMutation,
    shareMutation,
  }
}
