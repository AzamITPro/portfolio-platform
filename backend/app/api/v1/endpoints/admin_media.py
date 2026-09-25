import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_admin
from app.models.user import User
from app.models.media import Media
from app.schemas.common import APIResponse
from app.schemas.admin_media import MediaOut, MediaUpdate
from app.services.admin_media import admin_media_service

router = APIRouter(prefix="/admin/media", tags=["Admin: Media Library"])


# Schema for registering external cloud assets (Supabase / S3 / CDN)
class CloudAssetRegister(BaseModel):
    url: str
    original_name: str
    file_type: str = "image"
    alt_text: Optional[str] = None


# 1. Static Routes (MUST be defined before /{media_id})
@router.get("", response_model=APIResponse[List[MediaOut]])
def list_media(
    file_type: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """List all uploaded assets in the media library."""
    items = admin_media_service.list_media(db, file_type)
    return APIResponse(message="Media assets retrieved successfully", data=items)


@router.post("/upload", response_model=APIResponse[MediaOut], status_code=status.HTTP_201_CREATED)
async def upload_media_file(
    file: UploadFile = File(...),
    alt_text: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Upload asset to local/ephemeral disk."""
    media = await admin_media_service.upload_file(db, file, admin.id, alt_text)
    return APIResponse(message="File uploaded successfully", data=media)


@router.post("/register-cloud-url", response_model=APIResponse[MediaOut], status_code=status.HTTP_201_CREATED)
def register_cloud_asset(
    payload: CloudAssetRegister,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Register a permanent Supabase Storage or external S3 asset directly in PostgreSQL."""
    new_media = Media(
        file_name=payload.original_name,
        original_name=payload.original_name,
        file_type=payload.file_type,
        mime_type="image/jpeg" if payload.file_type == "image" else ("video/mp4" if payload.file_type == "video" else "application/pdf"),
        file_size=1024 * 300,
        storage_key=f"cloud_{uuid.uuid4().hex[:12]}",
        url=payload.url.strip(),
        alt_text=payload.alt_text or payload.original_name,
        uploaded_by=admin.id,
    )
    db.add(new_media)
    db.commit()
    db.refresh(new_media)
    return APIResponse(message="Cloud asset registered successfully!", data=new_media)


# 2. Dynamic Path Parameter Routes (Defined at the end)
@router.get("/{media_id}", response_model=APIResponse[MediaOut])
def get_media_item(
    media_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Retrieve detailed metadata for a single media item."""
    item = admin_media_service.get_media_by_id(db, media_id)
    return APIResponse(message="Media item retrieved successfully", data=item)


@router.delete("/{media_id}", response_model=APIResponse[None])
def delete_media_file(
    media_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Permanently delete a media asset."""
    admin_media_service.delete_media(db, media_id)
    return APIResponse(message="Media item deleted successfully", data=None)