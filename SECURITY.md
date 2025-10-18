# Security Policy

## 🔒 Reporting a Vulnerability

The security of the School Cashier System is a top priority. If you discover a security vulnerability, please follow these guidelines:

### ✅ Do This

1. **Email directly** to: **markme44.mm@gmail.com** (replace with your actual email)
2. **Do NOT** open a public GitHub issue for security vulnerabilities
3. **Provide details**:
    - Description of the vulnerability
    - Steps to reproduce
    - Potential impact
    - Suggested fix (if any)
4. **Give us time** to respond and fix before public disclosure

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution Target**: Within 30 days (depending on severity)

### What to Expect

- Acknowledgment of your report
- Regular updates on our progress
- Credit in the security advisory (if you wish)
- Potential bug bounty (for critical vulnerabilities, if program is active)

---

## 🛡️ Supported Versions

Security updates are provided for the following versions:

| Version  | Supported              |
| -------- | ---------------------- |
| Latest   | ✅ Yes                 |
| < Latest | ❌ No (please upgrade) |

---

## 🔐 Security Best Practices

### For Deployments

When deploying this application:

1. **Environment Configuration**
    - Set `APP_DEBUG=false` in production
    - Use strong, unique `APP_KEY`
    - Never commit `.env` files to version control
    - Use environment-specific credentials

2. **Database Security**
    - Use strong database passwords
    - Restrict database access to localhost (if on same server)
    - Enable SSL for remote database connections
    - Regular backups with encryption

3. **Web Server**
    - Use HTTPS with valid SSL certificates
    - Configure security headers (CSP, HSTS, X-Frame-Options)
    - Enable firewall (allow only necessary ports)
    - Keep server software updated

4. **Application**
    - Change default demo passwords immediately
    - Implement rate limiting on login routes
    - Enable CSRF protection (default in Laravel)
    - Regular dependency updates
    - Monitor logs for suspicious activity

5. **User Management**
    - Enforce strong password policies
    - Implement two-factor authentication (recommended)
    - Regular audit of user permissions
    - Deactivate unused accounts

---

## 🚨 Known Security Considerations

### Demo Data

This application includes demo seeders with default passwords:

- **Default password**: `password`
- **⚠️ CRITICAL**: Change all demo account passwords in production
- Run `php artisan demo:refresh --force` only in development/staging

### File Uploads

If implementing file upload features:

- Validate file types and sizes
- Store uploads outside public directory
- Scan for malware
- Use signed URLs for downloads

### API Access

If exposing API endpoints:

- Use Laravel Sanctum for authentication
- Implement rate limiting
- Validate all inputs
- Use proper HTTP status codes

---

## 📋 Security Checklist

Before deploying to production:

- [ ] `APP_DEBUG=false`
- [ ] Strong `APP_KEY` generated
- [ ] `.env` file not in version control
- [ ] Database credentials are strong and unique
- [ ] HTTPS enabled with valid certificate
- [ ] Security headers configured
- [ ] Default passwords changed
- [ ] File permissions set correctly (755/644)
- [ ] Firewall configured
- [ ] Error logging enabled
- [ ] Dependency vulnerabilities checked
- [ ] Rate limiting enabled
- [ ] Backups configured

---

## 🔍 Dependency Security

### Automated Scanning

This project uses:

- **Dependabot** (GitHub) - Automatic dependency updates
- **npm audit** - Node.js dependency vulnerabilities
- **composer audit** - PHP dependency vulnerabilities

### Manual Checks

Run security audits regularly:

```powershell
# Check npm dependencies
npm audit

# Fix automatically (if possible)
npm audit fix

# Check Composer dependencies
composer audit

# Update dependencies
composer update
npm update
```

---

## 📝 Security Updates Log

### Recent Security Updates

**None yet** - This is the initial release.

When security updates are made, they will be documented here with:

- Date of update
- Description of vulnerability
- Affected versions
- Fix applied

---

## 🤝 Acknowledgments

We thank security researchers who help keep this project secure:

- _Your name could be here!_

---

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Laravel Security Best Practices](https://laravel.com/docs/security)
- [Inertia.js Security](https://inertiajs.com/security)
- [React Security Best Practices](https://react.dev/learn/keeping-components-pure)

---

## ⚖️ Disclosure Policy

We follow **responsible disclosure** principles:

1. Security researchers report vulnerabilities privately
2. We acknowledge and work on fixes
3. We release patches for supported versions
4. After patch release, we publish security advisory
5. We credit researchers (with permission)

---

## 📧 Contact

**Security Contact**: markme44.mm@gmail.com

For non-security issues, please use [GitHub Issues](https://github.com/mark-john-ignacio/school-cashier-system/issues).

---

**Last Updated**: October 18, 2025

_This security policy may be updated as the project evolves._
