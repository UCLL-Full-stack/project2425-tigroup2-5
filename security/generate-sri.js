#!/usr/bin/env node

// Script to generate SRI hashes for external resources
const crypto = require('crypto');
const https = require('https');

function generateSRI(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch resource: ${res.statusCode}`));
        return;
      }
      
      const data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(data);
        const hash = crypto.createHash('sha384').update(buffer).digest('base64');
        resolve(`sha384-${hash}`);
      });
    }).on('error', reject);
  });
}

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error('Please provide a URL to generate SRI hash for');
    console.error('Example: node generate-sri.js https://example.com/script.js');
    process.exit(1);
  }
  
  try {
    const hash = await generateSRI(url);
    console.log(`\nResource: ${url}`);
    console.log(`\nSRI Hash: ${hash}`);
    console.log(`\nHTML Usage: <script src="${url}" integrity="${hash}" crossorigin="anonymous"></script>`);
  } catch (error) {
    console.error('Error generating SRI hash:', error);
    process.exit(1);
  }
}

main();