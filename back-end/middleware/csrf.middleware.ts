import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// Store for CSRF tokens - in production, use Redis or another persistent store
export const tokenStore = new Map<string, { token: string, expires: number }>();

// CSRF token validity duration in milliseconds (30 minutes)
const TOKEN_VALIDITY = 30 * 60 * 1000;

/**
 * Generates a CSRF token and attaches it to the session
 */
export const generateCsrfToken = (req: Request, res: Response) => {
  // Generate a random token
  const token = crypto.randomBytes(32).toString('hex');
  const sessionId = req.headers.authorization || req.ip || 'unknown';
  const expires = Date.now() + TOKEN_VALIDITY;
  
  // Store the token with the session ID and expiration time
  tokenStore.set(sessionId, { token, expires });
  
  // Set token as a custom header to be used in subsequent requests
  res.setHeader('X-CSRF-Token', token);
  
  return token;
};

/**
 * Middleware to protect against CSRF attacks
 * Only applies to state-changing methods (POST, PUT, DELETE, PATCH)
 */
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  const stateChangingMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
  
  // Only check CSRF for state-changing operations
  if (!stateChangingMethods.includes(req.method)) {
    return next();
  }
  
  // Skip CSRF for authentication and non-browser API calls
  if (req.path === '/auth/login' || req.path === '/auth/register') {
    return next();
  }
  
  const sessionId = req.headers.authorization || req.ip || 'unknown';
  const storedData = tokenStore.get(sessionId);
  const csrfToken = req.headers['x-csrf-token'] as string;
  
  // Token validation
  if (!storedData || !csrfToken || storedData.token !== csrfToken) {
    return res.status(403).json({
      message: 'CSRF token missing or invalid'
    });
  }
  
  // Check token expiration
  if (Date.now() > storedData.expires) {
    tokenStore.delete(sessionId);
    return res.status(403).json({
      message: 'CSRF token expired'
    });
  }
  
  // Valid token, continue
  next();
};

/**
 * Middleware to attach a CSRF token to response headers
 * Use this on routes that render forms or prepare for state-changing operations
 */
export const attachCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  generateCsrfToken(req, res);
  next();
};

// Clean up expired tokens periodically
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, data] of tokenStore.entries()) {
    if (now > data.expires) {
      tokenStore.delete(sessionId);
    }
  }
}, 60 * 60 * 1000); // Clean up every hour