import { NextRequest, NextResponse } from 'next/server';
// Remove Node.js crypto and use Web Crypto API instead

/**
 * Generate a CSP nonce and apply it to the response headers
 * This helps prevent malicious scripts while allowing legitimate ones
 */
export function generateCSPNonce(request: NextRequest) {
  // Generate a new nonce using Web Crypto API
  const randomValues = new Uint8Array(16);
  crypto.getRandomValues(randomValues);
  const nonce = Array.from(randomValues)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16); // Use 16 characters for the nonce
  
  // Clone the response
  const response = NextResponse.next();
  
  // Build a strict CSP with nonce
  const cspHeader = [
    // Default fallback
    "default-src 'self'",
    // Scripts - only allow from same origin and with nonce
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    // Styles - restrict to self
    "style-src 'self' 'unsafe-inline'", // Unsafe-inline needed for Next.js styling
    // Images - allow data URIs for small icons etc.
    "img-src 'self' data: blob:",
    // Connect sources - allow API
    `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}`,
    // Fonts
    "font-src 'self'",
    // Object sources - block
    "object-src 'none'",
    // Media
    "media-src 'self'",
    // Frame sources - block
    "frame-src 'none'",
    // Base URI - restrict to same origin
    "base-uri 'self'",
    // Form targets
    "form-action 'self'",
    // Frame ancestors - prevent clickjacking 
    "frame-ancestors 'none'",
    // Manifest
    "manifest-src 'self'",
    // Block HTTP resource loading on HTTPS page
    ...(process.env.NODE_ENV === 'production' ? ["upgrade-insecure-requests"] : []),
    // Report violations
    ...(process.env.CSP_REPORT_URI ? [`report-uri ${process.env.CSP_REPORT_URI}`] : []),
    // Report-only mode for gradual deployment
    ...(process.env.CSP_REPORT_ONLY === 'true' ? ["report-to csp-endpoint"] : [])
  ].join('; ');
  
  // Set the updated CSP header
  if (process.env.CSP_REPORT_ONLY === 'true') {
    response.headers.set('Content-Security-Policy-Report-Only', cspHeader);
  } else {
    response.headers.set('Content-Security-Policy', cspHeader);
  }
  
  // Add other security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'accelerometer=(), camera=(), geolocation=(), microphone=()');
  
  // Store nonce in headers for access in components
  response.headers.set('X-Nonce', nonce);
  
  return response;
}