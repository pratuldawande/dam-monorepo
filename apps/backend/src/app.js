import cors from 'cors'
import express from 'express'
import passport from '@/config/passport'
import errorMiddleware from '@/middlewares/error.middleware'
import routes from '@/routes/index'

const app = express()
app.use(cors()) //add FE url to cors options in production
app.use(passport.initialize())
app.use(express.json({ limit: '10mb' }))
app.use('/api', routes)
app.use(errorMiddleware)

export default app
