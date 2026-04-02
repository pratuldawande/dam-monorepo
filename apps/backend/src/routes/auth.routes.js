/**
 * Authentication routes
 * Defines endpoints for user registration, login, and logout
 */

import express from 'express'
import { API_ROUTES } from '@/constants'
import * as authController from '@/controllers/auth.controller'
import authMiddleware from '@/middlewares/auth.middleware'
import { validate } from '@/middlewares/validate.middleware'
import { createUserValidator, loginUserValidator } from '@/validators/user.validator'

const router = express.Router()

// Public routes
router.post(API_ROUTES.register, createUserValidator, validate, authController.register)
router.post(API_ROUTES.login, loginUserValidator, validate, authController.login)
router.post(API_ROUTES.logout, authMiddleware, authController.logout)
router.get(API_ROUTES.me, authMiddleware, authController.getProfile)
router.get(API_ROUTES.users, authMiddleware, authController.listUsers)

export default router
