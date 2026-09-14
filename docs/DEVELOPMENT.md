# Local Development Guide (Windows 10 & VS Code)

## 1. Prerequisites

- Python 3.12+
- Node.js 20+ / 24+
- PostgreSQL 16 (Running locally on Port 5433 or 5432)
- Git

## 2. Backend Startup

```powershell
cd D:\portfolio-platform\backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

API Root: http://127.0.0.1:8000
Interactive Swagger UI: http://127.0.0.1:8000/docs

3. Frontend Startup
   code
   Powershell
   cd D:\portfolio-platform\frontend
   npm run dev
   Public Portfolio: http://localhost:3000
   Admin Dashboard: http://localhost:3000/admin/dashboard
   Admin Login: http://localhost:3000/admin/login

4. Running Automated Tests
   code
   Powershell
   cd D:\portfolio-platform\backend
   .\.venv\Scripts\Activate.ps1
   pytest -v
5. Running Security Audit
   code
   Powershell
   python scripts/security_audit.py
