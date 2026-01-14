const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
    console.warn("WARNING: GEMINI_API_KEY is not defined in .env file");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

/**
 * General function to call Gemini LLM with system instruction support
 */
const callLLM = async (prompt, modelName = "gemini-flash-latest", systemInstruction = "") => {
    try {
        const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: systemInstruction
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("AI Service Error:", error.message);

        // Fallback logic for Quota (429) or Not Found (404)
        if ((error.message.includes("429") || error.message.includes("404")) && modelName !== "gemini-1.5-flash-8b") {
            console.log("Attempting fallback to gemini-1.5-flash-8b...");
            return callLLM(prompt, "gemini-1.5-flash-8b", systemInstruction);
        }

        if (error.message.includes("API key not valid")) {
            return JSON.stringify({ error: "Invalid AI API Key. Please check your .env file." });
        }
        throw new Error(`Failed to process request with AI service: ${error.message}`);
    }
};

/**
 * Generate embeddings using Gemini
 */
const generateEmbeddings = async (text) => {
    try {
        // Truncate text if too long for embedding model
        const truncatedText = text.substring(0, 8000);
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const result = await model.embedContent(truncatedText);
        return result.embedding.values;
    } catch (error) {
        console.error("Embedding Service Error:", error.message);
        // Return a zero vector as fallback to avoid crashing during dev without keys
        return new Array(768).fill(0);
    }
};

module.exports = {
    callLLM,
    generateEmbeddings,
};
