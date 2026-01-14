/**
 * Advanced ATS Analyzer Service
 * Production-level logic for resume scoring and feedback
 */
class ATSAnalyzerService {
    analyze(candidate) {
        const feedback = [];
        let score = 0;

        // 1. Contact Information (20%)
        let contactScore = 0;
        if (candidate.email && !candidate.email.includes('unknown')) contactScore += 7;
        if (candidate.phone) contactScore += 7;
        if (candidate.socialProfiles?.linkedin) contactScore += 6;

        if (contactScore < 20) {
            feedback.push("Missing or incomplete contact identification (Phone / LinkedIn).");
        }
        score += contactScore;

        // 2. Formatting & Structure (20%)
        let formatScore = 0;
        if (candidate.summary && candidate.summary.length > 50) formatScore += 10;
        if (candidate.experience && candidate.experience.length > 0) formatScore += 5;
        if (candidate.education && candidate.education.length > 0) formatScore += 5;

        if (!candidate.summary) feedback.push("Executive summary is missing; add a 2-3 sentence professional bio.");
        if (candidate.summary && candidate.summary.length < 50) feedback.push("Executive summary is too brief; expand on your core value proposition.");
        score += formatScore;

        // 3. Skill Density (30%)
        let skillScore = 0;
        const skills = candidate.skills || [];
        if (skills.length >= 10) skillScore = 30;
        else if (skills.length >= 5) skillScore = 20;
        else if (skills.length > 0) skillScore = 10;

        if (skills.length < 8) {
            feedback.push("Technical skill density is low; aim for at least 8-10 core competencies.");
        }
        score += skillScore;

        // 4. Experience Quality (30%)
        let expScore = 0;
        const experiences = candidate.experience || [];

        // Check for descriptions in experiences
        const hasDescriptions = experiences.every(exp => exp.description && exp.description.length > 30);
        if (hasDescriptions && experiences.length > 0) expScore += 15;

        // Average tenure/longevity (Simplified)
        if (candidate.totalYearsOfExperience > 0) expScore += 15;

        if (!hasDescriptions) feedback.push("Job descriptions are missing or too short; use action verbs and quantify achievements.");
        if (experiences.length === 0) feedback.push("Numerical experience data is missing; ensure chronological work history is listed.");

        score += expScore;

        // Final normalization and refinement
        return {
            score: Math.min(Math.round(score), 100),
            feedback: feedback.length > 0 ? feedback : ["Resume is highly optimized for modern ATS systems."]
        };
    }
}

module.exports = new ATSAnalyzerService();
