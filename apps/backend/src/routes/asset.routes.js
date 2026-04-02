import express from 'express'
import { API_ROUTES, ASSET_FIELDS } from '@/constants'
import * as assetController from '@/controllers/asset.controller'
import authMiddleware from '@/middlewares/auth.middleware'
import { validate } from '@/middlewares/validate.middleware'
import upload from '@/utils/upload'
import {
  assetListValidator,
  assetShareValidator,
  assetUploadValidator,
} from '@/validators/asset.validator'

const router = express.Router()
router.use(authMiddleware)
router.get('/', assetListValidator, validate, assetController.listAssets)
router.post(
  API_ROUTES.upload,
  upload.array(ASSET_FIELDS.files),
  assetUploadValidator,
  validate,
  assetController.uploadAssets
)
router.post(API_ROUTES.share, assetShareValidator, validate, assetController.shareAsset)
router.delete(API_ROUTES.deleteAsset, assetController.deleteAsset)

export default router
