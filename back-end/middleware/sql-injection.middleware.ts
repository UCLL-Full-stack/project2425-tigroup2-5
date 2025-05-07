import { Request, Response, NextFunction } from 'express';

/**
 * Regular expressions for detecting potential SQL injection patterns
 */
const SQL_INJECTION_PATTERNS = [
  /(\s|^)(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|FROM|WHERE|ORDER BY|GROUP BY)\s/i,
  /(\s|^)(UNION|JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN)\s/i,
  /(\s|^)(OR|AND)\s+\d+\s*=\s*\d+\s*/i, // Basic boolean-based injection
  /(\s|^)(OR|AND)\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?\s*/i, // More boolean injection
  /--[\s\r\n]/i, // SQL comment
  /;[\s\r\n]*$/i, // SQL statement terminator
  /\/\*.*?\*\//i, // SQL block comment
  /EXEC(\s|\()+sp_/i, // SQL Server stored procedure
  /CONVERT\(/i, // SQL Server conversion
  /WAITFOR(\s|\()+DELAY/i, // SQL Server time-delay
  /DECLARE(\s|\()+@/i, // SQL Server variable
  /XP_CMDSHELL/i, // SQL Server command execution
];

/**
 * Check if a string contains potential SQL injection patterns
 */
const containsSqlInjection = (value: string): boolean => {
  if (typeof value !== 'string') return false;
  
  return SQL_INJECTION_PATTERNS.some(pattern => pattern.test(value));
};

/**
 * Recursively check all string values in an object for SQL injection patterns
 */
const checkObjectForSqlInjection = (obj: any, path: string = ''): string | null => {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const result = checkObjectForSqlInjection(obj[i], `${path}[${i}]`);
      if (result) return result;
    }
  } else if (obj !== null && typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      const result = checkObjectForSqlInjection(value, path ? `${path}.${key}` : key);
      if (result) return result;
    }
  } else if (typeof obj === 'string' && containsSqlInjection(obj)) {
    return path || 'unknown';
  }
  
  return null;
};

/**
 * Middleware to detect potential SQL injection attempts
 * This is a detection layer that works with Prisma's protection
 */
export const sqlInjectionProtection = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check request body
      if (req.body) {
        const bodyInjectionPath = checkObjectForSqlInjection(req.body, 'body');
        if (bodyInjectionPath) {
          console.warn(`Potential SQL injection detected in request body at ${bodyInjectionPath}`);
          return res.status(400).json({
            status: 'error',
            message: 'Invalid input data: potential security threat detected'
          });
        }
      }
      
      // Check URL parameters
      if (req.params) {
        const paramsInjectionPath = checkObjectForSqlInjection(req.params, 'params');
        if (paramsInjectionPath) {
          console.warn(`Potential SQL injection detected in URL parameters at ${paramsInjectionPath}`);
          return res.status(400).json({
            status: 'error',
            message: 'Invalid input data: potential security threat detected'
          });
        }
      }
      
      // Check query parameters
      if (req.query) {
        const queryInjectionPath = checkObjectForSqlInjection(req.query, 'query');
        if (queryInjectionPath) {
          console.warn(`Potential SQL injection detected in query parameters at ${queryInjectionPath}`);
          return res.status(400).json({
            status: 'error',
            message: 'Invalid input data: potential security threat detected'
          });
        }
      }
      
      // All checks passed
      next();
    } catch (error) {
      console.error('Error in SQL injection protection middleware:', error);
      next(new Error('Error processing request'));
    }
  };
};

/**
 * Prepare a value for safe use in database operations
 * Note: With Prisma ORM, parameterization is automatic, but this can be used as an additional layer
 */
export const sanitizeForDatabase = (value: string): string => {
  if (typeof value !== 'string') return value;
  
  // Remove or escape characters that could be used in SQL injection
  return value
    .replace(/'/g, "''") // Escape single quotes
    .replace(/;/g, '') // Remove semicolons
    .replace(/--/g, '') // Remove comment markers
    .replace(/\/\*/g, '') // Remove comment markers
    .replace(/\*\//g, '') // Remove comment markers
    .replace(/xp_/gi, '') // Remove stored procedure prefixes
    .replace(/exec\s+/gi, '') // Remove exec calls
    .trim();
};