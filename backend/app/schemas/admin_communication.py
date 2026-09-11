from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict


# ==============================================================================
# Contact Messages Schemas
# ==============================================================================

class MessageStatusUpdate(BaseModel):
    status: str  # new, read, replied, archived, spam


class ContactMessageAdminOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    subject: str
    message: str
    status: str
    ip_hash: Optional[str] = None
    user_agent: Optional[str] = None
    created_at: datetime
    read_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ==============================================================================
# Site Settings Schemas
# ==============================================================================

class SiteSettingCreate(BaseModel):
    key: str
    value: str
    description: Optional[str] = None


class SiteSettingUpdate(BaseModel):
    value: str
    description: Optional[str] = None


class SiteSettingOut(BaseModel):
    id: int
    key: str
    value: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)