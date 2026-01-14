const { callLLM } = require('./aiService');

const retrieveRelevantStandards = async (query) => {
    // In production, this would be a vector search on a "CompanyPolicies" collection
    return [
        "D&I Policy: Focus on core skills and project impact rather than years of experience.",
        "React Standard: Advanced understanding of hooks (useMemo, useCallback) and context is mandatory.",
        "Cultural Fit: Problem-solving mindset and clear technical communication are key indicators."
    ];
};

const generateAIPoweredEvaluation = async (resumeData, jdData) => {
    const standards = await retrieveRelevantStandards(jdData.title);

    const systemInstruction = `
    You are a Senior AI Hiring Specialist. You evaluate candidates fairly based on job requirements and company standards.
    Output only valid JSON.
  `;

    const prompt = `
    Evaluate this candidate for the following job.
    
    Job Description: ${JSON.stringify(jdData)}
    Candidate Data: ${JSON.stringify(resumeData)}
    Company Standards: ${standards.join(' | ')}

    Provide a JSON response with:
    "score": (Number 0-100),
    "summary": (String),
    "strengths": (Array of Strings),
    "gaps": (Array of Strings),
    "interviewQuestions": (Array of 5 relevant technical/behavioral questions),
    "biasRiskScore": (Number 0-10)
  `;

    try {
        const result = await callLLM(prompt, "gemini-flash-latest", systemInstruction);
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
    } catch (err) {
        console.error("RAG Eval Error:", err);
    }

    return {
        score: 0,
        summary: "Evaluation failed due to AI processing error.",
        strengths: [],
        gaps: [],
        interviewQuestions: [],
        biasRiskScore: 0
    };
};

module.exports = { generateAIPoweredEvaluation };
