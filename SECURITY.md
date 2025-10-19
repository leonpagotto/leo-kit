# Security Policy

## 🔒 Security at LEO Workflow Kit

We take the security of LEO Workflow Kit seriously. This document outlines our security policies, supported versions, and how to report vulnerabilities.

---

## 📋 Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported          | Status |
| ------- | ------------------ | ------ |
| 2.4.x   | ✅ Yes            | Current stable release |
| 2.3.x   | ✅ Yes            | Security fixes only |
| 2.2.x   | ⚠️ Limited        | Critical fixes only (until Dec 2025) |
| 2.1.x   | ❌ No             | End of life |
| 2.0.x   | ❌ No             | End of life |
| < 2.0   | ❌ No             | End of life |

**Recommendation:** Always use the latest stable version (2.4.x) for the best security and features.

---

## 🚨 Reporting a Vulnerability

We appreciate responsible disclosure of security vulnerabilities. Please follow these guidelines:

### Reporting Process

**DO NOT** report security vulnerabilities through public GitHub issues.

Instead, please report them privately using one of these methods:

#### 1. GitHub Security Advisories (Preferred)

1. Go to https://github.com/leonpagotto/leo-kit/security/advisories
2. Click "Report a vulnerability"
3. Fill out the form with details

#### 2. Email

Send an email to: **leonpagotto@hotmail.com**

**Subject:** `[SECURITY] LEO Workflow Kit - <Brief Description>`

**Include:**
- Description of the vulnerability
- Steps to reproduce
- Affected versions
- Potential impact
- Any suggested fixes (optional)

### What to Include in Your Report

Please provide as much information as possible:

```
- Vulnerability Type: (e.g., XSS, injection, privilege escalation)
- Affected Component: (e.g., CLI command, template, API)
- Attack Vector: (e.g., local, network, requires authentication)
- Impact: (e.g., code execution, data exposure, denial of service)
- Severity Assessment: (critical, high, medium, low)
- Proof of Concept: (code snippet or steps to reproduce)
- Environment: (OS, Node.js version, leo-workflow-kit version)
- Any workarounds or mitigations you've identified
```

### Response Timeline

We are committed to responding promptly:

| Timeframe | Action |
|-----------|--------|
| **24 hours** | Initial acknowledgment of your report |
| **72 hours** | Preliminary assessment and severity classification |
| **7 days** | Detailed response with remediation plan |
| **30 days** | Security patch released (for confirmed vulnerabilities) |

### After Reporting

1. **Acknowledgment:** We'll confirm receipt within 24 hours
2. **Assessment:** We'll evaluate the vulnerability and assign a severity level
3. **Communication:** We'll keep you updated on our progress
4. **Fix:** We'll develop and test a security patch
5. **Disclosure:** We'll coordinate public disclosure with you
6. **Credit:** We'll acknowledge your contribution (unless you prefer anonymity)

---

## 🛡️ Security Best Practices

### For Users

**Installation:**
```bash
# Always install from official npm registry
npm install -g leo-workflow-kit

# Verify package integrity
npm audit leo-workflow-kit

# Check installed version
leo --version
```

**Configuration:**
```bash
# Never commit secrets or credentials
# Add sensitive files to .gitignore:
.env
.env.local
*.key
*.pem
credentials.json

# Use environment variables for sensitive data
export GITHUB_TOKEN="your-token-here"
```

**GitHub CLI Authentication:**
```bash
# Use secure authentication
gh auth login

# Verify authentication status
gh auth status

# Use tokens with minimal required scopes
```

**Project Security:**
```bash
# Regularly update dependencies
npm update -g leo-workflow-kit

# Check for vulnerabilities
npm audit

# Review generated files before committing
git diff
```

### For Contributors

**Development:**
```bash
# Use latest Node.js LTS version
node --version  # >= 16.0.0

# Install dependencies securely
npm ci  # Instead of npm install

# Run security checks
npm audit
npm audit fix

# Never commit sensitive data
git secrets --install  # (optional security tool)
```

**Code Review:**
- Review all PRs for security implications
- Check for hardcoded secrets or credentials
- Validate input sanitization
- Test authentication and authorization
- Review dependencies for known vulnerabilities

---

## 🔐 Security Features

### Current Security Measures

**1. Secure Defaults**
- No sensitive data collected or stored
- GitHub CLI handles all authentication securely
- Templates don't include credentials
- All network requests use HTTPS

**2. Dependency Management**
- Minimal dependencies (6 runtime packages)
- Regular dependency updates
- Automated security scanning
- No deprecated packages

**3. Code Execution**
- No eval() or dynamic code execution
- Input validation on all CLI commands
- Safe file system operations
- Sandboxed template rendering

**4. Data Privacy**
- No telemetry or tracking
- No data sent to external servers
- Local-only operations
- GitHub data only accessed through official APIs

