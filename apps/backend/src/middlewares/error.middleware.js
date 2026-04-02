import { ERROR_MESSAGES, HTTP_STATUS } from '@/constants'

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(HTTP_STATUS.payloadTooLarge).json({
      success: false,
      message: ERROR_MESSAGES.uploadSizeExceeded,
    })
  }

  res.status(err.statusCode || err.status || HTTP_STATUS.internalServerError).json({
    success: false,
    message: err.message || ERROR_MESSAGES.internalServerError,
    ...(err.details ? { details: err.details } : {}),
  })
}

export default errorMiddleware
