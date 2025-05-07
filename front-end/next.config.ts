import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Allow scripts from same origin and specified sources
              "script-src 'self' 'nonce-{{nonce}}' *.trusted-analytics.com",
              // Allow styles from same origin
              "style-src 'self' 'unsafe-inline'", // Unsafe-inline needed for Next.js styling
              // Allow images from same origin, data URIs, and trusted sources 
              "img-src 'self' data: *.trusted-cdn.com",
              // Allow connections to backend API
              "connect-src 'self' " + (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'),
              // Font sources
              "font-src 'self'",
              // Block object sources
              "object-src 'none'",
              // Media sources
              "media-src 'self'",
              // Block frames
              "frame-src 'none'",
              // Base URI restriction
              "base-uri 'self'",
              // Form targets
              "form-action 'self'",
              // Frame ancestors
              "frame-ancestors 'none'",
              // Upgrade insecure requests
              ...(process.env.NODE_ENV === 'production' ? ["upgrade-insecure-requests"] : []),
            ].join('; ')
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'accelerometer=(), camera=(), geolocation=(), microphone=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
  reactStrictMode: true,
};

export default nextConfig;
