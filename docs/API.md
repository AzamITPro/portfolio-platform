# RESTful API Specification (v1)

## 1. Base URL & Response Envelope

All endpoints are prefixed with `/api/v1`. Responses follow a standard envelope:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

2. Public Endpoints (/api/v1/public/\*)
   GET /public/profile: Full public bio and visible social links.
   GET /public/skills: Visible skills grouped by categories.
   GET /public/projects: Project archive with optional featured_only=true.
   GET /public/projects/{slug}: In-depth project case study.
   GET /public/certificates: Verified certificates.
   GET /public/education: Academic timeline.
   GET /public/experience: Work experience timeline.
   GET /public/services: Software development services.
   GET /public/documents/cv: Active resume document metadata.
   POST /public/contact: Submit contact inquiry (Rate limited: 5/hour).
   POST /public/analytics/view: Log page view telemetry.
   POST /public/analytics/event: Log user interaction event.
3. Authentication Endpoints (/api/v1/auth/\*)
   POST /auth/login: Issue JWT token and set HttpOnly session cookie (Rate limited: 5/min).
   POST /auth/logout: Invalidate session cookie.
   GET /auth/me: Protected route returning authenticated admin profile.
4. Protected Admin Endpoints (/api/v1/admin/\*)
   Requires Bearer token or HttpOnly cookie:
   /admin/profile: Get & update profile info.
   /admin/social-links: Full CRUD for social profiles.
   /admin/skill-categories & /admin/skills: Full CRUD for technical stack.
   /admin/project-categories & /admin/projects: Full CRUD for portfolio CMS.
   /admin/certificates, /admin/education, /admin/experience, /admin/services: Full career CRUD.
   /admin/messages: Inbox management with status transitions (read, replied, archived).
   /admin/media: File upload (images, PDFs) and digital asset management.
   /admin/analytics/summary: Aggregate metrics, daily traffic, and top pages.
