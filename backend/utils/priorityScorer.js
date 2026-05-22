/**
 * Calculates priority score and escalation eligibility for citizen complaints.
 */

const URGENCY_WEIGHTS = {
  critical: 40,
  high: 30,
  medium: 20,
  low: 10
};

const SENTIMENT_WEIGHTS = {
  negative: 30,
  neutral: 15,
  positive: 0
};

const HIGH_IMPACT_CATEGORIES = new Set([
  'water',
  'electricity',
  'health',
  'police',
  'traffic'
]);

/**
 * Computes a score between 1 and 100 representing complaint priority.
 * @param {Object} params
 * @param {string} params.urgency - low, medium, high, critical
 * @param {string} params.sentiment - positive, neutral, negative
 * @param {string} params.category - allowed category values
 * @returns {Object} { score: number, requiresEscalation: boolean }
 */
const calculatePriority = ({ urgency, sentiment, category }) => {
  const normUrgency = (urgency || 'low').toLowerCase().trim();
  const normSentiment = (sentiment || 'neutral').toLowerCase().trim();
  const normCategory = (category || 'other').toLowerCase().trim();

  // 1. Urgency contribution (max 40)
  const urgencyPoints = URGENCY_WEIGHTS[normUrgency] || URGENCY_WEIGHTS.low;

  // 2. Sentiment contribution (max 30)
  const sentimentPoints = SENTIMENT_WEIGHTS[normSentiment] || SENTIMENT_WEIGHTS.neutral;

  // 3. Category contribution (max 30)
  let categoryPoints = 10; // base points
  if (HIGH_IMPACT_CATEGORIES.has(normCategory)) {
    categoryPoints = 30; // higher impact for core public services
  } else if (['drainage', 'sanitation', 'ration'].includes(normCategory)) {
    categoryPoints = 20; // medium impact
  }

  // Calculate final score
  let priorityScore = urgencyPoints + sentimentPoints + categoryPoints;
  
  // Constrain score between 1 and 100
  priorityScore = Math.max(1, Math.min(100, priorityScore));

  // Determine escalation (score >= 70 triggers immediate escalation flag)
  const requiresEscalation = priorityScore >= 70;

  return {
    score: priorityScore,
    requiresEscalation
  };
};

module.exports = {
  calculatePriority
};
