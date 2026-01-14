const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
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
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: String,
    avatar: String,

    // Authentication
    password: {
        type: String,
        required: true,
        select: false
    },
    refreshToken: {
        type: String,
        select: false
    },
    passwordResetToken: String,
    passwordResetExpires: Date,

    // Two-Factor Authentication
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    twoFactorSecret: {
        type: String,
        select: false
    },

    // Role & Permissions
    role: {
        type: String,
        enum: ['super_admin', 'admin', 'hiring_manager', 'recruiter', 'interviewer', 'candidate'],
        default: 'recruiter'
    },
    permissions: [{
        type: String
    }],
    department: String,

    // Status
    isActive: {
        type: Boolean,
        default: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: Date,

    // SSO
    ssoProvider: {
        type: String,
        enum: ['google', 'microsoft', 'okta', 'saml']
    },
    ssoId: String
}, {
    timestamps: true
});

userSchema.index({ email: 1 });
userSchema.index({ organization: 1, role: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
