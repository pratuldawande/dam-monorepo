/**
 * Authentication controller
 * Handles HTTP requests for login, logout, and registration
 */

import { registerUser, loginUser, getCurrentUser, listExistingUsers } from '@/services/auth.service'

/**
 * Register a new user
 * POST /api/auth/register
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    // Register user via service
    const result = await registerUser(name, email, password)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Login user with email and password
 * POST /api/auth/login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Login user via service
    const result = await loginUser(email, password)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    })
  } catch (error) {
    // Handle specific authentication errors
    if (error.message.includes('Invalid email or password')) {
      return res.status(401).json({
        success: false,
        message: error.message,
      })
    }
    next(error)
  }
}

/**
 * Logout user
 * POST /api/auth/logout
 * Note: JWT tokens are stateless, so logout is handled client-side
 * by removing the token from storage
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful.',
  })
}

/**
 * Get current user profile
 * GET /api/auth/profile
 * Protected route - requires valid JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await getCurrentUser(req.user.userId)
    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

const listUsers = async (req, res, next) => {
  try {
    const users = await listExistingUsers({
      currentUserId: req.user.userId,
      search: req.query.search,
    })

    res.status(200).json({
      success: true,
      data: users,
    })
  } catch (error) {
    next(error)
  }
}

export { register, login, logout, getProfile, listUsers }
