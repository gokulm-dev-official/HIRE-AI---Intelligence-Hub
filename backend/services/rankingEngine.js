/**
 * FinalScore = (SkillMatch * 0.4) + (ExperienceMatch * 0.3) + (ProjectRelevance * 0.2) + (AIConfidence * 0.1)
 */
const calculateRank = (skillScore, experienceScore, projectScore, aiConfidence) => {
    const finalScore =
        (skillScore * 0.4) +
        (experienceScore * 0.3) +
        (projectScore * 0.2) +
        (aiConfidence * 0.1);

    return {
        score: (finalScore * 100).toFixed(2),
        rank: finalScore > 0.8 ? 'Top Tier' : finalScore > 0.5 ? 'Strong Match' : 'Potentially Suitable',
        explanation: `Candidate matches ${(skillScore * 100).toFixed(0)}% of core skills and has a strong project relevance score of ${(projectScore * 100).toFixed(0)}%.`
    };
};

module.exports = { calculateRank };
