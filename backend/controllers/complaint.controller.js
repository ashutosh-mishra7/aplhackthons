const Complaint = require('../models/Complaint');
const AILog = require('../models/AILog');
const { analyzeGrievance } = require('../services/gemini.service');

/**
 * Creates a new complaint, triggers the AI Gemini engine (or fallback), and saves to DB.
 * POST /api/complaints
 */
const createComplaint = async (req, res, next) => {
  try {
    const { name, phone, area, title, description, image } = req.body;

    console.log(`[Complaints Controller] New complaint registered. Processing AI Classification...`);

    // Call high-precision Gemini service layer (handles network retries and fallbacks internally)
    const { data: aiResult, isFallback, latency, error } = await analyzeGrievance(title, description);

    // Save AI execution audit log to the database
    try {
      const auditLog = new AILog({
        complaintTitle: title,
        success: !error,
        latency_ms: latency,
        confidence_score: aiResult.ai_confidence_score,
        usedFallback: isFallback,
        error_message: error || null
      });
      await auditLog.save();
      console.log(`[Complaints Controller] AI Audit log created. Fallback used: ${isFallback}, Latency: ${latency}ms`);
    } catch (logErr) {
      console.error(`[Complaints Controller Error] Failed to save AI audit log:`, logErr.message);
    }

    // Merge citizen inputs and AI/Fallback outputs into a single Complaint document
    const complaintData = {
      name,
      phone,
      area,
      title,
      description,
      image: image || null,
      status: 'Pending',
      is_ai_processed: !isFallback,
      ...aiResult,
      timeline: [
        { status: 'Submitted', timestamp: new Date(), description: 'Complaint filed via Citizen Portal.' },
        { status: 'AI Analyzed', timestamp: new Date(), description: `AI Engine routed to ${aiResult.department} with priority score ${aiResult.priority_score}` }
      ]
    };

    const newComplaint = new Complaint(complaintData);
    const savedComplaint = await newComplaint.save();

    console.log(`[Complaints Controller] Complaint successfully saved! Route: ${savedComplaint.department}, SLA: ${savedComplaint.ticket_sla_days} days`);

    // Return the saved complaint, which includes all database tags alongside the strict AI response keys at root
    return res.status(201).json(savedComplaint);
  } catch (error) {
    next(error);
  }
};

/**
 * Lists complaints with pagination, multi-field filtering, and full-text searching.
 * GET /api/complaints
 */
const getComplaints = async (req, res, next) => {
  try {
    const { category, department, status, urgency, search, page = 1, limit = 10 } = req.query;

    const query = {};

    // 1. Exact match filters
    if (category) query.category = category.toLowerCase().trim();
    if (department) query.department = department.trim();
    if (status) query.status = status.trim();
    if (urgency) query.urgency = urgency.trim();

    // 2. Full-Text Search or Regex Match
    if (search) {
      // Use text index if possible, otherwise fall back to fuzzy regex matching
      query.$text = { $search: search };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skipNum = (pageNum - 1) * limitNum;

    // Fetch records sorted by creation date descending
    const complaints = await Complaint.find(query)
      .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .skip(skipNum)
      .limit(limitNum);

    const totalRecords = await Complaint.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limitNum);

    return res.status(200).json({
      success: true,
      count: complaints.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages,
        totalRecords
      },
      data: complaints
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a single complaint by its MongoDB ObjectId or custom Seed ID.
 * GET /api/complaints/:id
 */
const getComplaintById = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    let searchId = req.params.id;
    const mappings = {
      'JM-2026-9821': '664d4b1a4f1a4e1a4e1a9821',
      'JM-2026-4439': '664d4b1a4f1a4e1a4e1a4439',
      'JM-2026-7712': '664d4b1a4f1a4e1a4e1a7712',
      'JM-2026-1188': '664d4b1a4f1a4e1a4e1a1188'
    };
    if (mappings[searchId]) {
      searchId = mappings[searchId];
    }

    if (!mongoose.Types.ObjectId.isValid(searchId)) {
      return res.status(404).json({
        success: false,
        message: `Complaint not found with ID ${req.params.id}`
      });
    }

    const complaint = await Complaint.findById(searchId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint not found with ID ${req.params.id}`
      });
    }

    return res.status(200).json(complaint);
  } catch (error) {
    next(error);
  }
};

/**
 * Updates a complaint's status and logs a timeline event. Supports custom Seed ID.
 * PATCH /api/complaints/:id
 */
const updateComplaintStatus = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    const { status, note } = req.body;
    
    let searchId = req.params.id;
    const mappings = {
      'JM-2026-9821': '664d4b1a4f1a4e1a4e1a9821',
      'JM-2026-4439': '664d4b1a4f1a4e1a4e1a4439',
      'JM-2026-7712': '664d4b1a4f1a4e1a4e1a7712',
      'JM-2026-1188': '664d4b1a4f1a4e1a4e1a1188'
    };
    if (mappings[searchId]) {
      searchId = mappings[searchId];
    }

    if (!mongoose.Types.ObjectId.isValid(searchId)) {
      return res.status(404).json({
        success: false,
        message: `Complaint not found with ID ${req.params.id}`
      });
    }

    // Find the complaint
    const complaint = await Complaint.findById(searchId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint not found with ID ${req.params.id}`
      });
    }

    // Set fields
    complaint.status = status;
    if (note) {
      complaint.department_note = note;
    }
    
    // Add event to timeline
    complaint.timeline.push({
      status,
      timestamp: new Date(),
      description: note || `Complaint status updated to ${status}.`
    });

    if (status === 'Escalated') {
      complaint.requires_escalation = true;
    }

    const updated = await complaint.save();
    return res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus
};
