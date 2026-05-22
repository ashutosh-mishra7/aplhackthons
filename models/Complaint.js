const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  // Citizen Input Fields
  name: { 
    type: String, 
    required: [true, 'Citizen name is required'], 
    trim: true 
  },
  phone: { 
    type: String, 
    required: [true, 'Citizen phone number is required'], 
    trim: true 
  },
  area: { 
    type: String, 
    required: [true, 'Area/Locality is required'], 
    trim: true 
  },
  title: { 
    type: String, 
    required: [true, 'Complaint title is required'], 
    trim: true 
  },
  description: { 
    type: String, 
    required: [true, 'Complaint description is required'] 
  },
  image: { 
    type: String, 
    default: null 
  },

  // Categorization & Routing
  category: { 
    type: String, 
    enum: {
      values: [
        'road', 'water', 'electricity', 'land', 'education', 'health', 
        'police', 'welfare', 'ration', 'construction', 'labour', 
        'traffic', 'sanitation', 'drainage', 'other'
      ],
      message: '{VALUE} is not a supported category'
    },
    required: true 
  },
  department: { 
    type: String, 
    enum: {
      values: [
        'Nagar Nigam', 'Jal Nigam', 'Vidyut Vibhag', 'Rajasva Vibhag', 'Shiksha Vibhag', 
        'Swasthya Vibhag', 'Pulis Vibhag', 'Samaj Kalyan Vibhag', 'Khadya Vibhag', 
        'Loknirman Vibhag', 'Shram Vibhag', 'Traffic Police', 'Other'
      ],
      message: '{VALUE} is not a supported department'
    },
    required: true 
  },

  // Governance Status
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Resolved', 'Escalated'], 
    default: 'Pending' 
  },
  urgency: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    required: true 
  },
  urgency_reason: { 
    type: String 
  },
  sentiment: { 
    type: String, 
    enum: ['Positive', 'Neutral', 'Negative'], 
    required: true 
  },

  // Summaries & Translations
  summary_en: { 
    type: String, 
    required: true 
  },
  summary_hi: { 
    type: String, 
    required: true 
  },
  citizen_update_en: { 
    type: String, 
    required: true 
  },
  citizen_update_hi: { 
    type: String, 
    required: true 
  },
  sms_hi: { 
    type: String, 
    required: true 
  },

  // Priority & Escalation Metrics
  ticket_sla_days: { 
    type: Number, 
    required: true 
  },
  estimated_resolution: { 
    type: Date 
  },
  ai_confidence_score: { 
    type: Number, 
    required: true 
  },
  priority_score: { 
    type: Number, 
    required: true 
  },
  requires_escalation: { 
    type: Boolean, 
    default: false 
  },
  department_note: { 
    type: String, 
    default: '' 
  },
  tags: [{ 
    type: String 
  }],

  // Auditing Metas
  is_ai_processed: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Setup indexes for ultra-fast dashboard rendering and full-text searches
ComplaintSchema.index({ category: 1 });
ComplaintSchema.index({ department: 1 });
ComplaintSchema.index({ status: 1 });
ComplaintSchema.index({ urgency: 1 });
ComplaintSchema.index({ priority_score: -1 });
ComplaintSchema.index({ createdAt: -1 });

// Full text search on title, description, and area
ComplaintSchema.index({ title: 'text', description: 'text', area: 'text' });

module.exports = mongoose.model('Complaint', ComplaintSchema);
