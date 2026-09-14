import sys
from datetime import date
from pathlib import Path

# Setup module path
backend_path = Path(__file__).resolve().parents[1] / "backend"
sys.path.insert(0, str(backend_path))

from sqlalchemy import select
from app.db.session import SessionLocal
from app.models.skill import SkillCategory, Skill
from app.models.project import Project, ProjectCategory
from app.models.resume import Certificate, Experience, Service


def seed_data():
    db = SessionLocal()
    print("=" * 65)
    print("  SEEDING PRODUCTION DEMO DATA - AZZAM PORTFOLIO PLATFORM")
    print("=" * 65)

    try:
        # 1. Skill Categories & Skills
        categories_data = [
            {
                "name": "Frontend Engineering",
                "slug": "frontend-engineering",
                "description": "Modern UI development, reactivity, and client architecture",
                "display_order": 2,
                "skills": [
                    {"name": "Next.js (App Router)", "slug": "nextjs", "proficiency": 85, "featured": True},
                    {"name": "TypeScript", "slug": "typescript", "proficiency": 80, "featured": True},
                    {"name": "Tailwind CSS", "slug": "tailwind-css", "proficiency": 90, "featured": False},
                ]
            },
            {
                "name": "Database & Architecture",
                "slug": "database-architecture",
                "description": "Relational schemas, ORM modeling, and data integrity",
                "display_order": 3,
                "skills": [
                    {"name": "PostgreSQL", "slug": "postgresql", "proficiency": 85, "featured": True},
                    {"name": "SQLAlchemy 2.0", "slug": "sqlalchemy", "proficiency": 85, "featured": True},
                    {"name": "Alembic Migrations", "slug": "alembic", "proficiency": 80, "featured": False},
                ]
            },
            {
                "name": "DevOps & Core Tools",
                "slug": "devops-tools",
                "description": "Version control, environment orchestration, and Linux workflows",
                "display_order": 4,
                "skills": [
                    {"name": "Git & GitHub Workflows", "slug": "git-github", "proficiency": 90, "featured": True},
                    {"name": "RESTful API Security", "slug": "api-security", "proficiency": 85, "featured": True},
                ]
            }
        ]

        print("[*] Seeding Technical Skills & Categories...")
        for cat_item in categories_data:
            existing_cat = db.execute(select(SkillCategory).where(SkillCategory.slug == cat_item["slug"])).scalars().first()
            if not existing_cat:
                cat_obj = SkillCategory(
                    name=cat_item["name"],
                    slug=cat_item["slug"],
                    description=cat_item["description"],
                    display_order=cat_item["display_order"],
                    is_visible=True,
                )
                db.add(cat_obj)
                db.flush()
                print(f"    [+] Created Category: {cat_obj.name}")
            else:
                cat_obj = existing_cat

            for s in cat_item["skills"]:
                existing_skill = db.execute(select(Skill).where(Skill.slug == s["slug"])).scalars().first()
                if not existing_skill:
                    skill_obj = Skill(
                        category_id=cat_obj.id,
                        name=s["name"],
                        slug=s["slug"],
                        proficiency_level=s["proficiency"],
                        display_order=1,
                        is_featured=s["featured"],
                        is_visible=True,
                    )
                    db.add(skill_obj)
                    print(f"        -> Created Skill: {skill_obj.name}")

        db.commit()

        # 2. Project Categories
        print("\n[*] Seeding Project Categories...")
        proj_cats = [
            {"name": "Enterprise Web Applications", "slug": "enterprise-web", "display_order": 2},
            {"name": "Backend APIs & Microservices", "slug": "backend-apis", "display_order": 3},
        ]
        for pc in proj_cats:
            existing_pc = db.execute(select(ProjectCategory).where(ProjectCategory.slug == pc["slug"])).scalars().first()
            if not existing_pc:
                new_pc = ProjectCategory(name=pc["name"], slug=pc["slug"], display_order=pc["display_order"], is_visible=True)
                db.add(new_pc)
                print(f"    [+] Created Project Category: {new_pc.name}")

        db.commit()

        # 3. Showcase Projects with In-Depth Case Studies
        print("\n[*] Seeding Showcase Engineering Projects...")
        sample_projects = [
            {
                "title": "[Demo] Smart Warehouse Inventory & Order System",
                "slug": "smart-inventory-system",
                "short_description": "High-throughput inventory tracking and order lifecycle management engine.",
                "description": "A comprehensive warehouse management software built to handle SKU cataloging, batch tracking, and real-time inventory adjustments.",
                "project_type": "Enterprise Full-Stack Application",
                "role": "Lead Full-Stack Developer",
                "problem": "Manual inventory reconciliations caused stockouts, tracking latency, and severe fulfillment inaccuracies across multiple depots.",
                "solution": "Engineered an event-driven system with PostgreSQL row-level locks to ensure atomic stock deductions during high concurrency.",
                "features": "Atomic transaction processing, role-based warehouse worker dashboard, low-stock threshold alerting, and barcode scan compatibility.",
                "challenges": "Resolving race conditions during simultaneous order placement on the last remaining stock item.",
                "learnings": "Mastering PostgreSQL transaction isolation levels (SERIALIZABLE vs REPEATABLE READ) and automated audit logging.",
                "status": "Completed",
                "github_url": "https://github.com/AzamITPro",
                "is_featured": True,
                "display_order": 2,
            },
            {
                "title": "[Demo] Real-Time IoT Telemetry Gateway",
                "slug": "iot-telemetry-gateway",
                "short_description": "Asynchronous microservice processing time-series device data.",
                "description": "High-performance data ingestion service designed to parse and store temperature, humidity, and location packets.",
                "project_type": "Distributed Systems / Backend API",
                "role": "Backend Systems Engineer",
                "problem": "Legacy HTTP polling servers were overwhelmed by thousands of concurrent sensor streams, causing message drops.",
                "solution": "Built an asynchronous FastAPI ingestion pipeline capable of validating payloads with Pydantic and batch-inserting into PostgreSQL.",
                "features": "Sub-millisecond payload validation, automated outlier sensor detection, and telemetry dashboard API.",
                "challenges": "Handling sustained peak loads without memory leaks in Python async loops.",
                "learnings": "Deep dive into ASGI connection pooling, asyncpg connection lifecycle, and non-blocking database queries.",
                "status": "Completed",
                "github_url": "https://github.com/AzamITPro",
                "is_featured": True,
                "display_order": 3,
            }
        ]

        # Fetch some skills to link
        all_skills = db.execute(select(Skill)).scalars().all()

        for p_data in sample_projects:
            existing_p = db.execute(select(Project).where(Project.slug == p_data["slug"])).scalars().first()
            if not existing_p:
                proj = Project(**p_data, is_visible=True)
                proj.skills = all_skills[:3]  # Link first 3 skills
                db.add(proj)
                print(f"    [+] Created Project: {proj.title}")

        db.commit()

        # 4. Verified Certificates
        print("\n[*] Seeding Professional Certificates...")
        certs = [
            {
                "title": "[Demo] Advanced Python & Fast Microservices Architecture",
                "issuer": "Engineering Academy",
                "description": "Comprehensive specialization in asynchronous programming, RESTful API design, and distributed systems.",
                "issue_date": date(2025, 6, 15),
                "credential_id": "CERT-FASTAPI-2025-01",
                "credential_url": "https://github.com/AzamITPro",
                "is_featured": True,
                "display_order": 1,
            },
            {
                "title": "[Demo] Relational Database Modeling with PostgreSQL",
                "issuer": "Database Institute",
                "description": "Advanced normalization (3NF), indexing strategies (B-Tree, GIN), and query execution plan optimization.",
                "issue_date": date(2025, 11, 20),
                "credential_id": "CERT-PGSQL-2025-02",
                "credential_url": "https://github.com/AzamITPro",
                "is_featured": True,
                "display_order": 2,
            }
        ]
        for c in certs:
            existing_c = db.execute(select(Certificate).where(Certificate.credential_id == c["credential_id"])).scalars().first()
            if not existing_c:
                cert_obj = Certificate(**c, is_visible=True)
                db.add(cert_obj)
                print(f"    [+] Created Certificate: {cert_obj.title}")

        db.commit()

        # 5. Core Services
        print("\n[*] Seeding Software Capabilities & Services...")
        services_data = [
            {
                "title": "RESTful API Engineering",
                "slug": "api-engineering",
                "short_description": "Robust, self-documenting APIs built with FastAPI, Pydantic, and JWT authentication.",
                "description": "High-concurrency backend services designed with clean architecture, rate limiting, and automated Swagger documentation.",
                "icon": "server",
                "display_order": 2,
                "is_featured": True,
            },
            {
                "title": "Database Design & Optimization",
                "slug": "database-design",
                "short_description": "Normalized PostgreSQL schemas, transaction safety, and migration pipelines.",
                "description": "Expert relational data modeling with SQLAlchemy 2.0, Alembic schema migrations, and indexing strategies.",
                "icon": "database",
                "display_order": 3,
                "is_featured": True,
            }
        ]
        for srv in services_data:
            existing_srv = db.execute(select(Service).where(Service.slug == srv["slug"])).scalars().first()
            if not existing_srv:
                new_srv = Service(**srv, is_visible=True)
                db.add(new_srv)
                print(f"    [+] Created Service: {new_srv.title}")

        db.commit()
        print("\n" + "=" * 65)
        print("  SUCCESS: DEMO SEED DATA INJECTED SAFELY INTO POSTGRESQL!")
        print("=" * 65)

    except Exception as e:
        print(f"\n[-] Seeding failed: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()