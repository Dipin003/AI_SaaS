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
    analysis: {
        score: Number,
        strengths: [String],
        improvements: [String],
        suggestdQuestions: [String]
    }
}, {
    timestamps: true
})

const ResumeReview = mongoose.model('Resume', resumeSchema);

export default ResumeReview