import express from 'express'
import { API_ROUTES, API_VERSION, HTTP_STATUS } from '@/constants'
import assetRoutes from '@/routes/asset.routes'
import authRoutes from '@/routes/auth.routes'

const router = express.Router()

router.get('/', (req, res) => {
  res.status(HTTP_STATUS.ok).json({
    success: true,
    data: {
      version: API_VERSION,
      basePath: API_ROUTES.base,
      endpoints: {
        auth: `${API_ROUTES.base}${API_ROUTES.auth}`,
        assets: `${API_ROUTES.base}${API_ROUTES.assets}`,
      },
    },
  })
})

router.use(API_ROUTES.auth, authRoutes)
router.use(API_ROUTES.assets, assetRoutes)

export default router
