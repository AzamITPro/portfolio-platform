from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_admin
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.admin_skills import (
    SkillCategoryCreate,
    SkillCategoryUpdate,
    SkillCategoryOut,
    SkillCreate,
    SkillUpdate,
    SkillOut,
)
from app.services.admin_skills import admin_skills_service

router = APIRouter(prefix="/admin", tags=["Admin: Skills & Categories"])


# ==============================================================================
# Skill Categories CRUD
# ==============================================================================

@router.get("/skill-categories", response_model=APIResponse[List[SkillCategoryOut]])
def list_categories(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    categories = admin_skills_service.list_categories(db)
    return APIResponse(message="Categories retrieved successfully", data=categories)


@router.post("/skill-categories", response_model=APIResponse[SkillCategoryOut], status_code=status.HTTP_201_CREATED)
def create_category(
    payload: SkillCategoryCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    new_cat = admin_skills_service.create_category(db, payload)
    return APIResponse(message="Category created successfully", data=new_cat)


@router.put("/skill-categories/{cat_id}", response_model=APIResponse[SkillCategoryOut])
def update_category(
    cat_id: int,
    payload: SkillCategoryUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    updated = admin_skills_service.update_category(db, cat_id, payload)
    return APIResponse(message="Category updated successfully", data=updated)


@router.delete("/skill-categories/{cat_id}", response_model=APIResponse[None])
def delete_category(
    cat_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    admin_skills_service.delete_category(db, cat_id)
    return APIResponse(message="Category deleted successfully", data=None)


# ==============================================================================
# Skills CRUD
# ==============================================================================

@router.get("/skills", response_model=APIResponse[List[SkillOut]])
def list_skills(
    category_id: Optional[int] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    skills = admin_skills_service.list_skills(db, category_id)
    return APIResponse(message="Skills retrieved successfully", data=skills)


@router.post("/skills", response_model=APIResponse[SkillOut], status_code=status.HTTP_201_CREATED)
def create_skill(
    payload: SkillCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    new_skill = admin_skills_service.create_skill(db, payload)
    return APIResponse(message="Skill created successfully", data=new_skill)


@router.put("/skills/{skill_id}", response_model=APIResponse[SkillOut])
def update_skill(
    skill_id: int,
    payload: SkillUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    updated = admin_skills_service.update_skill(db, skill_id, payload)
    return APIResponse(message="Skill updated successfully", data=updated)


@router.delete("/skills/{skill_id}", response_model=APIResponse[None])
def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    admin_skills_service.delete_skill(db, skill_id)
    return APIResponse(message="Skill deleted successfully", data=None)