const { getSLADays, calculateEstimatedResolution } = require('../utils/slaCalculator');
const { calculatePriority } = require('../utils/priorityScorer');

// Supported categories & departments list for safe routing
const ALLOWED_CATEGORIES = [
  'road', 'water', 'electricity', 'land', 'education', 'health', 
  'police', 'welfare', 'ration', 'construction', 'labour', 
  'traffic', 'sanitation', 'drainage', 'other'
];

const ALLOWED_DEPARTMENTS = [
  'Nagar Nigam', 'Jal Nigam', 'Vidyut Vibhag', 'Rajasva Vibhag', 'Shiksha Vibhag', 
  'Swasthya Vibhag', 'Pulis Vibhag', 'Samaj Kalyan Vibhag', 'Khadya Vibhag', 
  'Loknirman Vibhag', 'Shram Vibhag', 'Traffic Police', 'Other'
];

// Keyword Rules for Category & Department mapping
const KEYWORD_RULES = [
  {
    keywords: ['water', 'drinking water', 'leakage', 'leak', 'jal', 'pipe', 'pipeline', 'tap'],
    category: 'water',
    department: 'Jal Nigam'
  },
  {
    keywords: ['electricity', 'power', 'transformer', 'voltage', 'outage', 'meter', 'bill', 'current', 'vidyut', 'wire', 'lightpole'],
    category: 'electricity',
    department: 'Vidyut Vibhag'
  },
  {
    keywords: ['road', 'pothole', 'highway', 'street', 'tarmac', 'paving', 'paved'],
    category: 'road',
    department: 'Loknirman Vibhag'
  },
  {
    keywords: ['land', 'encroachment', 'plot', 'boundary', 'property', 'rajasva', 'tehsildar', 'landlord', 'patwari'],
    category: 'land',
    department: 'Rajasva Vibhag'
  },
  {
    keywords: ['school', 'teacher', 'student', 'education', 'exam', 'shiksha', 'college', 'university', 'syllabus', 'fees'],
    category: 'education',
    department: 'Shiksha Vibhag'
  },
  {
    keywords: ['hospital', 'doctor', 'nurse', 'medicine', 'health', 'swasthya', 'clinic', 'patient', 'disease', 'medical'],
    category: 'health',
    department: 'Swasthya Vibhag'
  },
  {
    keywords: ['police', 'theft', 'robbery', 'fir', 'crime', 'pulis', 'assault', 'thief', 'station', 'arrest'],
    category: 'police',
    department: 'Pulis Vibhag'
  },
  {
    keywords: ['welfare', 'pension', 'scheme', 'samaj', 'handicap', 'widow', 'disability', 'kalyan', 'allowance'],
    category: 'welfare',
    department: 'Samaj Kalyan Vibhag'
  },
  {
    keywords: ['ration', 'food', 'grain', 'dealer', 'khadya', 'shop', 'wheat', 'rice', 'pds', 'distributor'],
    category: 'ration',
    department: 'Khadya Vibhag'
  },
  {
    keywords: ['construction', 'bridge', 'flyover', 'building', 'cement', 'infrastructure'],
    category: 'construction',
    department: 'Loknirman Vibhag'
  },
  {
    keywords: ['labour', 'wage', 'salary', 'factory', 'worker', 'shram', 'employee', 'union', 'contractor'],
    category: 'labour',
    department: 'Shram Vibhag'
  },
  {
    keywords: ['traffic', 'jam', 'signal', 'lights', 'vehicle', 'parking', 'challan', 'crossing'],
    category: 'traffic',
    department: 'Traffic Police'
  },
  {
    keywords: ['garbage', 'waste', 'trash', 'cleanliness', 'sweep', 'cleaning', 'sanitation', 'dirty', 'dump', 'filth'],
    category: 'sanitation',
    department: 'Nagar Nigam'
  },
  {
    keywords: ['drainage', 'sewer', 'clog', 'gutter', 'overflow', 'blockage', 'dirty water'],
    category: 'drainage',
    department: 'Jal Nigam'
  }
];

// Keywords for Urgency detection
const CRITICAL_KEYWORDS = ['accident', 'hazard', 'emergency', 'danger', 'die', 'death', 'immediate', 'critical', 'injury', 'fire', 'shock'];
const HIGH_KEYWORDS = ['broken', 'stolen', 'severe', 'blockage', 'foul', 'soon', 'damage', 'loss', 'leakage'];
const MEDIUM_KEYWORDS = ['improve', 'bad', 'poor', 'issue', 'problem', 'delay', 'request'];

// Keywords for Sentiment analysis
const POSITIVE_KEYWORDS = ['good', 'thank', 'happy', 'excellent', 'great', 'satisfied', 'resolved', 'appreciate'];
const NEGATIVE_KEYWORDS = ['worst', 'bad', 'pathetic', 'complaint', 'horrible', 'angry', 'useless', 'slow', 'no action', 'dirty', 'corrupt', 'neglect'];

