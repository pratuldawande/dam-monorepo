import express from 'express'
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
  '/upload',
  upload.array('files'),
  assetUploadValidator,
  validate,
  assetController.uploadAssets
)
router.post('/:assetId/share', assetShareValidator, validate, assetController.shareAsset)
router.delete('/:assetId', assetController.deleteAsset)

export default router
