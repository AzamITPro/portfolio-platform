from typing import Optional
from pydantic import BaseModel, EmailStr, HttpUrl, ConfigDict


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    professional_title: Optional[str] = None
    short_bio: Optional[str] = None
    about_me: Optional[str] = None
    location: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    availability: Optional[str] = None
    profile_image_id: Optional[int] = None


class ProfileOut(BaseModel):
    id: int
    user_id: int
    full_name: str
    professional_title: str
    short_bio: str
    about_me: str
    location: str
    email: str
    phone: Optional[str] = None
    availability: str
    profile_image_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


class SocialLinkCreate(BaseModel):
    platform: str
    url: str
    username: str
    icon: Optional[str] = None
    display_order: int = 0
    is_visible: bool = True


class SocialLinkUpdate(BaseModel):
    platform: Optional[str] = None
    url: Optional[str] = None
    username: Optional[str] = None
    icon: Optional[str] = None
    display_order: Optional[int] = None
    is_visible: Optional[bool] = None


class SocialLinkOut(BaseModel):
    id: int
    profile_id: int
    platform: str
    url: str
    username: str
    icon: Optional[str] = None
    display_order: int
    is_visible: bool

    model_config = ConfigDict(from_attributes=True)