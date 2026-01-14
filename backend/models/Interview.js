const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    application: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
        required: true
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },

    type: {
        type: String,
        enum: ['screening', 'technical', 'cultural', 'final'],
        required: true
    },
    schedule: {
        startTime: Date,
        endTime: Date,
        timezone: String,
        location: String // e.g., 'Google Meet Link'
    },

    interviewers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
        default: 'scheduled'
    },

    // AI Generated Content
    aiPreparation: {
        suggestedQuestions: [String],
        focusAreas: [String],
        difficultyLevel: String
    },

    feedback: [{
        interviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        score: Number,
        notes: String,
        recommendation: { type: String, enum: ['hire', 'strong_hire', 'no_hire', 'strong_no_hire'] },
        submittedAt: { type: Date, default: Date.now }
    }],

    overallScore: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('Interview', interviewSchema);
