import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { clerkMiddleware, requireAuth } from '@clerk/express'
import connectDB from './config/db.js'

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())
app.use(requireAuth())



const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    console.log("Hello Server")
    res.send("Hello Server")
})

// import aiRoutes from './routes/aiRoutes.js'
// app.use('/api/ai', aiRoutes)

app.listen(PORT, () => {
    console.log(`Server is Running on PORT ${PORT}`)
})
