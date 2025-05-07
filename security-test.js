/**
 * Security Test Script for CORS and CSP
 * Run this with Node.js to test your security configurations
 */
const fetch = require('node-fetch');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

/**
 * Test CORS configuration by sending requests from various origins
 */
async function testCORS() {
  console.log('===== TESTING CORS CONFIGURATION =====');
  
  const endpoints = [
    '/status',
    '/person',
    '/auth/login'
  ];
  
  const origins = [
    FRONTEND_URL,
    'https://malicious-site.example.com',
    null // No origin
  ];

  for (const endpoint of endpoints) {
    console.log(`\nTesting endpoint: ${endpoint}`);
    
    for (const origin of origins) {
      try {
        const headers = {};
        if (origin) {
          headers['Origin'] = origin;
        }
        
        const response = await fetch(`${BACKEND_URL}${endpoint}`, { 
          method: 'GET',
          headers
        });
        
        console.log(`Origin: ${origin || 'No Origin'}`);
        console.log(`Status: ${response.status}`);
        console.log(`Access-Control-Allow-Origin: ${response.headers.get('access-control-allow-origin') || 'Not set'}`);
        
      } catch (error) {
        console.error(`Error with origin ${origin}: ${error.message}`);
      }
    }
  }
}

/**
 * Test CSP configuration by checking headers
 */
async function testCSP() {
  console.log('\n===== TESTING CSP CONFIGURATION =====');
  
  try {
    // Test backend CSP
    const backendResponse = await fetch(BACKEND_URL);
    console.log('\nBackend CSP Headers:');
    console.log(`Content-Security-Policy: ${backendResponse.headers.get('content-security-policy') || 'Not set'}`);
    
    // Test frontend CSP
    const frontendResponse = await fetch(FRONTEND_URL);
    console.log('\nFrontend CSP Headers:');
    console.log(`Content-Security-Policy: ${frontendResponse.headers.get('content-security-policy') || 'Not set'}`);
    
  } catch (error) {
    console.error(`Error testing CSP: ${error.message}`);
  }
}

/**
 * Main function to run all tests
 */
async function runTests() {
  console.log('Starting security configuration tests...\n');
  
  await testCORS();
  await testCSP();
  
  console.log('\nSecurity tests completed.');
}

runTests();