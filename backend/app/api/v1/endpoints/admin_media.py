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


# Schema for registering external cloud assets (Supabase Storage / S3 / CDN)
class CloudAssetRegister(BaseModel):
    url: str
    original_name: str
    file_type: str = "image"  # image, video, document
    alt_text: Optional[str] = None


# ==============================================================================
# 1. Static Sub-Routes (Defined first to guarantee priority)
# ==============================================================================

@router.get("", response_model=APIResponse[List[MediaOut]])
def list_media(
    file_type: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """List all assets stored in the media library."""
    items = admin_media_service.list_media(db, file_type)
    return APIResponse(message="Media assets retrieved successfully", data=items)


@router.post("/upload", response_model=APIResponse[MediaOut], status_code=status.HTTP_201_CREATED)
async def upload_media_file(
    file: UploadFile = File(...),
    alt_text: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Direct multipart upload to server."""
    media = await admin_media_service.upload_file(db, file, admin.id, alt_text)
    return APIResponse(message="File uploaded successfully", data=media)


@router.post("/register-cloud-url", response_model=APIResponse[MediaOut], status_code=status.HTTP_201_CREATED)
def register_cloud_asset(
    payload: CloudAssetRegister,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """
    Register a permanent asset hosted on Supabase Storage S3 directly into PostgreSQL.
    Guarantees zero-downtime, zero-ephemeral disk loss.
    """
    url_clean = payload.url.strip()
    ext = url_clean.split("?")[0].split(".")[-1].lower() if "." in url_clean else ""

    # Detect appropriate MIME type
    if payload.file_type == "video" or ext in ["mp4", "webm"]:
        file_type = "video"
        mime_type = "video/mp4" if ext == "mp4" else "video/webm"
    elif payload.file_type == "document" or ext == "pdf":
        file_type = "document"
        mime_type = "application/pdf"
    else:
        file_type = "image"
        mime_type = "image/png" if ext == "png" else "image/jpeg"

    new_media = Media(
        file_name=payload.original_name.strip(),
        original_name=payload.original_name.strip(),
        file_type=file_type,
        mime_type=mime_type,
        file_size=1024 * 300,
        storage_key=f"cloud_{uuid.uuid4().hex[:12]}",
        url=url_clean,
        alt_text=(payload.alt_text or payload.original_name).strip(),
        uploaded_by=admin.id,
    )
    db.add(new_media)
    db.commit()
    db.refresh(new_media)
    return APIResponse(message="Cloud asset registered successfully!", data=new_media)


# ==============================================================================
# 2. Strict Integer Parameter Routes (Avoids string collision)
# ==============================================================================

@router.get("/{media_id:int}", response_model=APIResponse[MediaOut])
def get_media_item(
    media_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Retrieve detailed metadata for a single media asset by numeric ID."""
    item = admin_media_service.get_media_by_id(db, media_id)
    return APIResponse(message="Media item retrieved successfully", data=item)


@router.patch("/{media_id:int}", response_model=APIResponse[MediaOut])
def update_media_item(
    media_id: int,
    payload: MediaUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Update media metadata (alt text)."""
    item = admin_media_service.get_media_by_id(db, media_id)
    if payload.alt_text is not None:
        item.alt_text = payload.alt_text.strip()
        db.commit()
        db.refresh(item)
    return APIResponse(message="Media item updated successfully", data=item)


@router.delete("/{media_id:int}", response_model=APIResponse[None])
def delete_media_file(
    media_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Permanently delete a media asset from database and storage."""
    admin_media_service.delete_media(db, media_id)
    return APIResponse(message="Media item deleted successfully", data=None)