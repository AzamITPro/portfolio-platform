from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_admin
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.admin_projects import (
    ProjectCategoryCreate,
    ProjectCategoryUpdate,
    ProjectCategoryOut,
    ProjectCreate,
    ProjectUpdate,
    ProjectAdminOut,
)
from app.services.admin_projects import admin_projects_service

router = APIRouter(prefix="/admin", tags=["Admin: Projects CMS"])


# ==============================================================================
# Project Categories Endpoints
# ==============================================================================

@router.get("/project-categories", response_model=APIResponse[List[ProjectCategoryOut]])
def list_project_categories(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    categories = admin_projects_service.list_categories(db)
    return APIResponse(message="Project categories retrieved successfully", data=categories)


@router.post("/project-categories", response_model=APIResponse[ProjectCategoryOut], status_code=status.HTTP_201_CREATED)
def create_project_category(
    payload: ProjectCategoryCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    new_cat = admin_projects_service.create_category(db, payload)
    return APIResponse(message="Project category created successfully", data=new_cat)


@router.put("/project-categories/{cat_id}", response_model=APIResponse[ProjectCategoryOut])
def update_project_category(
    cat_id: int,
    payload: ProjectCategoryUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    updated = admin_projects_service.update_category(db, cat_id, payload)
    return APIResponse(message="Project category updated successfully", data=updated)


@router.delete("/project-categories/{cat_id}", response_model=APIResponse[None])
def delete_project_category(
    cat_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    admin_projects_service.delete_category(db, cat_id)
    return APIResponse(message="Project category deleted successfully", data=None)


# ==============================================================================
# Projects CMS Endpoints
# ==============================================================================

@router.get("/projects", response_model=APIResponse[List[ProjectAdminOut]])
def list_projects(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    projects = admin_projects_service.list_projects(db)
    return APIResponse(message="Projects retrieved successfully", data=projects)


@router.get("/projects/{project_id}", response_model=APIResponse[ProjectAdminOut])
def get_project_details(
    project_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    project = admin_projects_service.get_project_by_id(db, project_id)
    return APIResponse(message="Project details retrieved successfully", data=project)


@router.post("/projects", response_model=APIResponse[ProjectAdminOut], status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    new_project = admin_projects_service.create_project(db, payload)
    return APIResponse(message="Project created successfully", data=new_project)


@router.put("/projects/{project_id}", response_model=APIResponse[ProjectAdminOut])
def update_project(
    project_id: int,
    payload: ProjectUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    updated = admin_projects_service.update_project(db, project_id, payload)
    return APIResponse(message="Project updated successfully", data=updated)


@router.delete("/projects/{project_id}", response_model=APIResponse[None])
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    admin_projects_service.delete_project(db, project_id)
    return APIResponse(message="Project deleted successfully", data=None)