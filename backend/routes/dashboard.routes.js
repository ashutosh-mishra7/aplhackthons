const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboard.controller');

// GET /api/dashboard/stats - Retrieve high-level executive analytics
router.get('/stats', getDashboardStats);

module.exports = router;
