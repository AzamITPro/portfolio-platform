# System Architecture Specification

## 1. Architectural Style

The Personal Portfolio & Profile Platform is architected using a **Decoupled Client-Server Architecture** with strict Separation of Concerns (SoC).

```text
[ Next.js 14+ App Router ] <---> [ RESTful API v1 (FastAPI) ] <---> [ PostgreSQL 16 ]
                                             |
                                  [ Local / S3 Media Storage ]
```

2. Core Architectural Layers
   Presentation Layer (Frontend): Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide Icons. Employs Server-Side Rendering (SSR) for optimal SEO and Client Components for interactive forms.
   API & Gateway Layer (Backend): FastAPI ASGI application enforcing OWASP security headers, CORS origin whitelisting, and SlowAPI rate limiting.
   Domain & Business Logic Layer (Services): Pure Python service layer (app/services) encapsulating business rules, password hashing, and image metadata extraction.
   Data Access Layer (Repositories & ORM): Generic BaseRepository[ModelType] providing type-safe CRUD operations over SQLAlchemy 2.0.
   Persistence Layer (Database): PostgreSQL 16 running normalized relational tables managed via Alembic migrations.
3. Key Design Decisions
   Why FastAPI over Django/Flask? Native asynchronous I/O (ASGI), automated OpenAPI/Swagger interactive docs, and Pydantic v2 validation out of the box.
   Why Next.js App Router? Hybrid rendering (Server Components for SEO case studies + Client Components for interactive admin controls).
   Why PostgreSQL? Strict ACID compliance, relational integrity with foreign keys, and performant indexing for telemetry analytics.
