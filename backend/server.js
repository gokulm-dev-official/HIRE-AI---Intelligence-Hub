const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Set security headers
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/candidates', require('./routes/candidateRoutes'));
app.use('/api/v1/jobs', require('./routes/jobRoutes'));
app.use('/api/v1/applications', require('./routes/applicationRoutes'));
app.use('/api/v1/ai', require('./routes/aiRoutes'));

app.get('/', (req, res) => {
    res.send('AI Recruitment Intelligence API is running...');
});

// Error Handler
const errorHandler = require('./middleware/errorMiddleware');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    // server.close(() => process.exit(1));
});
