import { validationResult } from 'express-validator'
import { ERROR_MESSAGES } from '@/constants'
import AppError from '@/utils/app-error'

const validate = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return next(
      AppError.badRequest(ERROR_MESSAGES.validationFailed, {
        details: errors.array(),
      })
    )
  }

  next()
}

export { validate }
