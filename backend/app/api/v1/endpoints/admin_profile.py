from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_admin
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.admin_profile import (
    ProfileUpdate,
    ProfileOut,
    SocialLinkCreate,
    SocialLinkUpdate,
    SocialLinkOut,
)
from app.services.admin_profile import admin_profile_service

router = APIRouter(prefix="/admin", tags=["Admin: Profile & Social Links"])


# ==============================================================================
# Admin Profile Endpoints
# ==============================================================================

@router.get("/profile", response_model=APIResponse[ProfileOut])
def get_my_profile(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Retrieve full profile details for the authenticated administrator."""
    profile = admin_profile_service.get_profile(db, admin.id)
    return APIResponse(message="Profile retrieved successfully", data=profile)


@router.put("/profile", response_model=APIResponse[ProfileOut])
def update_my_profile(
    payload: ProfileUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Update profile details (title, bio, about, availability, contact info)."""
    updated = admin_profile_service.update_profile(db, admin.id, payload)
    return APIResponse(message="Profile updated successfully", data=updated)


# ==============================================================================
# Admin Social Links Endpoints
# ==============================================================================

@router.get("/social-links", response_model=APIResponse[List[SocialLinkOut]])
def list_my_social_links(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """List all social links (visible & hidden) for admin management."""
    profile = admin_profile_service.get_profile(db, admin.id)
    links = admin_profile_service.list_social_links(db, profile.id)
    return APIResponse(message="Social links retrieved successfully", data=links)


@router.post("/social-links", response_model=APIResponse[SocialLinkOut], status_code=status.HTTP_201_CREATED)
def create_social_link(
    payload: SocialLinkCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Add a new social link (e.g. GitHub, LinkedIn)."""
    profile = admin_profile_service.get_profile(db, admin.id)
    new_link = admin_profile_service.create_social_link(db, profile.id, payload)
    return APIResponse(message="Social link created successfully", data=new_link)


@router.put("/social-links/{link_id}", response_model=APIResponse[SocialLinkOut])
def update_social_link(
    link_id: int,
    payload: SocialLinkUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Update an existing social link, change order, or toggle visibility."""
    profile = admin_profile_service.get_profile(db, admin.id)
    updated = admin_profile_service.update_social_link(db, profile.id, link_id, payload)
    return APIResponse(message="Social link updated successfully", data=updated)


@router.delete("/social-links/{link_id}", response_model=APIResponse[None])
def delete_social_link(
    link_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Permanently remove a social link."""
    profile = admin_profile_service.get_profile(db, admin.id)
    admin_profile_service.delete_social_link(db, profile.id, link_id)
    return APIResponse(message="Social link deleted successfully", data=None)