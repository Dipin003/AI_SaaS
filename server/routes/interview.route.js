import express from 'express'
// 1. Import BOTH controllers here
import { startInterview, submitAnswer } from '../controller/interview.controller.js'
import { requireAuth } from '@clerk/express' // Don't forget auth!

const router = express.Router()

// Route 1: Start the interview
router.post('/start', requireAuth(), startInterview)

// Route 2: Submit an answer (Add this line)
router.post('/answer', requireAuth(), submitAnswer)

export default router