/**
 * Executes a fast, rule-based keyword classification on grievance texts
 * @param {string} title 
 * @param {string} description 
 * @returns {Object} Strict Output JSON Format
 */
const classifyLocally = (title, description) => {
  const fullText = `${title || ''} ${description || ''}`.toLowerCase();

  // 1. Determine Category & Department
  let category = 'other';
  let department = 'Other';
  let maxMatches = 0;

  for (const rule of KEYWORD_RULES) {
    let matches = 0;
    for (const keyword of rule.keywords) {
      if (fullText.includes(keyword)) {
        matches++;
      }
    }
    if (matches > maxMatches) {
      maxMatches = matches;
      category = rule.category;
      department = rule.department;
    }
  }

  // 2. Determine Urgency
  let urgency = 'Low';
  let urgencyReason = 'Categorized under standard priority queue.';
  
  let criticalCount = CRITICAL_KEYWORDS.filter(k => fullText.includes(k)).length;
  let highCount = HIGH_KEYWORDS.filter(k => fullText.includes(k)).length;
  let mediumCount = MEDIUM_KEYWORDS.filter(k => fullText.includes(k)).length;

  if (criticalCount > 0) {
    urgency = 'Critical';
    urgencyReason = 'Detected critical hazard/emergency keywords in complaint text.';
  } else if (highCount > 0) {
    urgency = 'High';
    urgencyReason = 'Detected severity indicators suggesting rapid resolution required.';
  } else if (mediumCount > 0) {
    urgency = 'Medium';
    urgencyReason = 'Standard public utility grievance with minor disruption.';
  }

  // 3. Determine Sentiment
  let sentiment = 'Neutral';
  let positiveCount = POSITIVE_KEYWORDS.filter(k => fullText.includes(k)).length;
  let negativeCount = NEGATIVE_KEYWORDS.filter(k => fullText.includes(k)).length;

  if (negativeCount > positiveCount) {
    sentiment = 'Negative';
  } else if (positiveCount > negativeCount) {
    sentiment = 'Positive';
  }

  // 4. Summaries & Citizen Updates
  const titleText = title || 'Public Grievance';
  const summaryEn = `Complaint regarding ${titleText.toLowerCase()} filed. It refers to potential issues under the domain of ${department}.`;
  const summaryHi = `${titleText} के संबंध में शिकायत दर्ज। यह ${department} के अधिकार क्षेत्र के अंतर्गत संभावित समस्याओं को संदर्भित करता है।`;
  
  const citizenUpdateEn = `Your grievance regarding "${titleText}" has been successfully logged. It is classified under '${category}' category and assigned to ${department} for action.`;
  const citizenUpdateHi = `आपके शिकायत पत्र "${titleText}" को सफलतापूर्वक दर्ज कर लिया गया है। इसे '${category}' श्रेणी में वर्गीकृत किया गया है और उचित कार्रवाई के लिए ${department} को सौंप दिया गया है।`;
  
  const smsHi = `प्रिय नागरिक, आपकी शिकायत दर्ज हो चुकी है। विभाग: ${department}। समाधान की अनुमानित तिथि के लिए कृपया जनमित्र पोर्टल देखें। धन्यवाद।`;

  // 5. Governance metrics
  const ticketSlaDays = getSLADays(category);
  const estimatedResolution = calculateEstimatedResolution(category).toISOString();
  
  // Calculate priority score locally
  const { score: priorityScore, requiresEscalation } = calculatePriority({
    urgency,
    sentiment,
    category
  });

  // Departmental Note & Tags
  const departmentNote = `Local Fallback Routing: Please verify ownership of the ticket. Routed to ${department} based on keyword match.`;
  
  const tags = [category, urgency.toLowerCase()];
  if (requiresEscalation) tags.push('escalated');
  if (sentiment === 'Negative') tags.push('critical-sentiment');

  return {
    category,
    department,
    urgency,
    urgency_reason: urgencyReason,
    sentiment,
    summary_en: summaryEn,
    summary_hi: summaryHi,
    citizen_update_en: citizenUpdateEn,
    citizen_update_hi: citizenUpdateHi,
    sms_hi: smsHi,
    ticket_sla_days: ticketSlaDays,
    ai_confidence_score: 0.35, // 35% confidence for simple keyword classifier
    priority_score: priorityScore,
    estimated_resolution: estimatedResolution,
    requires_escalation: requiresEscalation,
    department_note: departmentNote,
    tags
  };
};

module.exports = {
  classifyLocally,
  ALLOWED_CATEGORIES,
  ALLOWED_DEPARTMENTS
};
