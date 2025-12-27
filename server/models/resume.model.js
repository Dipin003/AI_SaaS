import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true,
    },
    resumeText: {
        type: String,
        required: true,
    },
    // Inside your resumeSchema analysis object:
    analysis: {
        score: { type: Number, default: 0 },
        strengths: [String],
        improvements: [String],
        suggestedQuestions: [String], // These were just the questions
        practiceQA: [                 // NEW: Questions WITH Answers
            {
                question: String,
                answer: String,
                tip: String // Advice on how to deliver the answer
            }
        ]
    }
}, {
    timestamps: true
})

const ResumeReview = mongoose.model('Resume', resumeSchema);

export default ResumeReview