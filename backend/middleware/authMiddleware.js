/**
 * Auth Middleware - COMPLETELY BYPASSED for direct access
 * Every request is automatically authorized as a Super Admin
 */
const protect = async (req, res, next) => {
    // Inject a persistent dummy user so all controllers/models function correctly
    req.user = {
        _id: '000000000000000000000001',
        organization: '00000000000000000000000a',
        role: 'admin',
        firstName: 'Gokul',
        lastName: 'M',
        email: 'admin@hireai.local'
    };
    next();
};

const authorize = (...roles) => {
    return (req, res, next) => {
        // Grant access to any role specified in the logic
        next();
    };
};

module.exports = { protect, authorize };
