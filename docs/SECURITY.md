
<div dir="ltr">

````markdown
# Security Hardening & Penetration Verification

## 1. OWASP Top 10 Defenses

- **SQL Injection:** 100% immune via SQLAlchemy parameterized queries.
- **Cross-Site Scripting (XSS):** Contact inquiries are sanitized using `html.escape`. Tokens are protected via HttpOnly cookies.
- **Clickjacking:** Enforced `X-Frame-Options: DENY` on all HTTP responses.
- **MIME-Sniffing:** Enforced `X-Content-Type-Options: nosniff`.
- **Path Traversal:** File uploads are assigned non-sequential random UUIDv4 keys. Directory traversal sequences (`../`) are rejected.
- **Dangerous Uploads:** Whitelist-only file extensions (`png`, `jpg`, `webp`, `svg`, `pdf`). Executable files (`.exe`, `.php`, `.sh`) are rejected.
- **Brute-Force Protection:** Rate limiting applied to `/auth/login` (5/min) and `/public/contact` (5/hour) via SlowAPI.

## 2. Automated Security Audit Suite

Verification is executed via an automated penetration test script:

```powershell
python scripts/security_audit.py
```
````
