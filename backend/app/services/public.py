import hashlib
import html
from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from app.models.user import Profile, SocialLink
from app.models.skill import SkillCategory, Skill
from app.models.project import Project, ProjectCategory, ProjectMedia
from app.models.resume import Certificate, Education, Experience, Service, Document
from app.models.communication import ContactMessage
from app.core.exceptions import NotFoundException
from app.services.email import email_service
from app.schemas.public import (
    PublicProfileOut,
    PublicSocialLinkOut,
    PublicSkillCategoryOut,
    PublicSkillOut,
    PublicProjectSummaryOut,
    PublicProjectDetailOut,
    PublicProjectMediaOut,
    PublicCertificateOut,
    PublicEducationOut,
    PublicExperienceOut,
    PublicServiceOut,
    PublicDocumentOut,
    ContactMessageCreate,
)


class PublicService:
    @staticmethod
    def get_profile(db: Session) -> Optional[PublicProfileOut]:
        query = (
            select(Profile)
            .options(
                selectinload(Profile.social_links),
                selectinload(Profile.profile_image),
            )
            .limit(1)
        )
        profile = db.execute(query).scalars().first()
        if not profile:
            return None

        visible_links = [
            PublicSocialLinkOut.model_validate(link)
            for link in profile.social_links
            if link.is_visible
        ]

        return PublicProfileOut(
            full_name=profile.full_name,
            professional_title=profile.professional_title,
            short_bio=profile.short_bio,
            about_me=profile.about_me,
            location=profile.location,
            email=profile.email,
            phone=profile.phone,
            availability=profile.availability,
            profile_image_url=profile.profile_image.url if profile.profile_image else None,
            social_links=visible_links,
        )

    @staticmethod
    def get_skills_grouped(db: Session) -> List[PublicSkillCategoryOut]:
        query = (
            select(SkillCategory)
            .where(SkillCategory.is_visible == True)
            .order_by(SkillCategory.display_order.asc())
            .options(selectinload(SkillCategory.skills))
        )
        categories = db.execute(query).scalars().all()
        result = []
        for cat in categories:
            visible_skills = [
                PublicSkillOut.model_validate(s)
                for s in cat.skills
                if s.is_visible
            ]
            result.append(
                PublicSkillCategoryOut(
                    id=cat.id,
                    name=cat.name,
                    slug=cat.slug,
                    description=cat.description,
                    skills=visible_skills,
                )
            )
        return result

    @staticmethod
    def get_projects(db: Session, featured_only: bool = False) -> List[PublicProjectSummaryOut]:
        query = (
            select(Project)
            .where(Project.is_visible == True)
            .order_by(Project.display_order.asc(), Project.created_at.desc())
            .options(
                selectinload(Project.cover_media),
                selectinload(Project.skills),
            )
        )
        if featured_only:
            query = query.where(Project.is_featured == True)

        projects = db.execute(query).scalars().all()
        return [
            PublicProjectSummaryOut(
                id=p.id,
                title=p.title,
                slug=p.slug,
                short_description=p.short_description,
                project_type=p.project_type,
                role=p.role,
                status=p.status,
                is_featured=p.is_featured,
                cover_image_url=p.cover_media.url if p.cover_media else None,
                github_url=p.github_url,
                live_demo_url=p.live_demo_url,
                skills=[s.name for s in p.skills if s.is_visible],
            )
            for p in projects
        ]

    @staticmethod
    def get_project_by_slug(db: Session, slug: str) -> PublicProjectDetailOut:
        query = (
            select(Project)
            .where(Project.slug == slug, Project.is_visible == True)
            .options(
                selectinload(Project.cover_media),
                selectinload(Project.media_items).selectinload(ProjectMedia.media),
                selectinload(Project.skills),
                selectinload(Project.categories),
            )
        )
        project = db.execute(query).scalars().first()
        if not project:
            raise NotFoundException(f"Project with slug '{slug}' was not found.")

        media_items = [
            PublicProjectMediaOut(
                id=m.id,
                url=m.media.url if m.media else "",
                caption=m.caption,
                is_featured=m.is_featured,
            )
            for m in project.media_items
            if m.media
        ]

        return PublicProjectDetailOut(
            id=project.id,
            title=project.title,
            slug=project.slug,
            short_description=project.short_description,
            description=project.description,
            project_type=project.project_type,
            role=project.role,
            problem=project.problem,
            solution=project.solution,
            features=project.features,
            challenges=project.challenges,
            learnings=project.learnings,
            status=project.status,
            start_date=project.start_date,
            end_date=project.end_date,
            is_featured=project.is_featured,
            cover_image_url=project.cover_media.url if project.cover_media else None,
            github_url=project.github_url,
            live_demo_url=project.live_demo_url,
            skills=[s.name for s in project.skills if s.is_visible],
            categories=[c.name for c in project.categories if c.is_visible],
            media_items=media_items,
        )

    @staticmethod
    def get_certificates(db: Session) -> List[PublicCertificateOut]:
        query = (
            select(Certificate)
            .where(Certificate.is_visible == True)
            .order_by(Certificate.display_order.asc(), Certificate.issue_date.desc())
            .options(selectinload(Certificate.certificate_media))
        )
        certs = db.execute(query).scalars().all()
        return [
            PublicCertificateOut(
                id=c.id,
                title=c.title,
                issuer=c.issuer,
                description=c.description,
                issue_date=c.issue_date,
                expiry_date=c.expiry_date,
                credential_id=c.credential_id,
                credential_url=c.credential_url,
                certificate_media_url=c.certificate_media.url if c.certificate_media else None,
                is_featured=c.is_featured,
            )
            for c in certs
        ]

    @staticmethod
    def get_education(db: Session) -> List[PublicEducationOut]:
        query = (
            select(Education)
            .where(Education.is_visible == True)
            .order_by(Education.display_order.asc(), Education.start_date.desc())
        )
        records = db.execute(query).scalars().all()
        return [PublicEducationOut.model_validate(r) for r in records]

    @staticmethod
    def get_experience(db: Session) -> List[PublicExperienceOut]:
        query = (
            select(Experience)
            .where(Experience.is_visible == True)
            .order_by(Experience.display_order.asc(), Experience.start_date.desc())
        )
        records = db.execute(query).scalars().all()
        return [PublicExperienceOut.model_validate(r) for r in records]

    @staticmethod
    def get_services(db: Session) -> List[PublicServiceOut]:
        query = (
            select(Service)
            .where(Service.is_visible == True)
            .order_by(Service.display_order.asc())
        )
        records = db.execute(query).scalars().all()
        return [PublicServiceOut.model_validate(r) for r in records]

    @staticmethod
    def get_primary_cv(db: Session) -> Optional[PublicDocumentOut]:
        query = (
            select(Document)
            .where(Document.is_primary == True, Document.is_visible == True, Document.type == "cv")
            .options(selectinload(Document.media))
            .limit(1)
        )
        doc = db.execute(query).scalars().first()
        if not doc or not doc.media:
            return None
        return PublicDocumentOut(
            title=doc.title,
            type=doc.type,
            description=doc.description,
            file_url=doc.media.url,
            file_size=doc.media.file_size,
        )

    @staticmethod
    def get_primary_cv_record(db: Session) -> Optional[Document]:
        query = (
            select(Document)
            .where(Document.is_primary == True, Document.is_visible == True, Document.type == "cv")
            .options(selectinload(Document.media))
            .limit(1)
        )
        return db.execute(query).scalars().first()

    @staticmethod
    def submit_contact_message(
        db: Session, msg: ContactMessageCreate, client_ip: str, user_agent: Optional[str]
    ) -> None:
        ip_hash = hashlib.sha256(client_ip.encode("utf-8")).hexdigest()

        sanitized_name = html.escape(msg.name.strip())
        sanitized_subject = html.escape(msg.subject.strip())
        sanitized_message = html.escape(msg.message.strip())

        new_msg = ContactMessage(
            name=sanitized_name,
            email=msg.email.strip().lower(),
            subject=sanitized_subject,
            message=sanitized_message,
            status="new",
            ip_hash=ip_hash,
            user_agent=user_agent[:500] if user_agent else None,
        )
        db.add(new_msg)
        db.commit()

        email_service.notify_admin_new_inquiry(
            sender_name=sanitized_name,
            sender_email=msg.email.strip().lower(),
            subject=sanitized_subject,
            message=sanitized_message,
        )


public_service = PublicService()