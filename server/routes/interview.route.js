import express from 'express'
import { startInterview } from '../controller/interview.controller.js'


const router = express.Router()

router.post('/start', startInterview )


export default router