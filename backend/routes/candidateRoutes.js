const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadResume, getCandidates, getCandidate, updateCandidate, deleteCandidate, bulkUploadResumes } = require('../controllers/candidateController');
const { protect, authorize } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(protect);

router.post('/upload', authorize('recruiter', 'admin'), upload.single('resume'), uploadResume);
router.post('/bulk', authorize('recruiter', 'admin'), upload.array('resumes', 20), bulkUploadResumes);
router.get('/', authorize('recruiter', 'admin'), getCandidates);
router.get('/:id', authorize('recruiter', 'admin'), getCandidate);
router.put('/:id', authorize('recruiter', 'admin'), updateCandidate);
router.delete('/:id', authorize('recruiter', 'admin'), deleteCandidate);

module.exports = router;
