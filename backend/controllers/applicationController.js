const Application = require('../models/Application');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const matchingService = require('../services/matching.service');
const ErrorResponse = require('../utils/errorResponse');

exports.applyForJob = async (req, res, next) => {
    try {
        const { jobId, candidateId } = req.body;

        const job = await Job.findById(jobId);
        const candidate = await Candidate.findById(candidateId);

        if (!job || !candidate) {
            return next(new ErrorResponse('Job or Candidate not found', 404));
        }

        // 1. AI Match Scoring
        const scoring = matchingService.calculateMatchScore(candidate, job);

        // 2. Create Application
        const application = await Application.create({
            job: jobId,
            candidate: candidateId,
            currentStage: {
                name: job.pipeline[0]?.name || 'Screening',
                order: job.pipeline[0]?.order || 0,
                enteredAt: new Date()
            },
            matchingScore: {
                overall: scoring.overall,
                breakdown: scoring.breakdown,
                calculatedAt: new Date()
            },
            timeline: [{
                stage: 'Applied',
                action: 'applied'
            }]
        });

        res.status(201).json({ success: true, data: application });
    } catch (err) {
        next(err);
    }
};

exports.getApplicationsByJob = async (req, res, next) => {
    try {
        const applications = await Application.find({
            job: req.params.jobId
        })
            .populate('candidate')
            .sort({ 'matchingScore.overall': -1 });

        res.status(200).json({ success: true, count: applications.length, data: applications });
    } catch (err) {
        next(err);
    }
};

exports.getAllApplications = async (req, res, next) => {
    try {
        const applications = await Application.find()
            .populate('candidate')
            .populate('job')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: applications.length, data: applications });
    } catch (err) {
        next(err);
    }
};
