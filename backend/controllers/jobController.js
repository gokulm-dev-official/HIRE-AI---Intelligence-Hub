const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const { calculateJobMatch } = require('../services/jobMatcher');
const { scrapeJobs } = require('../services/jobScraper');

/**
 * Get Suggested Jobs
 * Returns jobs matched against the candidate's resume skills
 */
exports.getSuggestedJobs = async (req, res) => {
    try {
        const { district, limit = 20 } = req.query;
        console.log(`[JobController] Getting jobs for district: ${district || 'All'}`);

        // 1. Find candidate with resume data for matching
        const candidate = await Candidate.findOne({
            "resume.parsedData": { $exists: true }
        }).sort({ createdAt: -1 }); // Get most recent

        // 2. Normalize district parameter
        const normalizedDistrict = (!district || district === 'All Districts' || district === '')
            ? null
            : district;

        // 3. Try to get jobs from database first
        let query = { status: 'open' };
        if (normalizedDistrict) {
            query.district = { $regex: new RegExp(normalizedDistrict, 'i') };
        }

        let jobs = await Job.find(query).limit(50);
        console.log(`[JobController] Found ${jobs.length} jobs in database`);

        // 4. If no jobs in DB, scrape fresh data
        if (jobs.length === 0) {
            console.log('[JobController] No jobs in DB, scraping fresh data...');
            const scrapedJobs = await scrapeJobs("Software Engineer", district || "All");

            // Save scraped jobs to database
            for (const sj of scrapedJobs) {
                try {
                    const existingJob = await Job.findOne({
                        title: sj.title,
                        company: sj.company
                    });

                    if (!existingJob) {
                        await Job.create({
                            ...sj,
                            jobCode: sj.jobCode || `JOB-${Date.now()}`,
                            status: 'open'
                        });
                    }
                } catch (err) {
                    console.log(`[JobController] Error saving job ${sj.title}:`, err.message);
                }
            }

            // Re-fetch from database
            jobs = await Job.find(query).limit(50);

            // If still no jobs, return the scraped data directly
            if (jobs.length === 0 && scrapedJobs.length > 0) {
                const jobsWithMatching = scrapedJobs.map(job => {
                    if (candidate?.resume?.parsedData) {
                        const scoring = calculateJobMatch(candidate.resume.parsedData, job);
                        return { ...job, matchScore: scoring.matchScore, matchBreakdown: scoring.breakdown };
                    }
                    return { ...job, matchScore: 75 };
                });
                jobsWithMatching.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
                return res.json({ success: true, count: jobsWithMatching.length, data: jobsWithMatching.slice(0, limit) });
            }
        }

        // 5. Calculate match scores if candidate exists
        let recommendations;
        if (candidate?.resume?.parsedData) {
            console.log(`[JobController] Calculating matches for: ${candidate.email}`);
            recommendations = jobs.map(job => {
                const jobObj = job.toObject ? job.toObject() : job;
                try {
                    const scoring = calculateJobMatch(candidate.resume.parsedData, jobObj);
                    return {
                        ...jobObj,
                        matchScore: scoring.matchScore,
                        matchBreakdown: scoring.breakdown,
                        matchedSkills: scoring.matchedSkills,
                        missingSkills: scoring.missingSkills
                    };
                } catch (err) {
                    console.error(`[JobController] Match error for ${job.title}:`, err.message);
                    return { ...jobObj, matchScore: 60 };
                }
            });
        } else {
            recommendations = jobs.map(j => ({
                ...(j.toObject ? j.toObject() : j),
                matchScore: 70
            }));
        }

        // 6. Sort by match score and return
        recommendations.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

        res.json({
            success: true,
            count: recommendations.length,
            data: recommendations.slice(0, parseInt(limit))
        });

    } catch (err) {
        console.error('[JobController] getSuggestedJobs error:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching job recommendations: ' + err.message
        });
    }
};

exports.getJobById = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        res.json({ success: true, data: job });
    } catch (err) {
        console.error('[JobController] getJobById error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createJob = async (req, res, next) => {
    try {
        const job = await Job.create({
            ...req.body,
            jobCode: req.body.jobCode || `JOB-${Date.now()}`,
            status: req.body.status || 'open'
        });
        res.status(201).json({ success: true, data: job });
    } catch (err) {
        console.error('[JobController] createJob error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteAllJobs = async (req, res) => {
    try {
        await Job.deleteMany({});
        res.json({ success: true, message: 'All jobs deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
