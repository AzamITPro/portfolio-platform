<div dir="ltr">

````markdown
# Personal Portfolio & Professional Profile Platform

> A production-grade, full-stack personal portfolio and content management platform engineered with modern software standards, decoupled architecture, and strict security controls.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg?logo=next.js&logoColor=white)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-red.svg)](https://www.sqlalchemy.org)
[![Pytest](https://img.shields.io/badge/Pytest-100%25_Passed-brightgreen.svg?logo=pytest)](https://docs.pytest.org)
[![OWASP](https://img.shields.io/badge/OWASP-Hardened-blue.svg)](https://owasp.org)

---

## 👤 Developer Profile

- **Engineer:** Azzam AL-JARMOUZI (Azzam Abdo Abdullah Al-Jarmouzi)
- **Role:** IT Student & Software Developer
- **GitHub:** [@AzamITPro](https://github.com/AzamITPro)
- **Focus:** Clean Architecture, Scalable Web Systems, RESTful APIs, Relational Modeling

---

## 🌟 Core Engineering Features

1. **Decoupled Architecture:** Clean client-server separation between Next.js (App Router) and FastAPI (ASGI).
2. **Normalized Relational Schema:** 20 PostgreSQL tables with foreign keys, indexes, and full Alembic migration history.
3. **Robust Security & Cryptography:**
   - Password hashing via `bcrypt` (12 salt rounds).
   - HttpOnly Secure Cookie JWT sessions (XSS token-theft protection).
   - Rate limiting on authentication and contact forms via SlowAPI.
   - Comprehensive OWASP security headers (`nosniff`, `X-Frame-Options: DENY`, `HSTS`).
   - Automated penetration audit script verifying zero SQL injection and path traversal vulnerabilities.
4. **Self-Hosted Privacy Analytics:** In-house tracking for page views, unique visitor sessions, CV downloads, and outbound clicks without third-party tracking scripts.
5. **Full Admin CMS:** Secure dashboard to manage projects, skills, services, career timeline, messages inbox, and media library.
6. **Modern UI/UX:** Responsive Dark Developer Theme with accessible navigation, loading skeletons, and interactive contact forms.
7. **Comprehensive Testing:** 100% automated test coverage across health, auth, and public API endpoints via `pytest`.

---

## 📁 Repository Structure

```text
portfolio-platform/
├── backend/                # FastAPI application
│   ├── alembic/            # Database schema migration versions
│   ├── app/
│   │   ├── api/            # Versioned endpoints (v1: public, admin, auth, analytics)
│   │   ├── core/           # Config, logging, security, rate limiter
│   │   ├── db/             # SQLAlchemy session and engine factory
│   │   ├── middleware/     # Security headers middleware
│   │   ├── models/         # 20 SQLAlchemy ORM models
│   │   ├── repositories/   # Base repository & data access layer
│   │   ├── schemas/        # Pydantic v2 validation & response envelopes
│   │   └── services/       # Domain business logic layer
│   ├── tests/              # Pytest test suite (100% pass rate)
│   └── uploads/            # Local media storage directory
├── frontend/               # Next.js 14+ App Router application
│   ├── src/
│   │   ├── app/            # Public pages & admin dashboard routes
│   │   ├── components/     # Reusable UI, admin, and public components
│   │   ├── lib/            # API client, tracker, and auth helpers
│   │   └── types/          # TypeScript interfaces
├── docs/                   # Complete engineering documentation suite
└── scripts/                # Administrative CLI scripts (admin creation, seed, audit)
```
````

📖 In-Depth Documentation
Detailed engineering specifications are available in the docs/ directory:
System Architecture
Database Schema & ERD
RESTful API Specification
Authentication & Sessions
Security Hardening Report
Privacy-First Analytics Engine
Local Development Guide
Zero-Cost Production Deployment Blueprint
🚀 Quick Start (Local Setup)

1. Clone & Setup Backend
   code
   Powershell
   cd backend
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   alembic upgrade head
   python ..\scripts\create_admin.py
   uvicorn app.main:app --reload --port 8000
2. Setup Frontend
   code
   Powershell
   cd frontend
   npm install
   npm run dev
   Visit http://localhost:3000 for the public portfolio and http://localhost:3000/admin/dashboard for the management dashboard.


