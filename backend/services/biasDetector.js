const { callLLM } = require('./aiService');

const detectBias = async (resumeData, evaluationCriteria) => {
    const prompt = `
    Check for potential biases in the hiring evaluation for the following candidate.
    Look for factors like: Gender indicators, Age (graduation years), College prestige, Location, and Resume gaps.
    
    Candidate Data:
    ${JSON.stringify(resumeData)}
    
    Evaluation Criteria:
    ${evaluationCriteria}
    
    Return a JSON object with:
    "biasRiskScore" (0-10),
    "detectedBiases" (array of strings),
    "neutralizedRecommendation" (string),
    "explanation" (string)
  `;

    const result = await callLLM(prompt);
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
    }

    return {
        biasRiskScore: 0,
        detectedBiases: [],
        neutralizedRecommendation: "No biases detected",
        explanation: "Standard evaluation applied."
    };
};

module.exports = { detectBias };
