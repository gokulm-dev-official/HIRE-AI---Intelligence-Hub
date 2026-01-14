const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: false
    },

    // Personal Information
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: String,

    // Location
    location: {
        city: String,
        state: String,
        country: String,
        zipCode: String
    },

    headline: String,
    summary: String,

    // Professional Data
    experience: [{
        company: String,
        title: String,
        startDate: Date,
        endDate: Date,
        current: Boolean,
        description: String
    }],
    totalYearsOfExperience: Number,

    education: [{
        institution: String,
        degree: String,
        field: String,
        startDate: Date,
        endDate: Date,
        gpa: Number
    }],

    skills: [{
        name: String,
        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced', 'expert']
        }
    }],

    socialProfiles: {
        linkedin: String,
        github: String,
        portfolio: String
    },

    resume: {
        filename: String,
        url: String,
        uploadedAt: Date,
        parsedData: mongoose.Schema.Types.Mixed
    },

    // AI Vector Embedding
    embedding: {
        type: [Number],
        select: false
    },

    status: {
        type: String,
        enum: ['New', 'Screening', 'Verified', 'Shortlisted', 'Rejected', 'new', 'screening', 'active', 'on_hold', 'rejected', 'hired', 'withdrawn'],
        default: 'New'
    },

    tags: [String],

    atsScore: {
        type: Number,
        default: 0
    },
    atsFeedback: [String],
    notes: [{
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

// Removed duplicate index causing warning
candidateSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });
candidateSchema.index({ 'skills.name': 1 });

module.exports = mongoose.model('Candidate', candidateSchema);
