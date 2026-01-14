const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require('dotenv').config();

async function run() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // There is no direct listModels on genAI in the newer SDK, it's usually on a separate client or via a specific call
        // But let's try a different model name
        const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
        let results = '';

        for (const modelName of models) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hi");
                results += `${modelName}: SUCCESS\n`;
            } catch (err) {
                results += `${modelName}: FAILED - ${err.message}\n`;
            }
        }
        fs.writeFileSync('test_models.txt', results);
    } catch (err) {
        fs.writeFileSync('test_models.txt', 'CRITICAL FAILURE: ' + err.message);
    }
}

run();
