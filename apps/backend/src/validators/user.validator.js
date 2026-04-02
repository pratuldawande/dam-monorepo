import { body } from 'express-validator'
import { AUTH_FIELDS, VALIDATION_MESSAGES } from '@/constants'

const createUserValidator = [
  body(AUTH_FIELDS.name).notEmpty().withMessage(VALIDATION_MESSAGES.nameRequired),
  body(AUTH_FIELDS.email)
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.emailRequired)
    .isEmail()
    .withMessage(VALIDATION_MESSAGES.invalidEmail),
  body(AUTH_FIELDS.password).isLength({ min: 8 }).withMessage(VALIDATION_MESSAGES.passwordTooShort),
  body(AUTH_FIELDS.confirmPassword).custom((value, { req }) => {
    if (value !== req.body[AUTH_FIELDS.password]) {
      throw new Error(VALIDATION_MESSAGES.passwordsDoNotMatch)
    }
    return true
  }),
]

const loginUserValidator = [
  body(AUTH_FIELDS.email)
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.emailRequired)
    .isEmail()
    .withMessage(VALIDATION_MESSAGES.invalidEmailFormat),

  body(AUTH_FIELDS.password)
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.passwordRequired)
    .isLength({ min: 8 })
    .withMessage(VALIDATION_MESSAGES.passwordTooShort),
]

export { createUserValidator, loginUserValidator }
