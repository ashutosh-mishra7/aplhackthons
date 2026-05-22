const { getGeminiClient, isGeminiConfigured } = require('../config/gemini');
const { classifyLocally, ALLOWED_CATEGORIES, ALLOWED_DEPARTMENTS } = require('./fallback.service');
const { getSLADays, calculateEstimatedResolution } = require('../utils/slaCalculator');
const { calculatePriority } = require('../utils/priorityScorer');

/**
 * Analyzes citizen complaints using Gemini 1.5 Flash.
 * If configured and online, calls Gemini API. Otherwise, falls back to the keyword engine.
 * 
 * @param {string} title 
 * @param {string} description 
 * @returns {Promise<{ data: Object, isFallback: boolean, latency: number }>}
 */
const analyzeGrievance = async (title, description) => {
  const startTime = Date.now();
  
  // If Gemini is not configured, immediately run local classification
  if (!isGeminiConfigured()) {
    const fallbackResult = classifyLocally(title, description);
    return {
      data: fallbackResult,
      isFallback: true,
      latency: Date.now() - startTime
    };
  }

  try {
    const genAI = getGeminiClient();
    // Use gemini-flash-latest as it is fast, free-tier eligible, and supports structured JSON outputs
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const systemPrompt = `
You are the core AI Engine of "JanMitra AI", an enterprise-grade smart city grievance governance system in India.
Your task is to analyze a citizen's complaint (Title and Description) and classify it.

ALLOWED CATEGORIES:
${ALLOWED_CATEGORIES.map(c => `- ${c}`).join('\n')}

ALLOWED DEPARTMENTS:
${ALLOWED_DEPARTMENTS.map(d => `- ${d}`).join('\n')}

Strict Rules:
1. "category" MUST be one of the ALLOWED CATEGORIES listed above.
2. "department" MUST be one of the ALLOWED DEPARTMENTS listed above.
3. If the complaint doesn't fit any category nicely, assign "other" and "Other".
4. Generate summaries:
   - "summary_en": Concise English executive summary (1-2 sentences).
   - "summary_hi": Concise Hindi executive summary (1-2 sentences) in Devanagari script.
5. Generate citizen updates:
   - "citizen_update_en": A polite, professional update in English reassuring the citizen that the ticket has been registered and assigned.
   - "citizen_update_hi": A polite, professional update in Hindi (Devanagari script) stating the same.
6. Generate a short Hindi SMS:
   - "sms_hi": A short SMS notification in Hindi (Devanagari script) under 120 characters notifying them of the status. E.g. "प्रिय नागरिक, आपकी शिकायत दर्ज हो गई है और विद्युत विभाग को भेज दी गई है। धन्यवाद - जनमित्र AI."
7. "urgency" must be one of: Low, Medium, High, Critical.
8. "sentiment" must be one of: Positive, Neutral, Negative.
9. "ai_confidence_score" must be a float between 0.0 and 1.0 indicating your confidence in this classification.

You must return ONLY a JSON object adhering exactly to the following structure:
{
  "category": "road | water | electricity | ...",
  "department": "Nagar Nigam | Jal Nigam | ...",
  "urgency": "Low | Medium | High | Critical",
  "urgency_reason": "Rationale for urgency",
  "sentiment": "Positive | Neutral | Negative",
  "summary_en": "English summary",
  "summary_hi": "Hindi summary in Devanagari",
  "citizen_update_en": "Citizen update text in English",
  "citizen_update_hi": "Citizen update text in Hindi Devanagari",
  "sms_hi": "Hindi SMS under 120 chars in Devanagari",
  "ai_confidence_score": 0.95,
  "department_note": "A note guiding the local department officers on the specific nature of the problem.",
  "tags": ["tag1", "tag2"]
}
`;

    const userPrompt = `
Analyze the following citizen complaint:
Title: ${title}
Description: ${description}
`;

    // Execute API request using JSON response mode
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: systemPrompt + '\n' + userPrompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1 // Keep it highly deterministic
      }
    });

    const responseText = result.response.text();
    const parsedData = JSON.parse(responseText);

    // Safeguard categories and departments in case LLM Hallucinates
    if (!ALLOWED_CATEGORIES.includes(parsedData.category)) {
      parsedData.category = 'other';
    }
    if (!ALLOWED_DEPARTMENTS.includes(parsedData.department)) {
      parsedData.department = 'Other';
    }

    // Standardize inputs for SLA and Priority Score calculations (keeps code completely uniform)
    const ticket_sla_days = getSLADays(parsedData.category);
    const estimated_resolution = calculateEstimatedResolution(parsedData.category).toISOString();
    
    const { score: priority_score, requiresEscalation } = calculatePriority({
      urgency: parsedData.urgency,
      sentiment: parsedData.sentiment,
      category: parsedData.category
    });

    // Merge and return the complete strict response payload
    const strictResult = {
      category: parsedData.category,
      department: parsedData.department,
      urgency: parsedData.urgency || 'Low',
      urgency_reason: parsedData.urgency_reason || 'Categorized by AI analysis.',
      sentiment: parsedData.sentiment || 'Neutral',
      summary_en: parsedData.summary_en || '',
      summary_hi: parsedData.summary_hi || '',
      citizen_update_en: parsedData.citizen_update_en || '',
      citizen_update_hi: parsedData.citizen_update_hi || '',
      sms_hi: parsedData.sms_hi || '',
      ticket_sla_days,
      ai_confidence_score: parsedData.ai_confidence_score || 0.85,
      priority_score,
      estimated_resolution,
      requires_escalation: requiresEscalation,
      department_note: parsedData.department_note || '',
      tags: parsedData.tags || []
    };

    return {
      data: strictResult,
      isFallback: false,
      latency: Date.now() - startTime
    };

  } catch (error) {
    console.error(`[Gemini API Error] Gemini analysis failed: ${error.message}. Running local fallback classification...`);
    const fallbackResult = classifyLocally(title, description);
    return {
      data: fallbackResult,
      isFallback: true,
      latency: Date.now() - startTime,
      error: error.message
    };
  }
};

module.exports = {
  analyzeGrievance
};
