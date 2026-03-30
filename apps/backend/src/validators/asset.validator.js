const { body, query } = require('express-validator')
const { MAX_FILE_SIZE_BYTES } = require('../config/env')

exports.assetUploadValidator = [
  body('_assetUpload').custom((_, { req }) => {
    const files = req.files || []

    if (!Array.isArray(files) || files.length === 0) {
      throw new Error('At least one file is required')
    }
    files.forEach((file) => {
      if (!file.originalname) {
        throw new Error('Each uploaded file must have an original name')
      }

      if (!file.mimetype) {
        throw new Error('Each uploaded file must include a MIME type')
      }

      if (!Number.isFinite(file.size) || file.size <= 0) {
        throw new Error('Each uploaded file must have a valid size')
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        throw new Error('Uploaded file exceeds the configured size limit')
      }
    })

    return true
  }),
]

exports.assetListValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be an integer greater than 0')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be an integer between 1 and 100')
    .toInt(),
  query('search').optional().isString().withMessage('search must be a string').trim(),
  query('status')
    .optional()
    .isIn(['queued', 'processing', 'completed', 'failed'])
    .withMessage('status must be one of queued, processing, completed, or failed'),
  query('type')
    .optional()
    .isIn(['image', 'video', 'other'])
    .withMessage('type must be one of image, video, or other'),
]

exports.assetShareValidator = [
  body('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isMongoId()
    .withMessage('userId must be a valid user id'),
]
