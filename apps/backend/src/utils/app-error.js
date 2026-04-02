import { ERROR_MESSAGES, HTTP_STATUS } from '@/constants'

export class AppError extends Error {
  constructor(message, statusCode = 500, options = {}) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = options.code
    this.details = options.details
  }

  static badRequest(message, options) {
    return new AppError(message, HTTP_STATUS.badRequest, options)
  }

  static unauthorized(message = ERROR_MESSAGES.unauthorized, options) {
    return new AppError(message, HTTP_STATUS.unauthorized, options)
  }

  static forbidden(message = ERROR_MESSAGES.forbidden, options) {
    return new AppError(message, HTTP_STATUS.forbidden, options)
  }

  static notFound(message = ERROR_MESSAGES.notFound, options) {
    return new AppError(message, HTTP_STATUS.notFound, options)
  }

  static conflict(message, options) {
    return new AppError(message, HTTP_STATUS.conflict, options)
  }
}

export default AppError
