/**
 * Calculates SLA days and estimated resolution date based on the complaint category.
 */

const CATEGORY_SLA_MAP = {
  electricity: 2,
  water: 2,
  traffic: 2,
  police: 2,
  
  sanitation: 4,
  drainage: 4,
  health: 4,
  ration: 4,
  
  road: 10,
  construction: 10,
  land: 10,
  welfare: 10,
  labour: 10,
  education: 10,
  
  other: 7
};

/**
 * Returns the SLA limit in days for a specific category
 * @param {string} category 
 * @returns {number}
 */
const getSLADays = (category) => {
  const normalizedCategory = (category || 'other').toLowerCase().trim();
  return CATEGORY_SLA_MAP[normalizedCategory] || CATEGORY_SLA_MAP.other;
};

/**
 * Calculates the estimated resolution date
 * @param {string} category 
 * @param {Date} [startDate] - Default is now
 * @returns {Date}
 */
const calculateEstimatedResolution = (category, startDate = new Date()) => {
  const slaDays = getSLADays(category);
  const resolutionDate = new Date(startDate);
  resolutionDate.setDate(resolutionDate.getDate() + slaDays);
  return resolutionDate;
};

module.exports = {
  getSLADays,
  calculateEstimatedResolution
};
