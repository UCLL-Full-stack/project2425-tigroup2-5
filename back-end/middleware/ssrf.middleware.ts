import { Request, Response, NextFunction } from 'express';
import { URL } from 'url';
import net from 'net';
import dns from 'dns';
import { promisify } from 'util';

const dnsLookup = promisify(dns.lookup);

// IP ranges to block (private, loopback, link-local)
const BLOCKED_IP_RANGES = [
  // Private IPv4 ranges
  { start: '10.0.0.0', end: '10.255.255.255' },       // 10.0.0.0/8
  { start: '172.16.0.0', end: '172.31.255.255' },     // 172.16.0.0/12
  { start: '192.168.0.0', end: '192.168.255.255' },   // 192.168.0.0/16
  
  // Loopback
  { start: '127.0.0.0', end: '127.255.255.255' },     // 127.0.0.0/8
  
  // Link-local
  { start: '169.254.0.0', end: '169.254.255.255' },   // 169.254.0.0/16
  
  // Other special-use addresses
  { start: '0.0.0.0', end: '0.255.255.255' },         // 0.0.0.0/8
  { start: '100.64.0.0', end: '100.127.255.255' },    // 100.64.0.0/10 (Carrier NAT)
  { start: '192.0.0.0', end: '192.0.0.255' },         // 192.0.0.0/24
  { start: '192.0.2.0', end: '192.0.2.255' },         // 192.0.2.0/24 (TEST-NET-1)
  { start: '192.88.99.0', end: '192.88.99.255' },     // 192.88.99.0/24
  { start: '198.18.0.0', end: '198.19.255.255' },     // 198.18.0.0/15
  { start: '198.51.100.0', end: '198.51.100.255' },   // 198.51.100.0/24 (TEST-NET-2)
  { start: '203.0.113.0', end: '203.0.113.255' },     // 203.0.113.0/24 (TEST-NET-3)
  { start: '224.0.0.0', end: '239.255.255.255' },     // 224.0.0.0/4 (Multicast)
  { start: '240.0.0.0', end: '255.255.255.255' },     // 240.0.0.0/4 (Reserved)
];

// List of allowed domains for outbound requests
const ALLOWED_DOMAINS = process.env.ALLOWED_EXTERNAL_DOMAINS 
  ? process.env.ALLOWED_EXTERNAL_DOMAINS.split(',') 
  : ['api.example.com', 'cdn.example.com'];

// Convert IP address to a numeric value for range comparison
function ipToLong(ip: string): number {
  let result = 0;
  const parts = ip.split('.');
  
  for (let i = 0; i < parts.length; i++) {
    result = result * 256 + parseInt(parts[i], 10);
  }
  
  return result >>> 0; // Force unsigned
}

// Check if an IP is within a blocked range
function isIpBlocked(ip: string): boolean {
  const ipLong = ipToLong(ip);
  
  for (const range of BLOCKED_IP_RANGES) {
    const startLong = ipToLong(range.start);
    const endLong = ipToLong(range.end);
    
    if (ipLong >= startLong && ipLong <= endLong) {
      return true;
    }
  }
  
  return false;
}

// Check if hostname resolves to a blocked IP
async function isHostnameBlocked(hostname: string): Promise<boolean> {
  try {
    // Skip IP check for allowed domains
    if (ALLOWED_DOMAINS.includes(hostname)) {
      return false;
    }
    
    // Check if hostname is an IP address
    if (net.isIP(hostname)) {
      return isIpBlocked(hostname);
    }
    
    // Resolve hostname to IP
    const { address } = await dnsLookup(hostname);
    return isIpBlocked(address);
  } catch (error) {
    // If DNS lookup fails, block by default
    console.error(`SSRF protection: DNS resolution failed for ${hostname}`, error);
    return true;
  }
}

// Validate URL for SSRF protection
async function validateUrl(url: string): Promise<{ valid: boolean; reason?: string }> {
  try {
    // Parse and validate URL format
    const parsedUrl = new URL(url);
    
    // Block non-HTTP(S) protocols
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return { valid: false, reason: 'Invalid protocol' };
    }
    
    // Block localhost domains
    if (parsedUrl.hostname === 'localhost' || 
        parsedUrl.hostname === '127.0.0.1' || 
        parsedUrl.hostname === '::1') {
      return { valid: false, reason: 'Localhost not allowed' };
    }
    
    // Only allow specific domains if defined in allowlist
    if (ALLOWED_DOMAINS.length > 0 && !ALLOWED_DOMAINS.includes(parsedUrl.hostname)) {
      return { valid: false, reason: 'Domain not in allowlist' };
    }
    
    // Check if hostname resolves to blocked IP range
    const isBlocked = await isHostnameBlocked(parsedUrl.hostname);
    if (isBlocked) {
      return { valid: false, reason: 'Resolves to blocked IP range' };
    }
    
    // URL passed all checks
    return { valid: true };
  } catch (error) {
    return { valid: false, reason: 'Invalid URL format' };
  }
}

// SSRF Protection Middleware
export function ssrfProtection() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract URLs from the request for validation
      const urlsToValidate: string[] = [];
      
      // Check URL parameters
      if (req.query.url) urlsToValidate.push(req.query.url as string);
      if (req.query.uri) urlsToValidate.push(req.query.uri as string);
      if (req.query.endpoint) urlsToValidate.push(req.query.endpoint as string);
      
      // Check URL in request body
      if (req.body) {
        if (req.body.url) urlsToValidate.push(req.body.url);
        if (req.body.uri) urlsToValidate.push(req.body.uri);
        if (req.body.endpoint) urlsToValidate.push(req.body.endpoint);
        
        // Check for URLs in nested properties (e.g., for webhook configurations)
        if (req.body.webhook?.url) urlsToValidate.push(req.body.webhook.url);
        if (req.body.callback?.endpoint) urlsToValidate.push(req.body.callback.endpoint);
      }
      
      for (const url of urlsToValidate) {
        if (typeof url !== 'string') continue;
        
        const { valid, reason } = await validateUrl(url);
        if (!valid) {
          console.warn(`SSRF attempt blocked: ${reason}, URL: ${url}`);
          return res.status(403).json({ 
            status: 'error', 
            message: 'URL validation failed',
            requestId: req.headers['x-request-id']
          });
        }
      }
      
      next();
    } catch (error) {
      console.error('Error in SSRF protection middleware:', error);
      next(error);
    }
  };
}
