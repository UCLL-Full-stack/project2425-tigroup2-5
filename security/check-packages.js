#!/usr/bin/env node

// Simple script to check for potentially malicious packages
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// List of known malicious or suspicious package patterns
const suspiciousPatterns = [
  'nodeenv',
  'cross-env-shell',
  'crossenv',
  '@azure/core-auth',
  'event-pubsub',
  'loadyaml',
  'eslint-scope',
  'electron-native-notify',
  'installpackage',
  'isomorphic-fetch-patch',
  'daterangepicker',
  'canvas-prebuilt',
  'node-datadog',
  'request-promise-cache',
  'storybook',
  'unstated-connect',
  'simple-get',
  'useragent-switcher-browser',
  'coa',
  'rc'
];

console.log("🔍 Checking for potentially suspicious packages...");

// Read the package-lock.json files
const projectRoot = process.cwd();
const backendLockPath = path.join(projectRoot, 'back-end', 'package-lock.json');
const frontendLockPath = path.join(projectRoot, 'front-end', 'package-lock.json');

// Function to check a package-lock.json file
function checkPackageLock(filePath, name) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ ${name} package-lock.json not found`);
    return;
  }

  try {
    const packageLock = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const dependencies = packageLock.dependencies || {};
    
    // Check for suspicious packages
    let foundSuspicious = false;
    Object.keys(dependencies).forEach(pkg => {
      if (suspiciousPatterns.some(pattern => pkg.includes(pattern))) {
        console.log(`🚨 SUSPICIOUS PACKAGE FOUND in ${name}: ${pkg}`);
        foundSuspicious = true;
      }
    });
    
    if (!foundSuspicious) {
      console.log(`✅ No known suspicious packages found in ${name}`);
    }
    
    // Check for packages with postinstall scripts
    console.log(`\nChecking for packages with postinstall scripts in ${name}...`);
    let foundScripts = false;
    Object.entries(dependencies).forEach(([pkg, info]) => {
      if (info.scripts && (info.scripts.install || info.scripts.postinstall)) {
        console.log(`📦 Package with install/postinstall script: ${pkg}`);
        foundScripts = true;
      }
    });
    
    if (!foundScripts) {
      console.log(`✅ No packages with install scripts found in ${name}`);
    }
    
  } catch (err) {
    console.error(`Error checking ${name} dependencies:`, err);
  }
}

// Check both package-lock files
console.log("=== Backend Packages ===");
checkPackageLock(backendLockPath, 'Backend');

console.log("\n=== Frontend Packages ===");
checkPackageLock(frontendLockPath, 'Frontend');

// Check for mixed dependencies (potential dependency confusion)
console.log("\n=== Checking for Mixed Dependencies ===");
try {
  // Get all unique dependency names from both projects
  const backendPkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'back-end', 'package.json'), 'utf8'));
  const frontendPkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'front-end', 'package.json'), 'utf8'));
  
  const backendDeps = { 
    ...backendPkg.dependencies || {}, 
    ...backendPkg.devDependencies || {} 
  };
  
  const frontendDeps = { 
    ...frontendPkg.dependencies || {}, 
    ...frontendPkg.devDependencies || {} 
  };
  
  // Find dependencies used in both projects with different versions
  const mixedVersions = [];
  Object.keys(backendDeps).forEach(dep => {
    if (frontendDeps[dep] && backendDeps[dep] !== frontendDeps[dep]) {
      mixedVersions.push({
        name: dep,
        backendVersion: backendDeps[dep],
        frontendVersion: frontendDeps[dep]
      });
    }
  });
  
  if (mixedVersions.length > 0) {
    console.log("⚠️ Found dependencies with different versions across projects (potential risk):");
    mixedVersions.forEach(dep => {
      console.log(`  - ${dep.name}: Backend=${dep.backendVersion}, Frontend=${dep.frontendVersion}`);
    });
  } else {
    console.log("✅ No mixed dependency versions found");
  }
  
} catch (err) {
  console.error("Error checking for mixed dependencies:", err);
}

console.log("\n✅ Security package check completed");