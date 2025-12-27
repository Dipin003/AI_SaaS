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

export const generateStudyGuide = async (req, res) => {
    try {
        const { resumeId } = req.body;
        const userId = req.auth.userId;

        const resume = await Resume.findOne({ _id: resumeId, userId });

        if (!resume) return res.status(404).json({ message: "Resume not found" });

        const prompt = `
    Context: You are an expert technical recruiter. Based on the following resume text, generate a set of 15 technical interview questions.
    
    Resume Data: "${resume.resumeText}"

    Requirements:
    1. Generate 15 questions in total: 5 Easy, 5 Medium, and 5 Hard.
    2. Difficulty definitions:
       - Easy: Basic syntax, fundamental concepts, and tool usage.
       - Medium: Implementation details, system design basics, and troubleshooting.
       - Hard: Optimization, architectural trade-offs, and complex edge cases.
    3. For each question, provide:
       - The "question" text.
       - An "answer" (comprehensive and professional).
       - A "tip" (pro-tip on what to emphasize).
       - A "difficulty" label (Easy, Medium, or Hard).

    Return ONLY a valid JSON array of objects. Do not include markdown formatting or extra text.

    Format:
    [
        {
            "difficulty": "Easy",
            "question": "...",
            "answer": "...",
            "tip": "..."
        },
        ...
    ]
`;
        const result = await model.generateContent(prompt);
        const qaData = JSON.parse(result.response.text());

        resume.analysis.practiceQA = qaData;
        await resume.save();

        res.status(200).json({ message: "Study guide generated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to generate study guide" });
    }
}

