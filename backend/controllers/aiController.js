const { callLLM } = require('../services/aiService');
const Candidate = require('../models/Candidate');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Enterprise RAG Controller
 * Production-grade Retrieval Augmented Generation for candidate intelligence
 */
exports.chatWithCandidates = async (req, res, next) => {
    try {
        const { query, history } = req.body;
        if (!query) return next(new ErrorResponse('Please provide a query', 400));

        console.log('[RAG Engine] Query received:', query);

        // 1. Fetch all candidates for context
        const candidates = await Candidate.find().limit(100);

        if (candidates.length === 0) {
            return res.status(200).json({
                success: true,
                answer: "No candidates have been ingested yet. Please upload resumes first to use the AI intelligence features.",
                matches: [],
                explanation: "The candidate database is empty."
            });
        }

        // 2. Build detailed context
        const context = candidates.map(c => ({
            id: c._id.toString(),
            fullName: `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Unknown',
            email: c.email || 'Not provided',
            phone: c.phone || 'Not provided',
            location: c.location ? `${c.location.city || ''}, ${c.location.state || ''}, ${c.location.country || ''}`.replace(/, ,/g, ',').replace(/^,|,$/g, '') : 'Not specified',
            skills: c.skills?.map(s => s.name || s).join(', ') || 'No skills listed',
            summary: c.summary || 'No summary available',
            experience: c.experience?.map(e => ({
                title: e.title,
                company: e.company,
                duration: `${e.startDate || '?'} - ${e.current ? 'Present' : e.endDate || '?'}`,
                description: e.description?.substring(0, 200) || ''
            })) || [],
            education: c.education?.map(e => `${e.degree || ''} in ${e.field || ''} from ${e.institution || ''}`).join('; ') || 'Not listed',
            yearsOfExperience: c.totalYearsOfExperience || 0,
            atsScore: c.atsScore || 0,
            status: c.status || 'new'
        }));

        // 3. Construct production prompt
        const systemInstruction = 'You are HireAI, a precise recruitment intelligence system. You help recruiters find and analyze talent. Always respond in valid JSON format.';

        const prompt = `
Context:
CANDIDATE DATABASE (${context.length} total candidates):
${JSON.stringify(context, null, 2)}

${history ? `CHAT HISTORY:\n${JSON.stringify(history, null, 2)}\n` : ''}

USER QUESTION: "${query}"

Guidelines:
1. If the user refers to "this candidate" or "the candidate", and there is only one candidate in the database or one candidate was previously discussed, refer to that candidate.
2. Provide specific details like names, skills, and education accurately from the context.
3. If no candidate matches, say so clearly.
4. Don't mention "based on the context" every time, just give the answer naturally but accurately.

Return ONLY a JSON object with this structure:
{
    "answer": "Your detailed answer",
    "matches": ["candidate_id_1"],
    "explanation": "Brief reasoning"
}`;

        // 4. Call Gemini
        const responseTextRaw = await callLLM(prompt, "gemini-flash-latest", systemInstruction);

        let responseText = responseTextRaw;

        // Robust JSON Extraction
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            responseText = jsonMatch[0];
        }

        try {
            const parsedResponse = JSON.parse(responseText.trim());
            res.status(200).json({
                success: true,
                answer: parsedResponse.answer || 'I processed the request but couldn\'t generate a clear answer.',
                matches: parsedResponse.matches || [],
                explanation: parsedResponse.explanation || ''
            });
        } catch (jsonErr) {
            console.error('[RAG Engine] JSON Parse Error. Raw:', responseText);
            // Fallback: If not JSON, use the raw text as answer
            res.status(200).json({
                success: true,
                answer: responseText.length > 5 ? responseText : "I'm having trouble formatting the response. Please try asking again.",
                matches: [],
                explanation: 'Fallback from malformed JSON'
            });
        }
    } catch (err) {
        console.error('[RAG Engine] Error:', err);
        res.status(500).json({
            success: false,
            message: 'AI processing error'
        });
    }
};

exports.generateJobDescription = async (req, res, next) => {
    try {
        const { title, skills } = req.body;

        const systemInstruction = 'You are a professional HR assistant who writes compelling job descriptions.';
        const prompt = `Generate a professional, ATS-optimized job description for:
Position: ${title}
Required Skills: ${skills}

Format the response as clean HTML with proper headings for: Job Title, About the Role, Responsibilities, Requirements, and Benefits.`;

        const responseTextRaw = await callLLM(prompt, "gemini-flash-latest", systemInstruction);

        res.status(200).json({
            success: true,
            data: responseTextRaw
        });
    } catch (err) {
        console.error('[JD Generator] Error:', err);
        next(err);
    }
};
