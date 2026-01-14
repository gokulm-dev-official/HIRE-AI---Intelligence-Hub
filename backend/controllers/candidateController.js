const Candidate = require('../models/Candidate');
const resumeParser = require('../services/resumeParser.service');
const atsAnalyzer = require('../services/atsAnalyzer.service');
const ErrorResponse = require('../utils/errorResponse');

exports.uploadResume = async (req, res, next) => {
    try {
        console.log('--- Resume Upload Start ---');
        if (!req.file) {
            console.log('No file provided');
            return next(new ErrorResponse('Please upload a resume file', 400));
        }

        console.log(`File: ${req.file.originalname}, MimeType: ${req.file.mimetype}`);

        // 1. AI Parsing
        let parsedData;
        try {
            parsedData = await resumeParser.parseResume(req.file.buffer, req.file.mimetype);
            console.log('AI Parsing successful');
        } catch (error) {
            console.error('AI Parsing failed in Controller:', error);
            return next(new ErrorResponse(`AI Parsing failed: ${error.message}`, 500));
        }

        // 2. Production-Level ATS Analysis
        const analysis = atsAnalyzer.analyze(parsedData);

        // 3. Create Candidate
        try {
            const candidate = await Candidate.create({
                ...parsedData,
                atsScore: analysis.score,
                atsFeedback: analysis.feedback,
                resume: {
                    filename: req.file.originalname,
                    uploadedAt: new Date(),
                    parsedData
                }
            });
            console.log(`Candidate created: ${candidate._id}`);

            res.status(201).json({
                success: true,
                data: candidate
            });
        } catch (error) {
            console.error('Candidate creation failed:', error);
            return next(new ErrorResponse(`Database error: ${error.message}`, 500));
        }
    } catch (err) {
        console.error('Unexpected error in uploadResume:', err);
        next(err);
    }
};

exports.getCandidates = async (req, res, next) => {
    try {
        // Find all candidates (global)
        const candidates = await Candidate.find();
        res.status(200).json({ success: true, count: candidates.length, data: candidates });
    } catch (err) {
        next(err);
    }
};

exports.getCandidate = async (req, res, next) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) return next(new ErrorResponse('Candidate not found', 404));
        res.status(200).json({ success: true, data: candidate });
    } catch (err) {
        next(err);
    }
};

exports.updateCandidate = async (req, res, next) => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!candidate) return next(new ErrorResponse('Candidate not found', 404));
        res.status(200).json({ success: true, data: candidate });
    } catch (err) {
        next(err);
    }
};

exports.deleteCandidate = async (req, res, next) => {
    try {
        console.log(`Attempting to delete candidate: ${req.params.id}`);
        const candidate = await Candidate.findByIdAndDelete(req.params.id);
        if (!candidate) return next(new ErrorResponse('Candidate not found', 404));
        console.log(`Candidate ${req.params.id} deleted successfully.`);
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error('Delete Candidate Error:', err);
        next(err);
    }
};

exports.bulkUploadResumes = async (req, res, next) => {
    try {
        console.log(`--- Bulk Upload Start: ${req.files?.length || 0} files ---`);
        if (!req.files || req.files.length === 0) {
            return next(new ErrorResponse('Please upload resume files', 400));
        }

        const results = {
            success: [],
            failed: []
        };

        // Sequential processing to avoid hitting AI rate limits too hard
        for (const file of req.files) {
            try {
                console.log(`Processing: ${file.originalname}`);
                const parsedData = await resumeParser.parseResume(file.buffer, file.mimetype);
                const analysis = atsAnalyzer.analyze(parsedData);

                const candidate = await Candidate.create({
                    ...parsedData,
                    atsScore: analysis.score,
                    atsFeedback: analysis.feedback,
                    resume: {
                        filename: file.originalname,
                        uploadedAt: new Date(),
                        parsedData
                    }
                });
                results.success.push({ filename: file.originalname, id: candidate._id });
                console.log(`Successfully ingested: ${file.originalname}`);
            } catch (error) {
                console.error(`Failed to ingest ${file.originalname}:`, error.message);
                results.failed.push({ filename: file.originalname, error: error.message });
            }
        }

        res.status(200).json({
            success: true,
            data: results
        });
    } catch (err) {
        console.error('Unexpected error in bulkUploadResumes:', err);
        next(err);
    }
};
