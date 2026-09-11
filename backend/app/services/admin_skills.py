from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.skill import SkillCategory, Skill
from app.core.exceptions import NotFoundException, ConflictException
from app.schemas.admin_skills import (
    SkillCategoryCreate,
    SkillCategoryUpdate,
    SkillCreate,
    SkillUpdate,
)


class AdminSkillsService:
    # --- Category Operations ---
    @staticmethod
    def list_categories(db: Session) -> List[SkillCategory]:
        query = select(SkillCategory).order_by(SkillCategory.display_order.asc(), SkillCategory.id.asc())
        return list(db.execute(query).scalars().all())

    @staticmethod
    def create_category(db: Session, cat_in: SkillCategoryCreate) -> SkillCategory:
        existing = db.execute(select(SkillCategory).where(SkillCategory.slug == cat_in.slug)).scalars().first()
        if existing:
            raise ConflictException(f"Category slug '{cat_in.slug}' is already in use.")

        category = SkillCategory(**cat_in.model_dump())
        db.add(category)
        db.commit()
        db.refresh(category)
        return category

    @staticmethod
    def update_category(db: Session, cat_id: int, cat_in: SkillCategoryUpdate) -> SkillCategory:
        category = db.get(SkillCategory, cat_id)
        if not category:
            raise NotFoundException(f"Category with ID {cat_id} not found.")

        fields = cat_in.model_dump(exclude_unset=True)
        if "slug" in fields and fields["slug"] != category.slug:
            existing = db.execute(select(SkillCategory).where(SkillCategory.slug == fields["slug"])).scalars().first()
            if existing:
                raise ConflictException(f"Category slug '{fields['slug']}' is already in use.")

        for key, value in fields.items():
            setattr(category, key, value)

        db.commit()
        db.refresh(category)
        return category

    @staticmethod
    def delete_category(db: Session, cat_id: int) -> None:
        category = db.get(SkillCategory, cat_id)
        if not category:
            raise NotFoundException(f"Category with ID {cat_id} not found.")
        db.delete(category)
        db.commit()

    # --- Skill Operations ---
    @staticmethod
    def list_skills(db: Session, category_id: Optional[int] = None) -> List[Skill]:
        query = select(Skill).order_by(Skill.display_order.asc(), Skill.id.asc())
        if category_id:
            query = query.where(Skill.category_id == category_id)
        return list(db.execute(query).scalars().all())

    @staticmethod
    def create_skill(db: Session, skill_in: SkillCreate) -> Skill:
        # Verify parent category exists
        cat = db.get(SkillCategory, skill_in.category_id)
        if not cat:
            raise NotFoundException(f"Parent category with ID {skill_in.category_id} does not exist.")

        existing = db.execute(select(Skill).where(Skill.slug == skill_in.slug)).scalars().first()
        if existing:
            raise ConflictException(f"Skill slug '{skill_in.slug}' is already in use.")

        skill = Skill(**skill_in.model_dump())
        db.add(skill)
        db.commit()
        db.refresh(skill)
        return skill

    @staticmethod
    def update_skill(db: Session, skill_id: int, skill_in: SkillUpdate) -> Skill:
        skill = db.get(Skill, skill_id)
        if not skill:
            raise NotFoundException(f"Skill with ID {skill_id} not found.")

        fields = skill_in.model_dump(exclude_unset=True)
        if "category_id" in fields:
            cat = db.get(SkillCategory, fields["category_id"])
            if not cat:
                raise NotFoundException(f"Parent category with ID {fields['category_id']} does not exist.")

        if "slug" in fields and fields["slug"] != skill.slug:
            existing = db.execute(select(Skill).where(Skill.slug == fields["slug"])).scalars().first()
            if existing:
                raise ConflictException(f"Skill slug '{fields['slug']}' is already in use.")

        for key, value in fields.items():
            setattr(skill, key, value)

        db.commit()
        db.refresh(skill)
        return skill

    @staticmethod
    def delete_skill(db: Session, skill_id: int) -> None:
        skill = db.get(Skill, skill_id)
        if not skill:
            raise NotFoundException(f"Skill with ID {skill_id} not found.")
        db.delete(skill)
        db.commit()


admin_skills_service = AdminSkillsService()