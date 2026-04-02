import { ERROR_MESSAGES } from '@/constants'
import { FRONTEND_ORIGIN } from '@/config/env'
import AppError from '@/utils/app-error'

const allowedOrigins = FRONTEND_ORIGIN.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

export const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }

    callback(AppError.forbidden(ERROR_MESSAGES.invalidCorsOrigin))
  },
}

export default corsOptions
