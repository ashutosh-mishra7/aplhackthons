const mongoose = require('mongoose');

const AILogSchema = new mongoose.Schema({
  complaintTitle: { 
    type: String, 
    default: 'Raw AI Request' 
  },
  success: { 
    type: Boolean, 
    required: true 
  },
  latency_ms: { 
    type: Number, 
    required: true 
  },
  apiType: { 
    type: String, 
    default: 'Gemini-1.5-Flash' 
  },
  error_message: { 
    type: String, 
    default: null 
  },
  confidence_score: { 
    type: Number, 
    default: 0 
  },
  usedFallback: { 
    type: Boolean, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

// Setup indexes for analytics aggregation
AILogSchema.index({ success: 1 });
AILogSchema.index({ usedFallback: 1 });
AILogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('AILog', AILogSchema);
