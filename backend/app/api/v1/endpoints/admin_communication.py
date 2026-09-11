from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_admin
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.admin_communication import (
    MessageStatusUpdate,
    ContactMessageAdminOut,
    SiteSettingCreate,
    SiteSettingUpdate,
    SiteSettingOut,
)
from app.services.admin_communication import admin_comm_service

router = APIRouter(prefix="/admin", tags=["Admin: Messages Inbox & Site Settings"])


# ==============================================================================
# Messages Inbox Endpoints
# ==============================================================================

@router.get("/messages", response_model=APIResponse[List[ContactMessageAdminOut]])
def list_messages(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Retrieve all contact form inquiries with optional status filter."""
    msgs = admin_comm_service.list_messages(db, status)
    return APIResponse(message="Messages retrieved successfully", data=msgs)


@router.get("/messages/{msg_id}", response_model=APIResponse[ContactMessageAdminOut])
def get_message_detail(
    msg_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """View full message content and automatically mark it as read."""
    msg = admin_comm_service.get_message(db, msg_id)
    return APIResponse(message="Message retrieved successfully", data=msg)


@router.patch("/messages/{msg_id}/status", response_model=APIResponse[ContactMessageAdminOut])
def update_message_status(
    msg_id: int,
    payload: MessageStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Update message status (new, read, replied, archived, spam)."""
    updated = admin_comm_service.update_message_status(db, msg_id, payload)
    return APIResponse(message="Message status updated successfully", data=updated)


@router.delete("/messages/{msg_id}", response_model=APIResponse[None])
def delete_message(
    msg_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Permanently delete a message."""
    admin_comm_service.delete_message(db, msg_id)
    return APIResponse(message="Message deleted successfully", data=None)


# ==============================================================================
# Site Settings Endpoints
# ==============================================================================

@router.get("/settings", response_model=APIResponse[List[SiteSettingOut]])
def list_settings(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Retrieve all site configuration key-value pairs."""
    settings_list = admin_comm_service.list_settings(db)
    return APIResponse(message="Settings retrieved successfully", data=settings_list)


@router.post("/settings", response_model=APIResponse[SiteSettingOut], status_code=status.HTTP_201_CREATED)
def create_setting(
    payload: SiteSettingCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Create a new site setting."""
    new_setting = admin_comm_service.create_setting(db, payload)
    return APIResponse(message="Setting created successfully", data=new_setting)


@router.put("/settings/{key}", response_model=APIResponse[SiteSettingOut])
def update_setting(
    key: str,
    payload: SiteSettingUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Update an existing site setting by key."""
    updated = admin_comm_service.update_setting(db, key, payload)
    return APIResponse(message="Setting updated successfully", data=updated)


@router.delete("/settings/{key}", response_model=APIResponse[None])
def delete_setting(
    key: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Delete a site setting by key."""
    admin_comm_service.delete_setting(db, key)
    return APIResponse(message="Setting deleted successfully", data=None)