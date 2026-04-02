import cors from 'cors'
import express from 'express'
import { API_ROUTES, API_VERSION, API_VERSION_HEADER } from '@/constants'
import corsOptions from '@/config/cors'
import passport from '@/config/passport'
import errorMiddleware from '@/middlewares/error.middleware'
import routes from '@/routes/index'

const app = express()
app.use(cors(corsOptions))
app.use(passport.initialize())
app.use(express.json({ limit: '1gb' }))
app.use((req, res, next) => {
  res.setHeader(API_VERSION_HEADER, API_VERSION)
  next()
})
app.use(API_ROUTES.base, routes)
app.use(errorMiddleware)

export default app
