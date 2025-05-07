import { Request, Response, NextFunction } from 'express';

// Enhanced in-memory store for rate limiting with more tracking data
const ipRequestMap = new Map<string, { 
  count: number, 
  resetTime: number,
  userAgents: Set<string>,
  consecutiveFailures: number 
}>();

// Blacklisted user agents often used in automated attacks
const suspiciousUserAgents = [
  'burp', 'dirbuster', 'nikto', 'nessus', 'sqlmap', 'arachni',
  'ZAP', 'w3af', 'scanner', 'nmap', 'python-requests', 'go-http-client'
];

interface RateLimiterOptions {
  windowMs: number;         // Time window in milliseconds
  maxRequests: number;      // Maximum number of requests in the time window
  message: string;          // Error message to return when rate limit is exceeded
  skipSuccessfulRequests?: boolean; // Don't count successful responses
}

/**
 * Creates an enhanced rate limiter middleware
 * More resilient against Burp Suite and similar tools
 */
export const createRateLimiter = (options: RateLimiterOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes by default
  maxRequests: 100,         // 100 requests per windowMs by default
  message: 'Too many requests, please try again later.',
  skipSuccessfulRequests: false
}) => {
  
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const key = `${ip}:${req.path}`; // Track by IP and path for more granular control
    const now = Date.now();
    
    // Check for suspicious user agents
    const isSuspiciousUA = suspiciousUserAgents.some(agent => 
      userAgent.toLowerCase().includes(agent.toLowerCase())
    );
    
    // Apply stricter limits for suspicious user agents
    let effectiveMaxRequests = isSuspiciousUA ? Math.floor(options.maxRequests / 5) : options.maxRequests;
    
    // Get or create entry for this key
    const ipData = ipRequestMap.get(key) || { 
      count: 0, 
      resetTime: now + options.windowMs,
      userAgents: new Set<string>(),
      consecutiveFailures: 0 
    };
    
    // Reset count if the window has passed
    if (now > ipData.resetTime) {
      ipData.count = 0;
      ipData.resetTime = now + options.windowMs;
      // Don't reset userAgents or consecutiveFailures - tracking those longer term
    }
    
    // Track user agent variety (multiple user-agents from same IP is suspicious)
    ipData.userAgents.add(userAgent);
    
    // Increment request count
    ipData.count++;
    
    // Update the map
    ipRequestMap.set(key, ipData);
    
    res.setHeader('X-RateLimit-Limit', effectiveMaxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', Math.max(0, effectiveMaxRequests - ipData.count).toString());
    res.setHeader('X-RateLimit-Reset', Math.ceil(ipData.resetTime / 1000).toString());
    
    const originalEnd = res.end;
    res.end = function(chunk?: any, encodingOrCallback?: string | (() => void), callback?: () => void): Response {
      if (typeof encodingOrCallback === 'function') {
        callback = encodingOrCallback;
        encodingOrCallback = undefined;
      }
      if (options.skipSuccessfulRequests && res.statusCode >= 200 && res.statusCode < 300) {
        ipData.count--; // Don't count successful requests if that option is enabled
        ipData.consecutiveFailures = 0; // Reset failure counter on success
      } else if (res.statusCode === 401 || res.statusCode === 403) {
        ipData.consecutiveFailures++; // Track consecutive auth failures
      }
      
      return originalEnd.call(this, chunk, encodingOrCallback as BufferEncoding || undefined, callback);
    };
    
    if (ipData.consecutiveFailures > 5) {
      effectiveMaxRequests = Math.floor(effectiveMaxRequests / 2);
    }
    
    if (ipData.userAgents.size > 3) {
      effectiveMaxRequests = Math.floor(effectiveMaxRequests / 2);
    }
    
    if (ipData.count > effectiveMaxRequests || isSuspiciousUA) {
      setTimeout(() => {
        return res.status(429).json({
          message: options.message,
          retryAfter: Math.ceil((ipData.resetTime - now) / 1000)
        });
      }, 1000 + Math.random() * 2000);
      return;
    }
    
    next();
  };
};

setInterval(() => {
  const now = Date.now();
  for (const [key, data] of ipRequestMap.entries()) {
    if (now > data.resetTime + (24 * 60 * 60 * 1000)) {
      ipRequestMap.delete(key);
    }
  }
}, 60 * 60 * 1000);

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 10, 
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true
});