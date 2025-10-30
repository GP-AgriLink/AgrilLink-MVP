import * as Yup from "yup";
import DOMPurify from 'dompurify';

/**
 * Sanitize string input to prevent XSS attacks
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';
  
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
  
  return sanitized.trim().replace(/\s+/g, ' ');
};

export const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return '';
  
  let sanitized = email.toLowerCase().trim();
  
  sanitized = DOMPurify.sanitize(sanitized, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
  
  sanitized = sanitized.replace(/[^\w.@+-]/g, '');
  
  return sanitized;
};

export const sanitizePhone = (phone) => {
  if (typeof phone !== 'string') return '';
  return phone.replace(/[^\d\s+-]/g, '').trim();
};

export const validateEgyptianPhone = (phone) => {
  if (typeof phone !== 'string') return false;
  
  const cleaned = phone.replace(/[\s-]/g, '');
  
  const egyptianMobileRegex = /^01[0125]\d{8}$/;
  
  return egyptianMobileRegex.test(cleaned);
};

export const sanitizeName = (name) => {
  if (typeof name !== 'string') return '';
  
  let sanitized = DOMPurify.sanitize(name, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
  
  sanitized = sanitized.replace(/[^a-zA-Z\s'-]/g, '');
  
  return sanitized.trim().replace(/\s+/g, ' ');
};

export const sanitizeTextArea = (text) => {
  if (typeof text !== 'string') return '';
  
  const sanitized = DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
  
  return sanitized.trim().replace(/\n{3,}/g, '\n\n');
};

export const sanitizeArray = (array) => {
  if (!Array.isArray(array)) return [];
  
  return array
    .map(item => sanitizeString(item))
    .filter(item => item.length > 0);
};

export const sanitizeFormData = (data) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      sanitized[key] = value;
      continue;
    }
    
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

/**
 * Login validation - uses generic error messages to prevent username enumeration attacks
 */
export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .transform(sanitizeEmail)
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    )
    .email("Invalid email format")
    .max(255, "Email exceeds maximum length")
    .required("Email is required"),
  
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password exceeds maximum length")
    .required("Password is required"),
});

/**
 * Registration validation - enforces strong password requirements to prevent dictionary attacks
 */
export const registrationValidationSchema = Yup.object({
  farmName: Yup.string()
    .transform(sanitizeName)
    .matches(/^[A-Za-z\s'-]+$/, "Farm name can only contain letters, spaces, hyphens, and apostrophes")
    .min(3, "Farm name must be at least 3 characters")
    .max(100, "Farm name exceeds maximum length")
    .required("Farm name is required"),
  
  email: Yup.string()
    .transform(sanitizeEmail)
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    )
    .email("Invalid email format")
    .max(255, "Email exceeds maximum length")
    .required("Email is required"),
  
  phoneNumber: Yup.string()
    .transform(sanitizePhone)
    .test('is-egyptian-mobile', 'Please enter a valid Egyptian mobile number (e.g., 01012345678)', function(value) {
      if (!value) return false;
      return validateEgyptianPhone(value);
    })
    .required("Phone number is required"),
  
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password exceeds maximum length")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/,
      "Password must include uppercase, lowercase, number, and special character (@$!%*?&)"
    )
    .required("Password is required"),
  
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

export const profileValidationSchema = Yup.object({
  firstName: Yup.string()
    .transform(sanitizeName)
    .matches(/^[A-Za-z\s'-]*$/, "First name can only contain letters")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name exceeds maximum length"),
  
  lastName: Yup.string()
    .transform(sanitizeName)
    .matches(/^[A-Za-z\s'-]*$/, "Last name can only contain letters")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name exceeds maximum length"),
  
  farmName: Yup.string()
    .transform(sanitizeName)
    .matches(/^[A-Za-z\s'-]*$/, "Farm name can only contain letters")
    .min(3, "Farm name must be at least 3 characters")
    .max(100, "Farm name exceeds maximum length"),
  
  email: Yup.string()
    .transform(sanitizeEmail)
    .email("Invalid email format")
    .max(255, "Email exceeds maximum length"),
  
  phoneNumber: Yup.string()
    .transform(sanitizePhone)
    .test('is-egyptian-mobile', 'Please enter a valid Egyptian mobile number (e.g., 01012345678)', function(value) {
      if (!value) return true;
      return validateEgyptianPhone(value);
    })
    .required("Phone number is required"),
  
  farmBio: Yup.string()
    .transform(sanitizeTextArea)
    .max(1000, "Bio exceeds maximum length (1000 characters)"),
  
  specialties: Yup.array()
    .of(Yup.string().transform(sanitizeString))
    .max(3, "You can select up to 3 specialties only"),
  
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password exceeds maximum length")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/,
      "Password must include uppercase, lowercase, number, and special character (@$!%*?&)"
    ),
  
  confirmPassword: Yup.string()
    .when('password', {
      is: (password) => password && password.length > 0,
      then: (schema) => schema
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Please confirm your password"),
    }),
});

export const validateCoordinates = (coordinates) => {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    return { valid: false, sanitized: [30.0444, 31.2357] };
  }
  
  const [lat, lng] = coordinates.map(Number);
  
  const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90;
  const isValidLng = !isNaN(lng) && lng >= -180 && lng <= 180;
  
  if (!isValidLat || !isValidLng) {
    return { valid: false, sanitized: [30.0444, 31.2357] };
  }
  
  return { valid: true, sanitized: [lat, lng] };
};

export const validateUrl = (url) => {
  if (typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024,
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
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
  sanitizeName,
  sanitizeTextArea,
  sanitizeArray,
  sanitizeFormData,
  validateEgyptianPhone,
  loginValidationSchema,
  registrationValidationSchema,
  profileValidationSchema,
  validateCoordinates,
  validateUrl,
  validateFile,
};
