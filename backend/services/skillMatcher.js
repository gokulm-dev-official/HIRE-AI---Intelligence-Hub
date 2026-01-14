const _ = require('lodash');

/**
 * Production Skill Matcher Service
 * Normalizes and matches skills between candidate and job requirements
 */
const matchSkills = (candidateSkills = [], requiredSkills = []) => {
    // Helper to extract skill name from various formats
    const getSkillName = (skill) => {
        if (typeof skill === 'string') return skill.toLowerCase().trim();
        if (skill && skill.name) return skill.name.toLowerCase().trim();
        return '';
    };

    // Normalize candidate skills
    const normalizedCandidate = candidateSkills
        .map(getSkillName)
        .filter(Boolean);

    // Normalize required skills
    const normalizedRequired = requiredSkills
        .map(getSkillName)
        .filter(Boolean);

    if (normalizedRequired.length === 0) {
        return { score: 0.7, matched: [], missing: [], matchPercentage: '70.00' };
    }

    const matched = [];
    const missing = [];

    // Skill synonym mapping for better matching
    const synonyms = {
        'javascript': ['js', 'ecmascript', 'es6', 'es2015'],
        'typescript': ['ts'],
        'react': ['reactjs', 'react.js'],
        'node': ['nodejs', 'node.js'],
        'python': ['py', 'python3'],
        'java': ['java8', 'java11', 'java17'],
        'c++': ['cpp', 'cplusplus'],
        'c#': ['csharp', 'dotnet'],
        'mongodb': ['mongo'],
        'postgresql': ['postgres', 'psql'],
        'kubernetes': ['k8s'],
        'amazon web services': ['aws'],
        'google cloud platform': ['gcp'],
        'machine learning': ['ml'],
        'artificial intelligence': ['ai'],
        'continuous integration': ['ci', 'cicd', 'ci/cd'],
        'rest api': ['restful', 'rest', 'api'],
    };

    // Check each required skill
    normalizedRequired.forEach(reqSkill => {
        let found = false;

        // Direct match
        if (normalizedCandidate.some(candSkill =>
            candSkill.includes(reqSkill) || reqSkill.includes(candSkill)
        )) {
            found = true;
        }

        // Synonym match
        if (!found) {
            for (const [mainSkill, syns] of Object.entries(synonyms)) {
                if (reqSkill.includes(mainSkill) || syns.some(syn => reqSkill.includes(syn))) {
                    // Check if candidate has this skill or its synonyms
                    if (normalizedCandidate.some(candSkill =>
                        candSkill.includes(mainSkill) || syns.some(syn => candSkill.includes(syn))
                    )) {
                        found = true;
                        break;
                    }
                }
            }
        }

        if (found) {
            matched.push(reqSkill);
        } else {
            missing.push(reqSkill);
        }
    });

    const score = matched.length / normalizedRequired.length;

    return {
        score,
        matched,
        missing,
        matchPercentage: (score * 100).toFixed(2)
    };
};

module.exports = { matchSkills };
