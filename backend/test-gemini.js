const { callLLM } = require('./services/aiService');

async function testGemini() {
    console.log('Testing Gemini with prompt: "Hello, who are you?"');
    try {
        const response = await callLLM('Hello, who are you?');
        console.log('Gemini Response:', response);
    } catch (error) {
        console.error('Test Failed:', error);
    }
}

testGemini();
