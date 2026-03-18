/**
 * Authentication routes
 * Defines endpoints for user registration, login, and logout
 */

const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { createUserValidator, loginUserValidator } = require("../validators/user.validator");
const { validate } = require("../middlewares/validate.middleware");

const router = express.Router();

// Public routes
router.post("/register", createUserValidator, validate, authController.register);
router.post("/login", loginUserValidator, validate, authController.login);
router.post("/logout", authMiddleware, authController.logout);

// Protected routes - require valid JWT token
// router.get("/profile", authMiddleware, authController.getProfile);

module.exports = router;
