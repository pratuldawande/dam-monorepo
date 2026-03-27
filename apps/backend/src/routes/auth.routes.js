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
router.get("/me", authMiddleware, authController.getProfile);
router.get("/users", authMiddleware, authController.listUsers);

module.exports = router;
