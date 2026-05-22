const express = require('express');
const router = express.Router();
const { analyzeText } = require('../controllers/ai.controller');
const { validateAIAnalyze } = require('../middleware/validate.middleware');

// POST /api/ai/analyze - Direct AI grievance analysis (does not persist ticket in DB)
router.post('/analyze', validateAIAnalyze, analyzeText);

module.exports = router;
