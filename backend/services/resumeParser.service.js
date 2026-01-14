const { callLLM } = require('./aiService');
const mammoth = require('mammoth');

/**
 * Resume Parser Service
 * Advanced AI-driven extraction using Google Gemini 1.5 Flash
 */
class ResumeParserService {
    async parseResume(fileBuffer, mimeType) {
        try {
            console.log('Extracting raw text from file...');
            const text = await this.extractRawText(fileBuffer, mimeType);
            console.log('Raw text extracted, calling Gemini...');

            const systemInstruction = 'You are a resume parsing assistant. Return ONLY valid JSON without any markdown formatting. Extract structured information exactly as requested.';

            const prompt = `
Extract structured information from the following resume text.
Return ONLY valid JSON.

Fields to extract:
- firstName (string, required)
- lastName (string, required)
- email (string, required)
- phone (string)
- location: { city, state, country }
- headline (string)
- summary (string)
- totalYearsOfExperience (number)
- experience: Array of { company, title, startDate, endDate, current, description }
- education: Array of { institution, degree, field, gpa }
- skills: Array of { name, level: 'beginner'|'intermediate'|'advanced'|'expert' }
- socialProfiles: { linkedin, github, portfolio }
- atsScore: Number (0-100)
- atsFeedback: Array of strings (recommendations for improvement)

Resume Text:
${text}
`;

            const responseTextRaw = await callLLM(prompt, "gemini-flash-latest", systemInstruction);

            let jsonText = responseTextRaw;
            console.log('Gemini response received');

            // Clean markdown if AI wrapped it in ```json
            if (jsonText.includes('```')) {
                const match = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
                if (match) {
                    jsonText = match[1];
                }
            }

            try {
                // More aggressive cleaning: remove anything before the first '{' and after the last '}'
                const firstBrace = jsonText.indexOf('{');
                const lastBrace = jsonText.lastIndexOf('}');
                if (firstBrace !== -1 && lastBrace !== -1) {
                    jsonText = jsonText.substring(firstBrace, lastBrace + 1);
                }

                const parsed = JSON.parse(jsonText.trim());
                // Basic validation for required fields
                if (!parsed.firstName) parsed.firstName = 'Unknown';
                if (!parsed.lastName) parsed.lastName = 'Candidate';

                if (!parsed.email) {
                    const randomSuffix = Math.random().toString(36).substring(2, 7);
                    parsed.email = `unknown-${Date.now()}-${randomSuffix}@example.com`;
                }

                return parsed;
            } catch (jsonError) {
                console.error('JSON Parse Error. Raw Snippet:', jsonText.substring(0, 200));
                throw new Error('AI returned structurally invalid data. Please try again.');
            }
        } catch (error) {
            console.error('AI Parsing Error:', error);
            throw error;
        }
    }

    async extractRawText(fileBuffer, mimeType) {
        if (mimeType === 'application/pdf') {
            try {
                // Try pdf-parse first
                const pdf = require('pdf-parse');
                const data = await pdf(fileBuffer);
                return data.text;
            } catch (err) {
                console.warn('pdf-parse fallback needed:', err.message);
                // Fallback for different pdf-parse versions or issues
                return "Failed to parse PDF text. Please check server logs.";
            }
        } else if (mimeType.includes('word') || mimeType.includes('officedocument')) {
            const result = await mammoth.extractRawText({ buffer: fileBuffer });
            return result.value;
        }
        return fileBuffer.toString('utf-8');
    }
}

module.exports = new ResumeParserService();
