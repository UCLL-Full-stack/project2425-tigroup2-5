import { Request, Response, NextFunction } from 'express';
import authService from '../service/auth.service';
import crypto from 'crypto';

// Token blacklist for invalidated tokens (e.g., after logout)
// In production, use Redis or a database for this
const TOKEN_BLACKLIST = new Set<string>();

// Store for tracking failed authentication attempts by IP
const failedAuthAttempts = new Map<string, { count: number, lastAttempt: number }>();

// Extend the Express Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
      sessionId?: string;
    }
  }
}

/**
 * Helper function to hash a token - used for blacklisting without storing actual tokens
 */
const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Middleware to check if the user is authenticated
 * Enhanced with additional security checks against Burp Suite attacks
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const tokenHash = hashToken(token);
    
    // Check if token is blacklisted (revoked)
    if (TOKEN_BLACKLIST.has(tokenHash)) {
      // Track failed attempt
      recordFailedAuthAttempt(clientIp);
      return res.status(401).json({ message: 'Token has been revoked.' });
    }
    
    // Verify the token
    const decoded = authService.verifyToken(token);
    
    // Ensure decoded has the expected structure
    if (!decoded || typeof decoded !== 'object' || !decoded.id) {
      console.error('Invalid token format:', decoded);
      // Track failed attempt
      recordFailedAuthAttempt(clientIp);
      return res.status(401).json({ message: 'Invalid token format.' });
    }
    
    // Check for token replay across different clients
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    // Generate a session ID from user info and user-agent
    // This helps detect if a token is used from a different device/browser
    const sessionId = hashToken(`${decoded.id}-${userAgent}`);
    req.sessionId = sessionId;
    
    // Add user info to request object
    req.user = decoded;
    
    // Add debug logging (with PII sanitization for production)
    const isProduction = process.env.NODE_ENV === 'production';
    console.log(`Authenticated user: ${JSON.stringify({
      id: decoded.id,
      role: decoded.role,
      email: isProduction ? '***@***' : decoded.email, // Mask email in production
      sessionId: sessionId.substr(0, 8) + '...' // Only log part of the session ID
    })}`);
    
    next();
  } catch (error) {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    console.error('Authentication error:', error);
    // Track failed attempt
    recordFailedAuthAttempt(clientIp);
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

/**
 * Record a failed authentication attempt and check for brute force attacks
 */
function recordFailedAuthAttempt(ip: string) {
  const now = Date.now();
  const record = failedAuthAttempts.get(ip) || { count: 0, lastAttempt: now };
  
  // Reset count if last attempt was more than 30 minutes ago
  if (now - record.lastAttempt > 30 * 60 * 1000) {
    record.count = 0;
  }
  
  record.count++;
  record.lastAttempt = now;
  
  failedAuthAttempts.set(ip, record);
  
  // Log potential brute force attacks
  if (record.count >= 5) {
    console.warn(`Potential brute force attack detected from IP ${ip} (${record.count} failed attempts)`);
  }
}

/**
 * Add a token to the blacklist (e.g. after logout)
 */
export const blacklistToken = (token: string) => {
  const tokenHash = hashToken(token);
  TOKEN_BLACKLIST.add(tokenHash);
  
  // Clean up blacklist periodically to prevent memory leaks
  setTimeout(() => {
    TOKEN_BLACKLIST.delete(tokenHash);
  }, 24 * 60 * 60 * 1000); // Remove after 24 hours
};

/**
 * Middleware to check if the user is an admin
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  if (req.user.role !== 'admin') {
    // Log unauthorized access attempts
    console.warn(`Unauthorized admin access attempt by user ID ${req.user.id}`);
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  
  next();
};

/**
 * Middleware to check if the user is an employee or admin
 */
export const isEmployee = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  if (req.user.role !== 'employee' && req.user.role !== 'admin') {
    // Log unauthorized access attempts
    console.warn(`Unauthorized employee access attempt by user ID ${req.user.id}`);
    return res.status(403).json({ message: 'Access denied. Employee privileges required.' });
  }
  
  next();
};

/**
 * Middleware to check if user is accessing their own resource or is an admin
 */
export const isOwnerOrAdmin = (paramIdField: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }
    
    // User can access their own resources
    const resourceId = parseInt(req.params[paramIdField]);
    if (!isNaN(resourceId) && req.user.id === resourceId) {
      return next();
    }
    
    // Log unauthorized access attempts
    console.warn(`Unauthorized resource access attempt by user ID ${req.user.id} to resource ${resourceId}`);
    return res.status(403).json({ 
      message: 'Access denied. You can only access your own resources.' 
    });
  };
};

// Clean up the failed attempts map periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of failedAuthAttempts.entries()) {
    // Remove entries older than 1 hour
    if (now - data.lastAttempt > 60 * 60 * 1000) {
      failedAuthAttempts.delete(ip);
    }
  }
}, 10 * 60 * 1000); // Clean up every 10 minutes