import mongoose from 'mongoose'
import { MONGO_URI } from '@/config/env'

export const connectDB = async () => {
  await mongoose.connect(MONGO_URI)
  console.log('MongoDB connected')
}
