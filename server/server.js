import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { clerkMiddleware, requireAuth } from '@clerk/express'
import connectDB from './config/db.js'
import aiRoutes from './routes/interview.route.js'

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())
app.use(requireAuth())



const PORT = process.env.PORT || 3000


app.use('api/interview', aiRoutes)

app.listen(PORT, () => {
    console.log(`Server is Running on PORT ${PORT}`)
})
