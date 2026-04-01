import * as assetService from '@/services/asset.service'

const listAssets = async (req, res, next) => {
  try {
    const response = await assetService.listAssets({
      ...req.query,
      userId: req.user?.userId,
    })
    res.json(response)
  } catch (err) {
    next(err)
  }
}

const uploadAssets = async (req, res, next) => {
  try {
    const files = req.files || []
    const userId = req.user?.userId

    const uploads = await assetService.uploadAssets({ files, userId })

    res.json({
      success: true,
      message: 'Assets uploaded successfully',
      data: uploads,
    })
  } catch (err) {
    next(err)
  }
}

const deleteAsset = async (req, res, next) => {
  try {
    const response = await assetService.deleteAsset({
      assetId: req.params.assetId,
      userId: req.user?.userId,
    })

    res.json(response)
  } catch (err) {
    next(err)
  }
}

const shareAsset = async (req, res, next) => {
  try {
    const response = await assetService.shareAssetWithUser({
      assetId: req.params.assetId,
      ownerId: req.user?.userId,
      targetUserId: req.body.userId,
    })

    res.json(response)
  } catch (err) {
    next(err)
  }
}

export { listAssets, deleteAsset, shareAsset, uploadAssets }
