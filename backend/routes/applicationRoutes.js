const express = require('express');
const router = express.Router();
const { applyForJob, getApplicationsByJob, getAllApplications } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/apply', authorize('recruiter', 'admin'), applyForJob);
router.get('/', authorize('recruiter', 'admin'), getAllApplications);
router.get('/job/:jobId', authorize('recruiter', 'admin', 'hiring_manager'), getApplicationsByJob);

module.exports = router;
