from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


# ==============================================================================
# Skill Category Schemas
# ==============================================================================

class SkillCategoryCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    display_order: int = 0
    is_visible: bool = True


class SkillCategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    display_order: Optional[int] = None
    is_visible: Optional[bool] = None


class SkillCategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    display_order: int
    is_visible: bool

    model_config = ConfigDict(from_attributes=True)


# ==============================================================================
# Skill Schemas
# ==============================================================================

class SkillCreate(BaseModel):
    category_id: int
    name: str
    slug: str
    description: Optional[str] = None
    proficiency_level: int = Field(default=80, ge=1, le=100)
    icon: Optional[str] = None
    display_order: int = 0
    is_featured: bool = False
    is_visible: bool = True


class SkillUpdate(BaseModel):
    category_id: Optional[int] = None
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    proficiency_level: Optional[int] = Field(default=None, ge=1, le=100)
    icon: Optional[str] = None
    display_order: Optional[int] = None
    is_featured: Optional[bool] = None
    is_visible: Optional[bool] = None


class SkillOut(BaseModel):
    id: int
    category_id: int
    name: str
    slug: str
    description: Optional[str] = None
    proficiency_level: int
    icon: Optional[str] = None
    display_order: int
    is_featured: bool
    is_visible: bool

    model_config = ConfigDict(from_attributes=True)