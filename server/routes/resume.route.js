import { requireAuth } from '@clerk/express'
import express from 'express'
import multer from 'multer'
import { uploadAndAnalyzeResume } from '../controller/resume.controller.js'

const router = express.Router()


const upload = multer({ storage: multer.memoryStorage() })

router.post('/upload', requireAuth(), upload.single('resume'), uploadAndAnalyzeResume)

export default router