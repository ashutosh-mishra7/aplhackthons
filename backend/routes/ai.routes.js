const express = require('express');
const router = express.Router();
const { 
  analyzeText,
  getRoutingNetwork,
  getExecutionLogs,
  getEngineTelemetry
} = require('../controllers/ai.controller');
const { validateAIAnalyze } = require('../middleware/validate.middleware');

// POST /api/ai/analyze - Direct AI grievance analysis (does not persist ticket in DB)
router.post('/analyze', validateAIAnalyze, analyzeText);

// GET /api/ai/network - Fetch real-time AI node statuses and routing graph topology
router.get('/network', getRoutingNetwork);

// GET /api/ai/logs - Fetch AI processing logs
router.get('/logs', getExecutionLogs);

// GET /api/ai/telemetry - Fetch AI engine stats & metrics
router.get('/telemetry', getEngineTelemetry);

module.exports = router;
