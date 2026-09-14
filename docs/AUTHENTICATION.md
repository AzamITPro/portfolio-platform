

<div dir="ltr">

````markdown
# Authentication & Session Security Architecture

## 1. Password Hashing (Argon2 / Bcrypt)

Passwords are never stored in plaintext. They are salted and hashed using `bcrypt` (12 rounds) directly via native C-bindings, eliminating legacy `passlib` vulnerabilities.

## 2. JWT Access Tokens

Tokens are signed with `HS256` using a 256-bit cryptographically secure secret key (`SECRET_KEY`). Claims include:

- `sub`: User email
- `role`: Authorization role (`admin`)
- `exp`: Expiration timestamp (default: 24 hours)
- `iat`: Issued-at timestamp

## 3. Defense Against XSS (HttpOnly Cookies)

Unlike vulnerable Single-Page Applications that store tokens in `localStorage` (accessible to XSS exploits), this platform issues tokens inside **HttpOnly, SameSite=Lax Cookies**. JavaScript cannot read the token, closing the token-theft vector.

## 4. First-Admin CLI Provisioning

No default credentials (like `admin/admin`) exist. Administrators are provisioned via an interactive terminal script using masked inputs (`getpass`):

```powershell
python scripts/create_admin.py
```
````
