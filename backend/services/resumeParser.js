const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const { callLLM } = require('./aiService');

const parseResume = async (buffer, mimetype) => {
    let text = '';

    try {
        if (mimetype === 'application/pdf') {
            const data = await pdf(buffer);
            text = data.text;
        } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const data = await mammoth.extractRawText({ buffer });
            text = data.value;
        } else if (mimetype === 'text/plain') {
            text = buffer.toString();
        } else {
            throw new Error('Unsupported file type: ' + mimetype);
        }
    } catch (err) {
        console.error("Extraction Error:", err);
        throw new Error('Failed to extract text from file');
    }

    if (!text || text.trim().length < 50) {
        throw new Error('The uploaded file seems to be empty or contains too little text');
    }

    const systemInstruction = `
    You are an expert HR Data Scientist. Your task is to transform messy resume text into a perfectly structured JSON object.
    Strictly follow the JSON schema provided. Do not include any conversational filler.
  `;

    const prompt = `
    Analyze the following resume text and extract the details into this JSON structure:
    {
      "name": "Full Name",
      "email": "Email Address",
      "phone": "Phone Number",
      "location": "Current City/State",
      "skills": ["Skill 1", "Skill 2"],
      "experience": [
        {
          "title": "Job Title",
          "company": "Company Name",
          "duration": "Start Date - End Date",
          "description": "Short summary of responsibilities"
        }
      ],
      "education": [
        {
          "degree": "Degree Name",
          "institution": "School/University",
          "year": "Graduation Year"
        }
      ],
      "projects": [
        {
          "name": "Project Name",
          "description": "Goal and tech used"
        }
      ]
    }

    Resume Text:
    ${text}
  `;

    try {
        const structuredDataText = await callLLM(prompt, "gemini-1.5-flash", systemInstruction);

        // Improved JSON extraction
        const jsonMatch = structuredDataText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            // Basic normalization
            if (!parsed.skills) parsed.skills = [];
            parsed.skills = parsed.skills.map(s => s.trim());
            return parsed;
        }
    } catch (err) {
        console.error("AI Structuring Error:", err);
    }

    throw new Error('AI failed to interpret the resume structure. Please ensure the file is clear.');
};

module.exports = { parseResume };
