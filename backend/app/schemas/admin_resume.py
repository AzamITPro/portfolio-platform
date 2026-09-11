from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict


# ==============================================================================
# Certificate Schemas
# ==============================================================================

class CertificateCreate(BaseModel):
    title: str
    issuer: str
    description: Optional[str] = None
    issue_date: date
    expiry_date: Optional[date] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None
    certificate_media_id: Optional[int] = None
    is_featured: bool = False
    is_visible: bool = True
    display_order: int = 0


class CertificateUpdate(BaseModel):
    title: Optional[str] = None
    issuer: Optional[str] = None
    description: Optional[str] = None
    issue_date: Optional[date] = None
    expiry_date: Optional[date] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None
    certificate_media_id: Optional[int] = None
    is_featured: Optional[bool] = None
    is_visible: Optional[bool] = None
    display_order: Optional[int] = None


class CertificateAdminOut(BaseModel):
    id: int
    title: str
    issuer: str
    description: Optional[str] = None
    issue_date: date
    expiry_date: Optional[date] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None
    certificate_media_id: Optional[int] = None
    is_featured: bool
    is_visible: bool
    display_order: int

    model_config = ConfigDict(from_attributes=True)


# ==============================================================================
# Education Schemas
# ==============================================================================

class EducationCreate(BaseModel):
    institution: str
    degree: str
    field_of_study: str
    description: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    is_current: bool = False
    display_order: int = 0
    is_visible: bool = True


class EducationUpdate(BaseModel):
    institution: Optional[str] = None
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: Optional[bool] = None
    display_order: Optional[int] = None
    is_visible: Optional[bool] = None


class EducationAdminOut(BaseModel):
    id: int
    institution: str
    degree: str
    field_of_study: str
    description: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    is_current: bool
    display_order: int
    is_visible: bool

    model_config = ConfigDict(from_attributes=True)


# ==============================================================================
# Experience Schemas
# ==============================================================================

class ExperienceCreate(BaseModel):
    company_name: str
    position: str
    employment_type: str = "Full-time"
    location: Optional[str] = None
    description: str
    start_date: date
    end_date: Optional[date] = None
    is_current: bool = False
    display_order: int = 0
    is_visible: bool = True


class ExperienceUpdate(BaseModel):
    company_name: Optional[str] = None
    position: Optional[str] = None
    employment_type: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: Optional[bool] = None
    display_order: Optional[int] = None
    is_visible: Optional[bool] = None


class ExperienceAdminOut(BaseModel):
    id: int
    company_name: str
    position: str
    employment_type: str
    location: Optional[str] = None
    description: str
    start_date: date
    end_date: Optional[date] = None
    is_current: bool
    display_order: int
    is_visible: bool

    model_config = ConfigDict(from_attributes=True)


# ==============================================================================
# Service Schemas
# ==============================================================================

class ServiceCreate(BaseModel):
    title: str
    slug: str
    short_description: str
    description: str
    icon: Optional[str] = None
    display_order: int = 0
    is_featured: bool = False
    is_visible: bool = True


class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    display_order: Optional[int] = None
    is_featured: Optional[bool] = None
    is_visible: Optional[bool] = None


class ServiceAdminOut(BaseModel):
    id: int
    title: str
    slug: str
    short_description: str
    description: str
    icon: Optional[str] = None
    display_order: int
    is_featured: bool
    is_visible: bool

    model_config = ConfigDict(from_attributes=True)