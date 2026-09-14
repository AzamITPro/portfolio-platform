

<div dir="ltr">

```markdown
# Database Architecture & Schema Specification

## 1. Engine & Migration Management

- **Database Engine:** PostgreSQL 16
- **ORM:** SQLAlchemy 2.0 (Mapped column syntax)
- **Migration Pipeline:** Alembic

## 2. Relational Schema Structure (20 Tables)

1. `users`: Administrative identities with bcrypt password hashes.
2. `profiles`: Developer public profile details (One-to-One with `users`).
3. `social_links`: Ordered external profiles (GitHub, LinkedIn, etc.).
4. `skill_categories`: Grouping domains (Frontend, Backend, DevOps, etc.).
5. `skills`: Technical competencies with proficiency levels (1-100).
6. `projects`: Case studies with problem/solution/learning narratives.
7. `project_categories`: High-level project domain categorizations.
8. `project_skills`: Many-to-Many junction linking projects to skills.
9. `project_category_links`: Many-to-Many junction linking projects to categories.
10. `project_media`: Gallery items associated with specific projects.
11. `certificates`: Professional accreditations with verification URLs.
12. `education`: Academic degrees and institution milestones.
13. `experience`: Career history and employment timeline.
14. `services`: Client capabilities and technical solutions.
15. `documents`: Resumes and CVs with primary active selection.
16. `media`: Central digital asset library with UUID keys and dimensions.
17. `contact_messages`: Inquiries with SHA-256 anonymized IP hashing.
18. `page_views`: Granular visit logs indexed by `(path, created_at)`.
19. `analytics_events`: Custom interaction tracking (CV downloads, external clicks).
20. `site_settings`: Dynamic site configuration key-value storage.

## 3. Migration Commands

- Generate migration: `alembic revision --autogenerate -m "description"`
- Apply migration: `alembic upgrade head`
- Rollback: `alembic downgrade -1`
```
