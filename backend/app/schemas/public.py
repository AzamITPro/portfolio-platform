from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel, EmailStr, ConfigDict


class PublicSocialLinkOut(BaseModel):
    id: int
    platform: str
    url: str
    username: str
    icon: Optional[str] = None
    display_order: int

    model_config = ConfigDict(from_attributes=True)


class PublicProfileOut(BaseModel):
    full_name: str
    professional_title: str
    short_bio: str
    about_me: str
    location: str
    email: str
    phone: Optional[str] = None
    availability: str
    profile_image_url: Optional[str] = None
    social_links: List[PublicSocialLinkOut] = []

    model_config = ConfigDict(from_attributes=True)


class PublicSkillOut(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    proficiency_level: int
    icon: Optional[str] = None
    is_featured: bool

    model_config = ConfigDict(from_attributes=True)


class PublicSkillCategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    skills: List[PublicSkillOut] = []

    model_config = ConfigDict(from_attributes=True)


class PublicProjectSummaryOut(BaseModel):
    id: int
    title: str
    slug: str
    short_description: str
    project_type: str
    role: str
    status: str
    is_featured: bool
    cover_image_url: Optional[str] = None
    github_url: Optional[str] = None
    live_demo_url: Optional[str] = None
    skills: List[str] = []

    model_config = ConfigDict(from_attributes=True)


class PublicProjectMediaOut(BaseModel):
    id: int
    url: str
    caption: Optional[str] = None
    is_featured: bool

    model_config = ConfigDict(from_attributes=True)


class PublicProjectDetailOut(PublicProjectSummaryOut):
    description: str
    problem: Optional[str] = None
    solution: Optional[str] = None
    features: Optional[str] = None
    challenges: Optional[str] = None
    learnings: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    media_items: List[PublicProjectMediaOut] = []
    categories: List[str] = []


class PublicCertificateOut(BaseModel):
    id: int
    title: str
    issuer: str
    description: Optional[str] = None
    issue_date: date
    expiry_date: Optional[date] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None
    certificate_media_url: Optional[str] = None
    is_featured: bool

    model_config = ConfigDict(from_attributes=True)


class PublicEducationOut(BaseModel):
    id: int
    institution: str
    degree: str
    field_of_study: str
    description: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    is_current: bool

    model_config = ConfigDict(from_attributes=True)


class PublicExperienceOut(BaseModel):
    id: int
    company_name: str
    position: str
    employment_type: str
    location: Optional[str] = None
    description: str
    start_date: date
    end_date: Optional[date] = None
    is_current: bool

    model_config = ConfigDict(from_attributes=True)


class PublicServiceOut(BaseModel):
    id: int
    title: str
    slug: str
    short_description: str
    description: str
    icon: Optional[str] = None
    is_featured: bool

    model_config = ConfigDict(from_attributes=True)


class PublicDocumentOut(BaseModel):
    title: str
    type: str
    description: Optional[str] = None
    file_url: str
    file_size: int

    model_config = ConfigDict(from_attributes=True)


class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str