/**
 * Matching Service
 * Scoring logic to rank candidates against Job Descriptions
 */
class MatchingService {
    calculateMatchScore(candidate, job) {
        const scores = {
            skills: this.scoreSkills(candidate.skills, job.requirements.skills),
            experience: this.scoreExperience(candidate.totalYearsOfExperience, job.requirements.experience),
            education: this.scoreEducation(candidate.education, job.requirements.education),
            location: this.scoreLocation(candidate.location, job.location)
        };

        // Weighted Overall
        const weights = { skills: 0.4, experience: 0.3, education: 0.2, location: 0.1 };
        const overall = (scores.skills * weights.skills) +
            (scores.experience * weights.experience) +
            (scores.education * weights.education) +
            (scores.location * weights.location);

        return {
            overall: Math.round(overall * 100),
            breakdown: {
                skills: Math.round(scores.skills * 100),
                experience: Math.round(scores.experience * 100),
                education: Math.round(scores.education * 100),
                location: Math.round(scores.location * 100)
            }
        };
    }

    scoreSkills(candidateSkills = [], jobSkills = []) {
        if (jobSkills.length === 0) return 1;
        const candSkillNames = candidateSkills.map(s => s.name.toLowerCase());
        const matched = jobSkills.filter(js => candSkillNames.includes(js.name.toLowerCase()));
        return matched.length / jobSkills.length;
    }

    scoreExperience(candYears = 0, jobReq) {
        if (!jobReq || !jobReq.min) return 1;
        if (candYears >= jobReq.min && candYears <= (jobReq.max || Infinity)) return 1;
        if (candYears < jobReq.min) return candYears / jobReq.min;
        return 0.8; // Slightly penalized for over-qualification
    }

    scoreEducation(candEdu = [], jobReq) {
        if (!jobReq || !jobReq.level) return 1;
        const levels = { 'bachelor': 1, 'master': 2, 'phd': 3 };
        const reqVal = levels[jobReq.level.toLowerCase()] || 0;
        const maxCandVal = Math.max(0, ...candEdu.map(e => levels[e.degree?.toLowerCase()] || 0));
        return maxCandVal >= reqVal ? 1 : maxCandVal / reqVal;
    }

    scoreLocation(candLoc, jobLoc) {
        if (!jobLoc || jobLoc.type === 'remote') return 1;
        if (candLoc?.city === jobLoc?.city) return 1;
        if (candLoc?.state === jobLoc?.state) return 0.5;
        return 0.2;
    }
}

module.exports = new MatchingService();
