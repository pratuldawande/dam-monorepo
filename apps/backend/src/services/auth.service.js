/**
 * Authentication service
 * Handles user registration, login, and token generation
 */

import * as jwt from 'jsonwebtoken'
import { AUTH_MESSAGES } from '@/constants'
import { JWT_EXPIRE, JWT_SECRET } from '@/config/env'
import * as userRepository from '@/repositories/user.repository'
import AppError from '@/utils/app-error'

/**
 * Register a new user
 * @param {string} name - User's full name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} User object and JWT token
 * @throws {Error} If user already exists or validation fails
 */
const registerUser = async (name, email, password) => {
  // Check if user already exists
  const existingUser = await userRepository.findByEmail(email)
  if (existingUser) {
    throw AppError.conflict(AUTH_MESSAGES.emailAlreadyRegistered)
  }

  // Create new user (password will be hashed in pre-save hook)
  const user = await userRepository.createUser({ name, email, password })

  // Generate JWT token
  const token = generateToken(user._id)

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  }
}

/**
 * Login user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} User object and JWT token
 * @throws {Error} If credentials are invalid
 */
const loginUser = async (email, password) => {
  // Fetch user including password field (normally excluded)
  const user = await userRepository.findByEmail(email, { includePassword: true })

  if (!user) {
    throw AppError.unauthorized(AUTH_MESSAGES.invalidCredentials)
  }

  // Verify password matches stored hash
  const isPasswordValid = await user.matchPassword(password)

  if (!isPasswordValid) {
    throw AppError.unauthorized(AUTH_MESSAGES.invalidCredentials)
  }

  // Generate JWT token
  const token = generateToken(user._id)

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  }
}

const getCurrentUser = async (userId) => {
  const user = await userRepository.findById(userId)

  if (!user) {
    throw AppError.notFound(AUTH_MESSAGES.userNotFound)
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  }
}

const listExistingUsers = async ({ currentUserId, search } = {}) => {
  const filter = {}

  if (currentUserId) {
    filter._id = { $ne: currentUserId }
  }

  if (search?.trim()) {
    const normalizedSearch = search.trim()
    filter.$or = [
      { name: { $regex: normalizedSearch, $options: 'i' } },
      { email: { $regex: normalizedSearch, $options: 'i' } },
    ]
  }

  const users = await userRepository.listExistingUsers(filter)

  return users.map((user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
  }))
}

/**
 * Generate JWT token for user
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {string} Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE })
}

export { registerUser, loginUser, getCurrentUser, listExistingUsers, generateToken }
