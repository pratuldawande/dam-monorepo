const express = require('express')
const router = express.Router()
const authRoutes = require('./auth.routes')
const asset = require('./asset.routes')

// Mount authentication routes
router.use('/auth', authRoutes)

// Mount project-related routes
router.use('/assets', asset)

module.exports = router
