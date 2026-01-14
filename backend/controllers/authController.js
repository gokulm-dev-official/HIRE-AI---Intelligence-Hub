const User = require('../models/User');
const Organization = require('../models/Organization');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');

exports.registerOrganization = async (req, res, next) => {
    try {
        const { orgName, firstName, lastName, email, password } = req.body;

        // 1. Create Organization
        const organization = await Organization.create({
            name: orgName,
            slug: orgName.toLowerCase().replace(/\s+/g, '-'),
            subscription: { plan: 'enterprise', status: 'active' } // Default for prod demo
        });

        // 2. Create Admin User
        const user = await User.create({
            organization: organization._id,
            firstName,
            lastName,
            email,
            password, // Hashed by model pre-save hook
            role: 'admin'
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorResponse('Please provide an email and password', 400));
        }

        const user = await User.findOne({ email }).select('+password').populate('organization');

        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            email: user.email,
            role: user.role,
            organization: user.organization
        }
    });
};
