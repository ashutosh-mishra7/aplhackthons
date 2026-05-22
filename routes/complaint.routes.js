const express = require('express');
const router = express.Router();
const { 
  createComplaint, 
  getComplaints, 
  getComplaintById 
} = require('../controllers/complaint.controller');
const { validateComplaint } = require('../middleware/validate.middleware');

// POST /api/complaints - Register a new complaint with AI analysis
router.post('/', validateComplaint, createComplaint);

// GET /api/complaints - Retrieve filtered list of complaints
router.get('/', getComplaints);

// GET /api/complaints/:id - Retrieve specific complaint details
router.get('/:id', getComplaintById);

module.exports = router;
