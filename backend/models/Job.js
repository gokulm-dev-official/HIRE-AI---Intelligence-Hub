const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: false
    },

    // Basic Information
    title: {
        type: String,
        required: true,
        trim: true
    },
    jobCode: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    company: String,
    district: String,
    originalUrl: String,
    department: String,
    team: String,

    // Job Details
    employmentType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary'],
        required: true
    },
    experienceLevel: {
        type: String,
        enum: ['entry', 'junior', 'mid', 'senior', 'lead', 'executive']
    },
    location: {
        type: {
            type: String,
            enum: ['remote', 'onsite', 'hybrid']
        },
        city: String,
        state: String,
        country: String,
        timezone: String
    },

    // Requirements
    requirements: {
        skills: [{
            name: String,
            level: {
                type: String,
                enum: ['beginner', 'intermediate', 'advanced', 'expert']
            },
            required: { type: Boolean, default: true },
            weight: { type: Number, default: 1 }
        }],
        education: {
            level: String,
            field: String,
            required: Boolean
        },
        experience: {
            min: Number,
            max: Number,
            required: Boolean
        }
    },

    // Compensation
    compensation: {
        salaryMin: Number,
        salaryMax: Number,
        currency: {
            type: String,
            default: 'USD'
        },
        payFrequency: {
            type: String,
            enum: ['hourly', 'annual']
        }
    },

    // Pipeline
    pipeline: [{
        name: {
            type: String,
            required: true
        },
        order: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            enum: ['screening', 'interview', 'assessment', 'offer', 'other']
        }
    }],

    // Hiring Team
    hiringTeam: {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
        recruiters: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },

    // Status
    status: {
        type: String,
        enum: ['draft', 'pending_approval', 'open', 'on_hold', 'closed', 'cancelled'],
        default: 'draft'
    },

    // Vector Embedding for RAG
    embedding: {
        type: [Number],
        select: false
    },

    // Statistics
    stats: {
        views: { type: Number, default: 0 },
        applications: { type: Number, default: 0 },
        hired: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

jobSchema.index({ organization: 1, status: 1 });
jobSchema.index({ title: 'text', description: 'text' });

// Auto-generate job code
jobSchema.pre('save', async function (next) {
    if (!this.jobCode) {
        this.jobCode = `JOB-${Date.now()}`;
    }
    next();
});

module.exports = mongoose.model('Job', jobSchema);
