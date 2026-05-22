const AILog = require('../models/AILog');
const { analyzeGrievance } = require('../services/gemini.service');

/**
 * Analyzes grievance text and immediately returns the structured governance JSON.
 * Does NOT persist the grievance in the database (useful for frontend real-time pre-flight previews).
 * POST /api/ai/analyze
 */
const analyzeText = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    console.log(`[AI Controller] Raw analysis requested. Processing Title: "${title}"`);

    const { data: aiResult, isFallback, latency, error } = await analyzeGrievance(title, description);

    // Save AI execution audit log
    try {
      const auditLog = new AILog({
        complaintTitle: `Raw API: ${title.substring(0, 30)}`,
        success: !error,
        latency_ms: latency,
        confidence_score: aiResult.ai_confidence_score,
        usedFallback: isFallback,
        error_message: error || null
      });
      await auditLog.save();
    } catch (logErr) {
      console.error(`[AI Controller Error] Failed to save AI audit log:`, logErr.message);
    }

    // Return the strict JSON format payload directly to satisfy contract
    return res.status(200).json(aiResult);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeText
};
