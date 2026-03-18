/**
 * Authentication service
 * Handles user registration, login, and token generation
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET, JWT_EXPIRE } = require("../config/env");

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
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("Email already registered");
    error.status = 404;
    throw error;
  }

  // Create new user (password will be hashed in pre-save hook)
  const user = new User({ name, email, password });
  await user.save();

  // Generate JWT token
  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

/**
 * Login user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} User object and JWT token
 * @throws {Error} If credentials are invalid
 */
const loginUser = async (email, password) => {
  // Fetch user including password field (normally excluded)
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    const error = new Error("Invalid email or password");
    error.status = 404;
    throw error;
  }

  // Verify password matches stored hash
  const isPasswordValid = await user.matchPassword(password);

  if (!isPasswordValid) {
    // throw new Error("Invalid email or password");
    const error = new Error("Invalid email or password");
    error.status = 404;
    throw error;
  }

  // Generate JWT token
  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

/**
 * Generate JWT token for user
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {string} Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

module.exports = {
  registerUser,
  loginUser,
  generateToken,
};
