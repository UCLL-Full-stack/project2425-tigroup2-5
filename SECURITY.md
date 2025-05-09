# Security Guidelines for AnyGym Project

This document outlines the security measures implemented in the project to prevent supply chain attacks and dependency confusion vulnerabilities.

## Supply Chain Attack Protection

Supply chain attacks occur when attackers compromise the dependencies or third-party libraries used in your project. We've implemented the following measures:

### Dependency Management

1. **Locked Dependencies**
   - All dependencies are locked to specific versions using package-lock.json
   - Use `npm ci` instead of `npm install` in production to respect lockfiles

2. **Security Scripts**
   - Pre-install checks: `npm run preinstall`
   - Post-install audits: `npm run postinstall`
   - Regular security updates: `npm run security-updates`

3. **NPM Configuration**
   - Strict registry settings in .npmrc
   - Script execution restrictions

### Resource Integrity

1. **Subresource Integrity (SRI)**
   - External scripts are validated using integrity hashes
   - Use `security/generate-sri.js` to generate new hashes

2. **Content Security Policy (CSP)**
   - Strict CSP rules are implemented via front-end middleware
   - Script execution restricted to specific origins and nonce-validated scripts

## Dependency Confusion Protection

Dependency confusion happens when package managers mistakenly download public packages instead of private ones with the same name.

### Preventive Measures

1. **Registry Locking**
   - Explicit registry URLs in .npmrc files
   - Registry scope configuration for private packages

2. **Publishing Restrictions**
   - Package.json contains publishing configuration restrictions

3. **Continuous Monitoring**
   - Regular audits via GitHub Actions
   - Automated checks for suspicious package names

## Security Checks

1. **Automated Checks**
   - GitHub workflow runs security scans on push, pull request, and weekly
   - Run `node security/check-packages.js` to check for suspicious packages

2. **Manual Verification**
   - Before adding new dependencies, verify publisher reputation
   - Check package download statistics and GitHub stars
   - Investigate recent security incidents

## Incident Response

If you discover a security vulnerability in this project:

1. Do not disclose publicly until resolved
2. Contact the project maintainers directly
3. Document the issue with steps to reproduce

## Security Updates

Run security updates regularly with:

```bash
npm run security-updates
```

This will check for security-related updates while respecting semver constraints.