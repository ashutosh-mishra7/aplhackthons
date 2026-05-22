const express = require('express');
const router = express.Router();
const { 
  getDashboardStats,
  getDepartmentStats,
  getHeatmapData,
  getAnalyticsCharts
} = require('../controllers/dashboard.controller');

// GET /api/dashboard/stats - Retrieve high-level executive analytics
router.get('/stats', getDashboardStats);

// GET /api/dashboard/departments - Retrieve department velocity and throughput metrics
router.get('/departments', getDepartmentStats);

// GET /api/dashboard/heatmap - Retrieve incident weights and volumes by ward
router.get('/heatmap', getHeatmapData);

// GET /api/dashboard/analytics - Retrieve temporal trends and categories data
router.get('/analytics', getAnalyticsCharts);

module.exports = router;
