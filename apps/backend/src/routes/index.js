import express from 'express'
import assetRoutes from '@/routes/asset.routes'
import authRoutes from '@/routes/auth.routes'

const router = express.Router()

// Mount authentication routes
router.use('/auth', authRoutes)

// Mount project-related routes
router.use('/assets', assetRoutes)

export default router
