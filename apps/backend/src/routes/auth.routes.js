/**
 * Authentication routes
 * Defines endpoints for user registration, login, and logout
 */

import express from 'express'
import * as authController from '@/controllers/auth.controller'
import authMiddleware from '@/middlewares/auth.middleware'
import { validate } from '@/middlewares/validate.middleware'
import { createUserValidator, loginUserValidator } from '@/validators/user.validator'

const router = express.Router()

// Public routes
router.post('/register', createUserValidator, validate, authController.register)
router.post('/login', loginUserValidator, validate, authController.login)
router.post('/logout', authMiddleware, authController.logout)
router.get('/me', authMiddleware, authController.getProfile)
router.get('/users', authMiddleware, authController.listUsers)

export default router
