from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from app.models.project import Project, ProjectCategory
from app.models.skill import Skill
from app.core.exceptions import NotFoundException, ConflictException
from app.schemas.admin_projects import (
    ProjectCategoryCreate,
    ProjectCategoryUpdate,
    ProjectCreate,
    ProjectUpdate,
)


class AdminProjectsService:
    # --- Project Category Operations ---
    @staticmethod
    def list_categories(db: Session) -> List[ProjectCategory]:
        query = select(ProjectCategory).order_by(ProjectCategory.display_order.asc(), ProjectCategory.id.asc())
        return list(db.execute(query).scalars().all())

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
            raise NotFoundException(f"Project category with ID {cat_id} not found.")

        fields = cat_in.model_dump(exclude_unset=True)
        if "slug" in fields and fields["slug"] != category.slug:
            existing = db.execute(select(ProjectCategory).where(ProjectCategory.slug == fields["slug"])).scalars().first()
            if existing:
                raise ConflictException(f"Category slug '{fields['slug']}' already exists.")

        for key, value in fields.items():
            setattr(category, key, value)

        db.commit()
        db.refresh(category)
        return category

    @staticmethod
    def delete_category(db: Session, cat_id: int) -> None:
        category = db.get(ProjectCategory, cat_id)
        if not category:
            raise NotFoundException(f"Project category with ID {cat_id} not found.")
        db.delete(category)
        db.commit()

    # --- Project Operations ---
    @staticmethod
    def list_projects(db: Session) -> List[Project]:
        query = (
            select(Project)
            .order_by(Project.display_order.asc(), Project.created_at.desc())
            .options(
                selectinload(Project.skills),
                selectinload(Project.categories),
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
        # Validate unique slug
        existing = db.execute(select(Project).where(Project.slug == project_in.slug)).scalars().first()
        if existing:
            raise ConflictException(f"Project slug '{project_in.slug}' is already taken.")

        # Prepare base fields
        data = project_in.model_dump(exclude={"skill_ids", "category_ids"})
        project = Project(**data)

        # Attach linked skills (Many-to-Many)
        if project_in.skill_ids:
            skills_query = select(Skill).where(Skill.id.in_(project_in.skill_ids))
            project.skills = list(db.execute(skills_query).scalars().all())

        # Attach linked categories (Many-to-Many)
        if project_in.category_ids:
            cats_query = select(ProjectCategory).where(ProjectCategory.id.in_(project_in.category_ids))
            project.categories = list(db.execute(cats_query).scalars().all())

        db.add(project)
        db.commit()
        db.refresh(project)
        return AdminProjectsService.get_project_by_id(db, project.id)

    @staticmethod
    def update_project(db: Session, project_id: int, project_in: ProjectUpdate) -> Project:
        project = AdminProjectsService.get_project_by_id(db, project_id)

        fields = project_in.model_dump(exclude_unset=True, exclude={"skill_ids", "category_ids"})
        if "slug" in fields and fields["slug"] != project.slug:
            existing = db.execute(select(Project).where(Project.slug == fields["slug"])).scalars().first()
            if existing:
                raise ConflictException(f"Project slug '{fields['slug']}' is already taken.")

        for key, value in fields.items():
            setattr(project, key, value)

        # Update skills if specified
        if project_in.skill_ids is not None:
            skills_query = select(Skill).where(Skill.id.in_(project_in.skill_ids))
            project.skills = list(db.execute(skills_query).scalars().all())

        # Update categories if specified
        if project_in.category_ids is not None:
            cats_query = select(ProjectCategory).where(ProjectCategory.id.in_(project_in.category_ids))
            project.categories = list(db.execute(cats_query).scalars().all())

        db.commit()
        db.refresh(project)
        return AdminProjectsService.get_project_by_id(db, project.id)

    @staticmethod
    def delete_project(db: Session, project_id: int) -> None:
        project = AdminProjectsService.get_project_by_id(db, project_id)
        db.delete(project)
        db.commit()


admin_projects_service = AdminProjectsService()