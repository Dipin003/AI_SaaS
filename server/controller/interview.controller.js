import { GoogleGenerativeAI } from "@google/generative-ai";
import Interview from "../models/Interview.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const startInterview = async (req, res) => {
    try {
        const { topic } = req.body;  // Changed from userPrompt to topic for clarity
        const userId = req.auth.userId;



        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{
                        text: `
                        You are a technical interviewer conducting a vocal interview. 
                        The user wants to be interviewed on: "${topic}". 
                        
                        Rules for you:
                        1. Ask only ONE question at a time.
                        2. Keep your responses short and conversational (under 3 sentences).
                        3. DO NOT output code blocks or markdown, because your text will be read aloud by a text-to-speech engine.
                        4. Start immediately with the first technical question.
                    `}],
                },
            ],
        });

        const result = await chat.sendMessage("Start the interview now.");
        const aiQuestion = result.response.text();

        // 2. Save to DB using your NEW Schema
        const newInterview = await Interview.create({
            userId,
            topic: topic,
            questions: [
                {
                    question: aiQuestion,
                    answer: "",
                }
            ]
        });

        res.status(201).json({
            interviewId: newInterview._id,
            question: aiQuestion // Frontend will read this text aloud
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "AI Failed to generate question" });
    }
};