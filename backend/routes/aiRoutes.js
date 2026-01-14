const express = require('express');
const router = express.Router();
const { chatWithCandidates, generateJobDescription } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/chat', protect, chatWithCandidates);
router.post('/generate-jd', protect, generateJobDescription);

module.exports = router;