**5. Authentication**
- Delegates to GitHub CLI for authentication
- No credential storage in LEO
- Token scopes checked before operations
- Support for SSO and 2FA

### Security Audits

We perform regular security reviews:
- ✅ Monthly dependency updates
- ✅ Quarterly security audits
- ✅ Automated vulnerability scanning
- ✅ Code review for all changes

---

## 🚫 Known Limitations & Risks

### Low Risk (Informational)

**1. GitHub CLI Dependency**
- **Risk:** LEO depends on `gh` CLI being installed and authenticated
- **Mitigation:** Clear error messages guide users to authenticate
- **Impact:** Cannot create issues/projects without authentication

**2. File System Access**
- **Risk:** LEO creates/modifies files in project directory
- **Mitigation:** User consent required, files only in project scope
- **Impact:** Users should review generated files before committing

**3. Template Execution**
- **Risk:** Templates create files and directories
- **Mitigation:** All templates are included in package, no external sources
- **Impact:** Only pre-approved templates can be used

### No Known High-Risk Vulnerabilities

As of October 19, 2025, no high or critical vulnerabilities are known.

---

## 📊 Vulnerability Disclosure Policy

### Our Commitment

- We will respond to all security reports within 24 hours
- We will not take legal action against researchers who follow responsible disclosure
- We will credit researchers who report valid vulnerabilities (unless anonymity is requested)
- We will coordinate disclosure timing with reporters

### Public Disclosure

After a fix is released:
1. **Security Advisory:** Published on GitHub Security Advisories
2. **CHANGELOG:** Security fixes documented with CVE (if applicable)
3. **Release Notes:** Security updates highlighted in release
4. **npm Advisory:** Linked to GitHub advisory

**Timeline:**
- Fixes released before public disclosure
- 7-day notice to users before public disclosure
- Coordinated with reporter for disclosure date

---

## 🏆 Security Hall of Fame

We appreciate security researchers who help keep LEO secure:

**Contributors:**
- *No vulnerabilities reported yet*

*Your name could be here! Report responsibly.*

---

## 📝 Security Updates

### Subscribe to Security Notifications

Stay informed about security updates:

1. **Watch the Repository:**
   - Go to https://github.com/leonpagotto/leo-kit
   - Click "Watch" → "Custom" → Check "Security alerts"

2. **GitHub Advisory Database:**
   - Follow https://github.com/advisories

3. **npm Security:**
   - Run `npm audit` regularly
   - Enable `npm audit` in CI/CD

### Recent Security Updates

**Version 2.4.0 (October 19, 2025)**
- ✅ No security issues
- ✅ Updated all dependencies
- ✅ Passed security audit

**Version 2.3.0 (October 19, 2025)**
- ✅ No security issues
- ✅ GraphQL API security review

**Version 2.2.0 (October 18, 2025)**
- ✅ No security issues

---

## 🔍 Security Checklist for Users

Before using LEO Workflow Kit:

- [ ] Install from official npm registry only
- [ ] Verify package integrity with `npm audit`
- [ ] Use latest stable version (2.4.x)
- [ ] Authenticate GitHub CLI securely
- [ ] Review `.gitignore` excludes sensitive files
- [ ] Never commit secrets or credentials
- [ ] Keep Node.js updated (>= 16.0.0)
- [ ] Review generated files before committing
- [ ] Enable GitHub security features (Dependabot, Code Scanning)
- [ ] Use tokens with minimal required scopes

---

## 📞 Contact

**Security Team:** leonpagotto@hotmail.com

**General Support:**
- Issues: https://github.com/leonpagotto/leo-kit/issues
- Discussions: https://github.com/leonpagotto/leo-kit/discussions

**Emergency Contact:**
For critical security issues requiring immediate attention, email with subject `[URGENT SECURITY]`

---

## 📜 Compliance

### Standards

LEO Workflow Kit follows:
- OWASP Top 10 security practices
- npm security best practices
- GitHub security guidelines
- Semantic Versioning for security updates

### Licenses

- **LEO Workflow Kit:** MIT License
- **Dependencies:** All MIT or compatible licenses
- **No GPL or restrictive licenses**

### Data Protection

- **GDPR:** No personal data collected
- **CCPA:** No data selling or sharing
- **Privacy:** Local-only operation, no telemetry

---

## 🔄 Policy Updates

This security policy is reviewed and updated:
- Quarterly (or more frequently if needed)
- After significant security events
- When security landscape changes

**Last Updated:** October 19, 2025  
**Version:** 1.0  
**Next Review:** January 19, 2026

---

## ✅ Verification

Verify this security policy is legitimate:

**Official Location:**
- https://github.com/leonpagotto/leo-kit/security/policy

**Signature:**
- Maintained by @leonpagotto
- Official LEO Workflow Kit repository

---

**Thank you for helping keep LEO Workflow Kit secure!** 🦁🔒
