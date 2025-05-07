import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { generateCSPNonce } from './middleware/csp';

/**
 * Next.js middleware to handle security headers and other request processing
 */
export function middleware(request: NextRequest) {
  // Apply CSP nonce generation
  const response = generateCSPNonce(request);
  
  return response;
}

// Specify which routes this middleware will run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};