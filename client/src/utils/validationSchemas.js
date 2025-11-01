/**
 * Validation Schemas
 * Yup validation schemas for forms
 * 
 * Import: import { loginValidationSchema } from '../utils/validationSchemas';
 */

import * as Yup from 'yup';
import { sanitizeEmail, sanitizeName, sanitizePhone, sanitizeString, sanitizeTextArea } from './sanitizers';
import { validateEgyptianPhone } from './validators';

/**
 * Login validation schema
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
 * Registration validation schema
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
    .test('is-egyptian-mobile', 'Please enter a valid Egyptian mobile number (e.g., 01012345678, 01221234567)', function(value) {
      return !value || validateEgyptianPhone(value);
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

/**
 * Profile validation schema
 */
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
    .test('is-egyptian-mobile', 'Please enter a valid Egyptian mobile number (e.g., 01012345678, 01221234567)', function(value) {
      return !value || validateEgyptianPhone(value);
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

/**
 * Product validation schema
 */
export const productValidationSchema = Yup.object({
  name: Yup.string()
    .transform(sanitizeString)
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name exceeds maximum length (100 characters)")
    .matches(/^[A-Za-z0-9\s'-.,&()]+$/, "Product name contains invalid characters")
    .required("Product name is required"),
  
  price: Yup.number()
    .typeError("Price must be a valid number")
    .min(0.01, "Price must be at least $0.01")
    .max(999999.99, "Price exceeds maximum value")
    .test('decimal-places', 'Price can have at most 2 decimal places', 
      value => !value || /^\d+(\.\d{1,2})?$/.test(value.toString())
    )
    .required("Price is required"),
  
  unit: Yup.string()
    .transform(sanitizeString)
    .min(1, "Unit is required")
    .max(50, "Unit name exceeds maximum length")
    .matches(/^[A-Za-z0-9\s()/-]+$/, "Unit contains invalid characters")
    .required("Unit is required"),
  
  stock: Yup.number()
    .typeError("Stock must be a valid number")
    .integer("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .max(999999, "Stock exceeds maximum value")
    .required("Stock quantity is required"),
  
  description: Yup.string()
    .transform(sanitizeTextArea)
    .max(1000, "Description exceeds maximum length (1000 characters)"),
  
  imageUrl: Yup.string()
    .transform(sanitizeString)
    .url("Must be a valid URL")
    .max(500, "Image URL exceeds maximum length"),
});
