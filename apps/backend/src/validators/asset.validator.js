import { body, query } from 'express-validator'
import {
  ASSET_FIELDS,
  ASSET_MESSAGES,
  ASSET_STATUS,
  ASSET_TYPE,
  AUTH_FIELDS,
  ERROR_MESSAGES,
  VALIDATION_MESSAGES,
} from '@/constants'
import { MAX_FILE_SIZE_BYTES } from '@/config/env'

const assetUploadValidator = [
  body(ASSET_FIELDS.assetUpload).custom((_, { req }) => {
    const files = req.files || []

    if (!Array.isArray(files) || files.length === 0) {
      throw new Error(ASSET_MESSAGES.uploadRequiresFile)
    }
    files.forEach((file) => {
      if (!file.originalname) {
        throw new Error(ASSET_MESSAGES.uploadMissingOriginalName)
      }

      if (!file.mimetype) {
        throw new Error(ASSET_MESSAGES.uploadMissingMimeType)
      }

      if (!Number.isFinite(file.size) || file.size <= 0) {
        throw new Error(ASSET_MESSAGES.uploadInvalidSize)
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        throw new Error(ERROR_MESSAGES.uploadSizeExceeded)
      }
    })

    return true
  }),
]

const assetListValidator = [
  query(ASSET_FIELDS.page)
    .optional()
    .isInt({ min: 1 })
    .withMessage(VALIDATION_MESSAGES.pageInvalid)
    .toInt(),
  query(ASSET_FIELDS.limit)
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage(VALIDATION_MESSAGES.limitInvalid)
    .toInt(),
  query(ASSET_FIELDS.search)
    .optional()
    .isString()
    .withMessage(VALIDATION_MESSAGES.searchInvalid)
    .trim(),
  query(ASSET_FIELDS.status)
    .optional()
    .isIn([
      ASSET_STATUS.queued,
      ASSET_STATUS.processing,
      ASSET_STATUS.completed,
      ASSET_STATUS.failed,
    ])
    .withMessage(VALIDATION_MESSAGES.statusInvalid),
  query(ASSET_FIELDS.type)
    .optional()
    .isIn([ASSET_TYPE.image, ASSET_TYPE.video, ASSET_TYPE.other])
    .withMessage(VALIDATION_MESSAGES.typeInvalid),
]

const assetShareValidator = [
  body(AUTH_FIELDS.userId)
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.userIdRequired)
    .isMongoId()
    .withMessage(VALIDATION_MESSAGES.userIdInvalid),
]

export { assetUploadValidator, assetListValidator, assetShareValidator }
