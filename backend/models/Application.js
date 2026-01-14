const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: false
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
    },

    // Current Pipeline Stage
    currentStage: {
        name: String,
        order: Number,
        enteredAt: Date
    },

    // Tracking Timeline
    timeline: [{
        stage: String,
        action: String, // 'moved_to', 'rejected_from', etc.
        movedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        movedAt: { type: Date, default: Date.now },
        reason: String
    }],

    appliedAt: { type: Date, default: Date.now },

    // AI Matching Score (Breakdown)
    matchingScore: {
        overall: Number,
        breakdown: {
            skills: Number,
            experience: Number,
            education: Number,
            location: Number
        },
        explanation: String,
        calculatedAt: Date
    },

    status: {
        type: String,
        enum: ['active', 'rejected', 'withdrawn', 'hired', 'on_hold'],
        default: 'active'
    },

    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    }
}, {
    timestamps: true
});

applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });
applicationSchema.index({ job: 1, 'currentStage.name': 1 });

module.exports = mongoose.model('Application', applicationSchema);
