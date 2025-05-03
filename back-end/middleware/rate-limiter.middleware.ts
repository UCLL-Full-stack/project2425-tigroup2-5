import { Request, Response, NextFunction } from 'express';

// Simple in-memory store for rate limiting
const ipRequestMap = new Map<string, { count: number, resetTime: number }>();

interface RateLimiterOptions {
  windowMs: number;       // Time window in milliseconds
  maxRequests: number;    // Maximum number of requests in the time window
  message: string;        // Error message to return when rate limit is exceeded
}

/**
 * Creates a rate limiter middleware
 * This is a simplified version of express-rate-limit
 */
export const createRateLimiter = (options: RateLimiterOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes by default
  maxRequests: 100,         // 100 requests per windowMs by default
  message: 'Too many requests, please try again later.'
}) => {
  
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    
    // Get or create entry for this IP
    const ipData = ipRequestMap.get(ip) || { count: 0, resetTime: now + options.windowMs };
    
    // Reset count if the window has passed
    if (now > ipData.resetTime) {
      ipData.count = 0;
      ipData.resetTime = now + options.windowMs;
    }
    
    // Increment request count
    ipData.count++;
    
    // Update the map
    ipRequestMap.set(ip, ipData);
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', options.maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', Math.max(0, options.maxRequests - ipData.count).toString());
    res.setHeader('X-RateLimit-Reset', Math.ceil(ipData.resetTime / 1000).toString());
    
    // If rate limit exceeded, return 429 Too Many Requests
    if (ipData.count > options.maxRequests) {
      return res.status(429).json({
        message: options.message
      });
    }
    
    next();
  };
};

// Periodically clean up old entries to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipRequestMap.entries()) {
    if (now > data.resetTime) {
      ipRequestMap.delete(ip);
    }
  }
}, 60 * 60 * 1000); // Clean up every hour

// Stricter rate limiter specifically for auth endpoints
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 50, // Increased from 5 to 50 for development purposes
  message: 'Too many login attempts, please try again later.'
});