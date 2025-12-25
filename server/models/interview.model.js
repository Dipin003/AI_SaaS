import mongoose from "mongoose";

const interviewSchema = mongoose.Schema({
    userId: {
        type: String, // <--- CHANGED: Must be String to store Clerk ID
        required: true
    },
    topic: {
        type: String,
        required: true,
    },
    questions: [
        {
            question: { type: String, required: true },
            answer: { type: String },
            feedback: { type: String },
            rating: { type: Number, min: 0, max: 5 }
        }
    ],
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active',
    }
}, {
    timestamps: true 
});

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;