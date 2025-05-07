import { Request, Response, NextFunction } from 'express';

// Enhanced sanitization - protects against a wider range of XSS patterns
const sanitizeString = (value: string): string => {
  if (typeof value !== 'string') return value;
  
  // Remove potential script tags and other dangerous HTML elements
  let sanitized = value
    // Handle script tags and other risky HTML elements
    .replace(/<(script|iframe|object|embed|form|meta|svg|style|link|applet|math|xml)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(script|iframe|object|embed|form|meta|svg|style|link|applet|math|xml)[^>]*>/gi, '')
    .replace(/<\/*(script|iframe|object|embed|form|meta|svg|style|link|applet|math|xml)[^>]*>/gi, '')
    
    // Handle javascript: protocol and other dangerous protocols
    .replace(/(javascript|data|vbscript|mhtml):/gi, '')
    
    // Handle event handlers
    .replace(/on\w+\s*=\s*(['"])[^'"]*\1/gi, '')
    .replace(/on\w+\s*=/gi, '')
    
    // Handle expression() and other CSS-based attacks
    .replace(/expression\s*\(|behavior\s*:|url\s*\(/gi, '')
    
    // HTML entities that could be used in attacks
    .replace(/&#x([0-9a-f]+);?/gi, '')
    .replace(/&#([0-9]+);?/gi, '')
    
    // Base64 detection - remove suspicious patterns
    .replace(/src\s*=\s*['"]data:text\/html;base64,[^'"]*['"]/gi, '')
    
    // SVG animations that could contain scripts
    .replace(/<animate[^>]*>/gi, '')
    .replace(/<set[^>]*>/gi, '');
    
  return sanitized.trim();
};

// Recursive function to sanitize all string values in an object
const sanitizeObject = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  } else if (obj !== null && typeof obj === 'object') {
    const sanitizedObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitizedObj[key] = sanitizeObject(value);
    }
    return sanitizedObj;
  } else if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  return obj;
};

/**
 * Middleware to validate request parameters to prevent injection attacks
 */
export const validateRequest = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Sanitize request body, query parameters, and URL parameters
      if (req.body && Object.keys(req.body).length > 0) {
        req.body = sanitizeObject(req.body);
      }
      
      if (req.query && Object.keys(req.query).length > 0) {
        req.query = sanitizeObject(req.query);
      }
      
      if (req.params && Object.keys(req.params).length > 0) {
        req.params = sanitizeObject(req.params);
      }
      
      next();
    } catch (error) {
      next(new Error('Invalid input data'));
    }
  };
};

/**
 * Validate specific field types
 * Can be used on specific routes that need strict validation
 */
export const validateFields = (schema: Record<string, (value: any) => boolean>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors: string[] = [];
      
      // Check each field against its validator
      for (const [field, validator] of Object.entries(schema)) {
        const value = req.body[field];
        
        // If field exists and fails validation
        if (value !== undefined && !validator(value)) {
          errors.push(`Invalid value for field: ${field}`);
        }
      }
      
      if (errors.length > 0) {
        return res.status(400).json({ 
          status: 'error', 
          message: 'Validation failed', 
          errors 
        });
      }
      
      next();
    } catch (error) {
      next(new Error('Validation error'));
    }
  };
};

// Common validators
export const validators = {
  // String validators
  isNonEmptyString: (value: any): boolean => 
    typeof value === 'string' && value.trim().length > 0,
  
  isEmail: (value: any): boolean => 
    typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  
  isAlphanumeric: (value: any): boolean =>
    typeof value === 'string' && /^[a-zA-Z0-9]+$/.test(value),
  
  isAlphaWithSpaces: (value: any): boolean =>
    typeof value === 'string' && /^[a-zA-Z\s]+$/.test(value),
  
  isPhone: (value: any): boolean =>
    typeof value === 'string' && /^[0-9+\-\s()]+$/.test(value),
    
  // Number validators
  isPositiveNumber: (value: any): boolean =>
    typeof value === 'number' && value > 0,
  
  isWholeNumber: (value: any): boolean =>
    typeof value === 'number' && Number.isInteger(value) && value >= 0,
  
  // Boolean validators
  isBoolean: (value: any): boolean =>
    typeof value === 'boolean',
  
  // Date validators
  isValidDate: (value: any): boolean => {
    if (!value) return false;
    const date = new Date(value);
    return !isNaN(date.getTime());
  },
  
  isFutureDate: (value: any): boolean => {
    if (!value) return false;
    const date = new Date(value);
    return !isNaN(date.getTime()) && date > new Date();
  },
  
  isPastDate: (value: any): boolean => {
    if (!value) return false;
    const date = new Date(value);
    return !isNaN(date.getTime()) && date < new Date();
  },
  
  // Array validators
  isNonEmptyArray: (value: any): boolean =>
    Array.isArray(value) && value.length > 0,
  
  // Special validators
  isPassword: (value: any): boolean =>
    typeof value === 'string' && 
    value.length >= 8 && 
    /[A-Z]/.test(value) && // Has uppercase
    /[a-z]/.test(value) && // Has lowercase
    /[0-9]/.test(value) && // Has number
    /[^A-Za-z0-9]/.test(value), // Has special char
  
  matchesPattern: (pattern: RegExp) => (value: any): boolean =>
    typeof value === 'string' && pattern.test(value),
};

// Example of how to use the field validator:
//
// app.post('/user', validateFields({
//   email: validators.isEmail,
//   firstName: validators.isAlphaWithSpaces,
//   age: validators.isWholeNumber,
//   password: validators.isPassword
// }), userController.createUser);