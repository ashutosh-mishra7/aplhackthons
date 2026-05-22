/**
 * Input validation middlewares for JanMitra AI APIs
 */

/**
 * Validates a complaint submission request (POST /api/complaints)
 */
const validateComplaint = (req, res, next) => {
  const { name, phone, area, title, description } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push({ field: 'name', message: 'Name is required and must be a string' });
  }
  
  if (!phone || typeof phone !== 'string' || phone.trim() === '') {
    errors.push({ field: 'phone', message: 'Phone number is required' });
  } else {
    // Basic phone number format validation
    const phoneRegex = /^[+]?[0-9\s-]{10,15}$/;
    if (!phoneRegex.test(phone.trim())) {
      errors.push({ field: 'phone', message: 'Invalid phone number format. Provide 10-15 digits' });
    }
  }

  if (!area || typeof area !== 'string' || area.trim() === '') {
    errors.push({ field: 'area', message: 'Area/Locality is required' });
  }

  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.push({ field: 'title', message: 'Complaint title is required' });
  } else if (title.length < 5) {
    errors.push({ field: 'title', message: 'Title must be at least 5 characters long' });
  }

  if (!description || typeof description !== 'string' || description.trim() === '') {
    errors.push({ field: 'description', message: 'Complaint description is required' });
  } else if (description.length < 10) {
    errors.push({ field: 'description', message: 'Description must be at least 10 characters long' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

/**
 * Validates raw AI analysis requests (POST /api/ai/analyze)
 */
const validateAIAnalyze = (req, res, next) => {
  const { title, description } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.push({ field: 'title', message: 'Title is required' });
  }

  if (!description || typeof description !== 'string' || description.trim() === '') {
    errors.push({ field: 'description', message: 'Description is required' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

module.exports = {
  validateComplaint,
  validateAIAnalyze
};
