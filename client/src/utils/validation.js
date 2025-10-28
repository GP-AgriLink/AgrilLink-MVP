import * as Yup from "yup";
import DOMPurify from 'dompurify';

// ==================== SANITIZATION FUNCTIONS ====================

/**
 * Sanitize string input to prevent XSS attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';
  
  // Remove HTML tags and dangerous characters
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
  });
  
  // Trim whitespace and normalize spaces
  return sanitized.trim().replace(/\s+/g, ' ');
};

/**
 * Sanitize email input
 * @param {string} email - The email to sanitize
 * @returns {string} - Sanitized email
 */
export const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return '';
  
  // Convert to lowercase and trim
  let sanitized = email.toLowerCase().trim();
  
  // Remove any HTML tags
  sanitized = DOMPurify.sanitize(sanitized, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
  
  // Remove any characters that aren't valid in emails
  sanitized = sanitized.replace(/[^\w.@+-]/g, '');
  
  return sanitized;
};

/**
 * Sanitize phone number input
 * @param {string} phone - The phone number to sanitize
 * @returns {string} - Sanitized phone number
 */
export const sanitizePhone = (phone) => {
  if (typeof phone !== 'string') return '';
  
  // Remove all non-digit characters except + and spaces
  return phone.replace(/[^\d\s+-]/g, '').trim();
};

/**
 * Sanitize name input (letters, spaces, hyphens only)
 * @param {string} name - The name to sanitize
 * @returns {string} - Sanitized name
 */
export const sanitizeName = (name) => {
  if (typeof name !== 'string') return '';
  
  let sanitized = DOMPurify.sanitize(name, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
  
  // Allow only letters, spaces, hyphens, and apostrophes
  sanitized = sanitized.replace(/[^a-zA-Z\s'-]/g, '');
  
  // Normalize spaces
  return sanitized.trim().replace(/\s+/g, ' ');
};

/**
 * Sanitize text area input (bio, descriptions)
 * @param {string} text - The text to sanitize
 * @returns {string} - Sanitized text
 */
export const sanitizeTextArea = (text) => {
  if (typeof text !== 'string') return '';
  
  // Allow basic punctuation but remove HTML
  const sanitized = DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
  
  // Trim and normalize line breaks
  return sanitized.trim().replace(/\n{3,}/g, '\n\n');
};

/**
 * Sanitize array of strings
 * @param {Array} array - Array to sanitize
 * @returns {Array} - Sanitized array
 */
export const sanitizeArray = (array) => {
  if (!Array.isArray(array)) return [];
  
  return array
    .map(item => sanitizeString(item))
    .filter(item => item.length > 0);
};

/**
 * Sanitize form data object
 * @param {Object} data - Form data to sanitize
 * @returns {Object} - Sanitized form data
 */
export const sanitizeFormData = (data) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      sanitized[key] = value;
      continue;
    }
    
    // Handle different data types
    if (typeof value === 'string') {
      if (key.toLowerCase().includes('email')) {
        sanitized[key] = sanitizeEmail(value);
      } else if (key.toLowerCase().includes('phone')) {
        sanitized[key] = sanitizePhone(value);
      } else if (key.toLowerCase().includes('name')) {
        sanitized[key] = sanitizeName(value);
      } else if (key.toLowerCase().includes('bio') || key.toLowerCase().includes('description')) {
        sanitized[key] = sanitizeTextArea(value);
      } else {
        sanitized[key] = sanitizeString(value);
      }
    } else if (Array.isArray(value)) {
      sanitized[key] = sanitizeArray(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeFormData(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

// ==================== VALIDATION SCHEMAS ====================

/**
 * Login form validation schema
 */
export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .transform(sanitizeEmail)
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    )
    .email("Please enter a valid email address")
    .max(255, "Email is too long")
    .required("Email is required"),
  
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .max(128, "Password is too long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/,
      "Password must contain uppercase, lowercase, number, and special character"
    )
    .required("Password is required"),
});

/**
 * Registration form validation schema
 */
export const registrationValidationSchema = Yup.object({
  farmName: Yup.string()
    .transform(sanitizeName)
    .matches(/^[A-Za-z\s'-]+$/, "Farm name can only contain letters, spaces, hyphens, and apostrophes")
    .min(3, "Farm name must be at least 3 characters long")
    .max(100, "Farm name is too long")
    .required("Farm name is required"),
  
  email: Yup.string()
    .transform(sanitizeEmail)
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    )
    .email("Please enter a valid email address")
    .max(255, "Email is too long")
    .required("Email is required"),
  
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .max(128, "Password is too long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/,
      "Password must contain uppercase, lowercase, number, and special character"
    )
    .required("Password is required"),
  
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords do not match")
    .required("Confirm password is required"),
});

/**
 * Profile edit form validation schema
 */
export const profileValidationSchema = Yup.object({
  firstName: Yup.string()
    .transform(sanitizeName)
    .matches(/^[A-Za-z\s'-]*$/, "First name can only contain letters")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long"),
  
  lastName: Yup.string()
    .transform(sanitizeName)
    .matches(/^[A-Za-z\s'-]*$/, "Last name can only contain letters")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name is too long"),
  
  farmName: Yup.string()
    .transform(sanitizeName)
    .matches(/^[A-Za-z\s'-]*$/, "Farm name can only contain letters")
    .min(3, "Farm name must be at least 3 characters")
    .max(100, "Farm name is too long"),
  
  email: Yup.string()
    .transform(sanitizeEmail)
    .email("Please enter a valid email address")
    .max(255, "Email is too long"),
  
  phoneNumber: Yup.string()
    .transform(sanitizePhone)
    .matches(/^[\d\s+-]*$/, "Please enter a valid phone number")
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number is too long"),
  
  farmBio: Yup.string()
    .transform(sanitizeTextArea)
    .max(1000, "Bio is too long (max 1000 characters)"),
  
  specialties: Yup.array()
    .of(Yup.string().transform(sanitizeString))
    .max(3, "You can select up to 3 specialties only"),
});

// ==================== VALIDATION HELPERS ====================

/**
 * Validate and sanitize coordinates
 * @param {Array} coordinates - [lat, lng]
 * @returns {Object} - {valid: boolean, sanitized: Array}
 */
export const validateCoordinates = (coordinates) => {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    return { valid: false, sanitized: [30.0444, 31.2357] };
  }
  
  const [lat, lng] = coordinates.map(Number);
  
  // Validate latitude (-90 to 90) and longitude (-180 to 180)
  const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90;
  const isValidLng = !isNaN(lng) && lng >= -180 && lng <= 180;
  
  if (!isValidLat || !isValidLng) {
    return { valid: false, sanitized: [30.0444, 31.2357] };
  }
  
  return { valid: true, sanitized: [lat, lng] };
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean}
 */
export const validateUrl = (url) => {
  if (typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} - {valid: boolean, error: string}
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  } = options;
  
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: `File size must be less than ${maxSize / (1024 * 1024)}MB` };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type must be one of: ${allowedTypes.join(', ')}` };
  }
  
  return { valid: true, error: null };
};

export default {
  // Sanitization
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
  sanitizeName,
  sanitizeTextArea,
  sanitizeArray,
  sanitizeFormData,
  
  // Validation Schemas
  loginValidationSchema,
  registrationValidationSchema,
  profileValidationSchema,
  
  // Helpers
  validateCoordinates,
  validateUrl,
  validateFile,
};
