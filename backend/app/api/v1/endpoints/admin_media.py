from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_admin
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.admin_media import MediaOut, MediaUpdate
from app.services.admin_media import admin_media_service

router = APIRouter(prefix="/admin/media", tags=["Admin: Media Library"])


@router.get("", response_model=APIResponse[List[MediaOut]])
def list_media(
    file_type: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """List all uploaded assets in the media library."""
    items = admin_media_service.list_media(db, file_type)
    return APIResponse(message="Media assets retrieved successfully", data=items)


@router.get("/{media_id}", response_model=APIResponse[MediaOut])
def get_media_item(
    media_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Retrieve detailed metadata for a single media item."""
    item = admin_media_service.get_media_by_id(db, media_id)
    return APIResponse(message="Media item retrieved successfully", data=item)


@router.post("/upload", response_model=APIResponse[MediaOut], status_code=status.HTTP_201_CREATED)
async def upload_media_file(
    file: UploadFile = File(...),
    alt_text: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """
    Upload an image (PNG, JPG, WEBP, SVG) or document (PDF).
    Extracts dimensions, stores securely with UUID, and registers in PostgreSQL.
    """
    media = await admin_media_service.upload_file(db, file, admin.id, alt_text)
    return APIResponse(message="File uploaded successfully", data=media)


@router.delete("/{media_id}", response_model=APIResponse[None])
def delete_media_file(
    media_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Permanently delete a media asset from disk and database."""
    admin_media_service.delete_media(db, media_id)
    return APIResponse(message="Media item deleted successfully", data=None)