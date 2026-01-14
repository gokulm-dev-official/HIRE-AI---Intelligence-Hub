const axios = require('axios');
require('dotenv').config();

async function testRest() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const response = await axios.get(url);
        console.log('Available Models:');
        response.data.models.forEach(m => console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`));
    } catch (err) {
        console.error('REST API Failed:', err.response ? err.response.data : err.message);
    }
}

testRest();
