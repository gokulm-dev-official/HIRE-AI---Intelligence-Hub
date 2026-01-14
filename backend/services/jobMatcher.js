const { matchSkills } = require('./skillMatcher');

/**
 * Production Job Matcher Service
 * Calculates match score between a candidate's resume and job requirements
 */
const calculateJobMatch = (resumeData, jobData) => {
    if (!resumeData || !jobData) {
        return { matchScore: 50, breakdown: {}, matchedSkills: [], missingSkills: [] };
    }

    // Extract job skills from various possible structures
    let jobSkills = [];
    if (jobData.requirements?.skills) {
        jobSkills = jobData.requirements.skills;
    } else if (jobData.skills) {
        jobSkills = Array.isArray(jobData.skills)
            ? jobData.skills.map(s => typeof s === 'string' ? { name: s } : s)
            : [];
    }

    // Extract candidate skills
    const candidateSkills = resumeData.skills || [];

    // Calculate skill match
    const skillMatch = matchSkills(candidateSkills, jobSkills);

    // Weights for scoring
    const weights = {
        skills: 0.50,        // 50% - Most important
        experience: 0.25,    // 25% - Experience level
        location: 0.15,      // 15% - Location preference
        recency: 0.10        // 10% - How recent the posting is
    };

    // Experience score calculation
    let experienceScore = 0.5; // Default
    const candidateYears = resumeData.totalYearsOfExperience || 0;
    if (candidateYears >= 5) experienceScore = 1.0;
    else if (candidateYears >= 3) experienceScore = 0.85;
    else if (candidateYears >= 1) experienceScore = 0.7;
    else experienceScore = 0.5;

    // Location score - check if candidate location matches job district
    let locationScore = 0.6; // Default for no preference
    const candidateCity = resumeData.location?.city?.toLowerCase() || '';
    const jobDistrict = (jobData.district || '').toLowerCase();
    if (candidateCity && jobDistrict) {
        if (candidateCity.includes(jobDistrict) || jobDistrict.includes(candidateCity)) {
            locationScore = 1.0;
        }
    }

    // Recency score (mock - would be based on actual posting date)
    const recencyScore = 0.9;

    // Calculate weighted total
    const totalScore = (
        (skillMatch.score * weights.skills) +
        (experienceScore * weights.experience) +
        (locationScore * weights.location) +
        (recencyScore * weights.recency)
    );

    // Convert to percentage and round
    const matchPercentage = Math.min(Math.round(totalScore * 100), 100);

    return {
        matchScore: matchPercentage,
        breakdown: {
            skills: Math.round(skillMatch.score * 100),
            experience: Math.round(experienceScore * 100),
            location: Math.round(locationScore * 100),
            recency: Math.round(recencyScore * 100)
        },
        matchedSkills: skillMatch.matched || [],
        missingSkills: skillMatch.missing || []
    };
};

module.exports = { calculateJobMatch };
