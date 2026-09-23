from typing import List
from sqlalchemy import select, delete
from sqlalchemy.orm import Session, selectinload
from app.models.project import Project, ProjectCategory, ProjectMedia
from app.models.skill import Skill
from app.core.exceptions import NotFoundException, ConflictException, BadRequestException
from app.schemas.admin_projects import (
    ProjectCategoryCreate,
    ProjectCategoryUpdate,
    ProjectCreate,
    ProjectUpdate,
)


class AdminProjectsService:
    # --- Categories ---
    @staticmethod
    def list_categories(db: Session) -> List[ProjectCategory]:
        return list(db.execute(select(ProjectCategory).order_by(ProjectCategory.display_order.asc())).scalars().all())

    @staticmethod
    def create_category(db: Session, cat_in: ProjectCategoryCreate) -> ProjectCategory:
        existing = db.execute(select(ProjectCategory).where(ProjectCategory.slug == cat_in.slug)).scalars().first()
        if existing:
            raise ConflictException(f"Category slug '{cat_in.slug}' already exists.")
        category = ProjectCategory(**cat_in.model_dump())
        db.add(category)
        db.commit()
        db.refresh(category)
        return category

    @staticmethod
    def update_category(db: Session, cat_id: int, cat_in: ProjectCategoryUpdate) -> ProjectCategory:
        category = db.get(ProjectCategory, cat_id)
        if not category:
            raise NotFoundException(f"Category {cat_id} not found.")
        for k, v in cat_in.model_dump(exclude_unset=True).items():
            setattr(category, k, v)
        db.commit()
        db.refresh(category)
        return category

    @staticmethod
    def delete_category(db: Session, cat_id: int) -> None:
        category = db.get(ProjectCategory, cat_id)
        if not category:
            raise NotFoundException(f"Category {cat_id} not found.")
        db.delete(category)
        db.commit()

    # --- Projects ---
    @staticmethod
    def list_projects(db: Session) -> List[Project]:
        query = (
            select(Project)
            .order_by(Project.display_order.asc(), Project.created_at.desc())
            .options(
                selectinload(Project.skills),
                selectinload(Project.categories),
                selectinload(Project.media_items),
            )
        )
        return list(db.execute(query).scalars().all())

    @staticmethod
    def get_project_by_id(db: Session, project_id: int) -> Project:
        query = (
            select(Project)
            .where(Project.id == project_id)
            .options(
                selectinload(Project.skills),
                selectinload(Project.categories),
                selectinload(Project.media_items),
            )
        )
        project = db.execute(query).scalars().first()
        if not project:
            raise NotFoundException(f"Project with ID {project_id} not found.")
        return project

    @staticmethod
    def create_project(db: Session, project_in: ProjectCreate) -> Project:
        if len(project_in.gallery_media_ids) > 6:
            raise BadRequestException("Maximum of 6 gallery images allowed per project.")

        existing = db.execute(select(Project).where(Project.slug == project_in.slug)).scalars().first()
        if existing:
            raise ConflictException(f"Project slug '{project_in.slug}' is already taken.")

        data = project_in.model_dump(exclude={"skill_ids", "category_ids", "gallery_media_ids"})
        project = Project(**data)

        if project_in.skill_ids:
            skills = db.execute(select(Skill).where(Skill.id.in_(project_in.skill_ids))).scalars().all()
            project.skills = list(skills)

        db.add(project)
        db.flush()

        # Save up to 6 gallery media items
        for idx, media_id in enumerate(project_in.gallery_media_ids[:6]):
            pm = ProjectMedia(
                project_id=project.id,
                media_id=media_id,
                display_order=idx + 1,
                is_featured=False,
            )
            db.add(pm)

        db.commit()
        db.refresh(project)
        return AdminProjectsService.get_project_by_id(db, project.id)

    @staticmethod
    def update_project(db: Session, project_id: int, project_in: ProjectUpdate) -> Project:
        project = AdminProjectsService.get_project_by_id(db, project_id)

        if project_in.gallery_media_ids is not None and len(project_in.gallery_media_ids) > 6:
            raise BadRequestException("Maximum of 6 gallery images allowed per project.")

        fields = project_in.model_dump(exclude_unset=True, exclude={"skill_ids", "category_ids", "gallery_media_ids"})
        for k, v in fields.items():
            setattr(project, k, v)

        if project_in.skill_ids is not None:
            skills = db.execute(select(Skill).where(Skill.id.in_(project_in.skill_ids))).scalars().all()
            project.skills = list(skills)

        # Update Gallery (Replace with new selection up to 6)
        if project_in.gallery_media_ids is not None:
            db.execute(delete(ProjectMedia).where(ProjectMedia.project_id == project.id))
            for idx, media_id in enumerate(project_in.gallery_media_ids[:6]):
                pm = ProjectMedia(
                    project_id=project.id,
                    media_id=media_id,
                    display_order=idx + 1,
                    is_featured=False,
                )
                db.add(pm)

        db.commit()
        db.refresh(project)
        return AdminProjectsService.get_project_by_id(db, project.id)

    @staticmethod
    def delete_project(db: Session, project_id: int) -> None:
        project = AdminProjectsService.get_project_by_id(db, project_id)
        db.delete(project)
        db.commit()


admin_projects_service = AdminProjectsService()