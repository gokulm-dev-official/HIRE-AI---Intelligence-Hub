const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require('dotenv').config();

async function run() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1' });

    try {
        const result = await model.generateContent("Explain AI in one sentence.");
        const response = await result.response;
        const text = response.text();
        fs.writeFileSync('test_result.txt', 'SUCCESS: ' + text);
    } catch (err) {
        fs.writeFileSync('test_result.txt', 'FAILURE: ' + err.message + '\n' + JSON.stringify(err, null, 2));
    }
}

run();
