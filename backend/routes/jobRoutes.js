const express = require('express');
const router = express.Router();
const { createJob, getSuggestedJobs, getJobById, deleteAllJobs } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/suggested', protect, getSuggestedJobs);
router.get('/:id', protect, getJobById);
router.post('/', protect, authorize('admin', 'hiring_manager'), createJob);
router.delete('/clear', protect, authorize('admin'), deleteAllJobs);

module.exports = router;
