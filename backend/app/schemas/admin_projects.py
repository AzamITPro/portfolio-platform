from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict


# ==============================================================================
# Project Category Schemas
# ==============================================================================

class ProjectCategoryCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    display_order: int = 0
    is_visible: bool = True


class ProjectCategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    display_order: Optional[int] = None
    is_visible: Optional[bool] = None


class ProjectCategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    display_order: int
    is_visible: bool

    model_config = ConfigDict(from_attributes=True)


# ==============================================================================
# Project Schemas
# ==============================================================================

class ProjectCreate(BaseModel):
    title: str
    slug: str
    short_description: str
    description: str
    project_type: str = "Full-Stack"
    role: str = "Full-Stack Developer"
    problem: Optional[str] = None
    solution: Optional[str] = None
    features: Optional[str] = None
    challenges: Optional[str] = None
    learnings: Optional[str] = None
    status: str = "Completed"
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    github_url: Optional[str] = None
    live_demo_url: Optional[str] = None
    cover_media_id: Optional[int] = None
    is_featured: bool = False
    is_visible: bool = True
    display_order: int = 0
    skill_ids: List[int] = []
    category_ids: List[int] = []


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    project_type: Optional[str] = None
    role: Optional[str] = None
    problem: Optional[str] = None
    solution: Optional[str] = None
    features: Optional[str] = None
    challenges: Optional[str] = None
    learnings: Optional[str] = None
    status: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    github_url: Optional[str] = None
    live_demo_url: Optional[str] = None
    cover_media_id: Optional[int] = None
    is_featured: Optional[bool] = None
    is_visible: Optional[bool] = None
    display_order: Optional[int] = None
    skill_ids: Optional[List[int]] = None
    category_ids: Optional[List[int]] = None


class SkillBriefOut(BaseModel):
    id: int
    name: str
    slug: str

    model_config = ConfigDict(from_attributes=True)


class ProjectAdminOut(BaseModel):
    id: int
    title: str
    slug: str
    short_description: str
    description: str
    project_type: str
    role: str
    problem: Optional[str] = None
    solution: Optional[str] = None
    features: Optional[str] = None
    challenges: Optional[str] = None
    learnings: Optional[str] = None
    status: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    github_url: Optional[str] = None
    live_demo_url: Optional[str] = None
    cover_media_id: Optional[int] = None
    is_featured: bool
    is_visible: bool
    display_order: int
    created_at: datetime
    skills: List[SkillBriefOut] = []
    categories: List[ProjectCategoryOut] = []

    model_config = ConfigDict(from_attributes=True)