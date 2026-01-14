const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    logo: String,
    website: String,
    industry: String,
    size: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    },

    // Subscription
    subscription: {
        plan: {
            type: String,
            enum: ['free', 'starter', 'professional', 'enterprise'],
            default: 'free'
        },
        status: {
            type: String,
            enum: ['active', 'cancelled', 'expired', 'trial'],
            default: 'trial'
        },
        startDate: Date,
        endDate: Date,
        features: [String]
    },

    // Settings
    settings: {
        branding: {
            primaryColor: String,
            secondaryColor: String,
            customCSS: String
        },
        recruitment: {
            defaultPipeline: [{
                name: String,
                order: Number
            }],
            autoRejectAfterDays: Number,
            requireApprovalForJobPosting: Boolean
        },
        notifications: {
            email: { type: Boolean, default: true },
            sms: { type: Boolean, default: false },
            slack: { type: Boolean, default: false }
        }
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

organizationSchema.index({ slug: 1 });
organizationSchema.index({ 'subscription.status': 1 });

module.exports = mongoose.model('Organization', organizationSchema);
