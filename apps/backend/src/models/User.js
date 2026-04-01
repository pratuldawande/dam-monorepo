/**
 * User Model
 * Defines schema for user authentication and profile management
 */

import * as bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // User's email - unique identifier for login
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    },
    // Hashed password - never stored in plain text
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Exclude password by default in queries
    },
  },
  {
    timestamps: true,
  }
)

/**
 * Hash password before saving to database
 * Only hash if password is new or modified
 */
userSchema.pre('save', async function (next) {
  // Skip hashing if password hasn't been modified
  if (!this.isModified('password')) {
    return next()
  }

  try {
    // Generate salt and hash password with cost factor of 10
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  } catch (error) {
    // Throw error to be caught by save operation
    throw error
  }
})

/**
 * Compare provided password with stored hashed password
 * @param {string} candidatePassword - Password to verify
 * @returns {Promise<boolean>} True if passwords match
 */
userSchema.methods.matchPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model('User', userSchema)
