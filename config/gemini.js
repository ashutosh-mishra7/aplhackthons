const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
  console.warn(
    '\n[AI Warning] GEMINI_API_KEY is not configured in .env.\n' +
    '[AI Warning] JanMitra AI will operate in LOCAL KEYWORD FALLBACK MODE for all classifications.\n' +
    '[AI Warning] To enable full AI capability, please add a valid Gemini API Key from Google AI Studio.\n'
  );
} else {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('[AI Config] Gemini API client successfully initialized.');
  } catch (error) {
    console.error(`[AI Config Error] Failed to initialize Gemini client: ${error.message}`);
  }
}

/**
 * Gets the configured Gemini client
 * @returns {GoogleGenerativeAI|null}
 */
const getGeminiClient = () => {
  return genAI;
};

module.exports = {
  getGeminiClient,
  isGeminiConfigured: () => genAI !== null
};
