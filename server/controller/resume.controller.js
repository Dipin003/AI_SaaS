import * as pdf from 'pdf-parse';
import Resume from '../models/resume.model.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const uploadAndAnalyzeResume = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        // 1. Extract Text from PDF
        const dataBuffer = req.file.buffer;
        const pdfData = await pdf(dataBuffer);
        const extractedText = pdfData.text;

        // 2. Ask Gemini to analyze the resume
        const prompt = `
            Analyze the following resume text and provide feedback in a structured format:
            1. ATS Score (out of 100).
            2. List of 3 Strengths.
            3. List of 3 Areas for Improvement.
            4. Generate 5 technical interview questions based on the experience and skills mentioned in this resume.

            Resume Text: ${extractedText}
        `;

        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();

        // 3. Save to MongoDB
        const newResume = await Resume.create({
            userId: req.auth.userId,
            fileName: req.file.originalname,
            resumeText: extractedText,
            analysis: {
                // We save the whole AI text for now to keep it simple
                // Later we can parse it into specific fields
                strengths: [aiResponse]
            }
        });

        res.status(200).json({
            message: "Resume analyzed successfully",
            analysis: aiResponse,
            resumeId: newResume._id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Resume analysis failed" });
    }
};