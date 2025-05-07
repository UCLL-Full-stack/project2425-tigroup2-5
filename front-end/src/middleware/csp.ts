import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Middleware to generate a CSP nonce and apply it to the response headers
 */
export function generateCSPNonce(request: NextRequest) {
  // Generate a new nonce for each request
  const nonce = crypto.randomBytes(16).toString('base64');
  
  // Clone the response
  const response = NextResponse.next();
  
  // Get the existing CSP header
  let csp = response.headers.get('Content-Security-Policy') || '';
  
  // Replace {{nonce}} placeholder with the actual nonce value
  csp = csp.replace(/nonce-{{nonce}}/g, `nonce-${nonce}`);
  
  // Set the updated CSP header
  response.headers.set('Content-Security-Policy', csp);
  
  // Add the nonce to headers so it can be accessed from components
  response.headers.set('X-Nonce', nonce);
  
  return response;
}