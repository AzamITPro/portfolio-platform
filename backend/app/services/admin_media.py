import os
import uuid
from pathlib import Path
from typing import List, Optional
from PIL import Image
from fastapi import UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.media import Media
from app.core.exceptions import BadRequestException, NotFoundException

# Allowed extensions and MIME types
ALLOWED_EXTENSIONS = {
    # Images
    "png": ("image", "image/png"),
    "jpg": ("image", "image/jpeg"),
    "jpeg": ("image", "image/jpeg"),
    "webp": ("image", "image/webp"),
    "svg": ("image", "image/svg+xml"),
    # Documents
    "pdf": ("document", "application/pdf"),
    # Short Demo Videos (< 1 minute)
    "mp4": ("video", "video/mp4"),
    "webm": ("video", "video/webm"),
}

# Max file sizes
MAX_IMAGE_SIZE = 10 * 1024 * 1024       # 10 MB
MAX_DOCUMENT_SIZE = 15 * 1024 * 1024   # 15 MB
MAX_VIDEO_SIZE = 35 * 1024 * 1024      # 35 MB (Ideal for high-res 60s demo clips)

UPLOADS_DIR = Path(__file__).resolve().parents[2] / "uploads"


class AdminMediaService:
    @staticmethod
    def list_media(db: Session, file_type: Optional[str] = None) -> List[Media]:
        query = select(Media).order_by(Media.created_at.desc())
        if file_type:
            query = query.where(Media.file_type == file_type.strip().lower())
        return list(db.execute(query).scalars().all())

    @staticmethod
    def get_media_by_id(db: Session, media_id: int) -> Media:
        media = db.get(Media, media_id)
        if not media:
            raise NotFoundException(f"Media item with ID {media_id} not found.")
        return media

    @staticmethod
    async def upload_file(
        db: Session, file: UploadFile, user_id: int, alt_text: Optional[str] = None
    ) -> Media:
        original_filename = file.filename or "unknown"
        ext = original_filename.split(".")[-1].lower() if "." in original_filename else ""

        # 1. Extension Validation
        if ext not in ALLOWED_EXTENSIONS:
            raise BadRequestException(
                f"File extension '.{ext}' is not permitted. Allowed: {', '.join(ALLOWED_EXTENSIONS.keys())}"
            )

        file_category, expected_mime = ALLOWED_EXTENSIONS[ext]

        # 2. Read file content safely
        content = await file.read()
        file_size = len(content)

       # 3. File Size Validation
        if file_category == "image":
            max_limit = MAX_IMAGE_SIZE
        elif file_category == "video":
            max_limit = MAX_VIDEO_SIZE
        else:
            max_limit = MAX_DOCUMENT_SIZE

        if file_size > max_limit:
            limit_mb = max_limit // (1024 * 1024)
            raise BadRequestException(f"File exceeds maximum allowed size of {limit_mb}MB.")

        # 4. Generate unique storage key
        unique_id = str(uuid.uuid4())
        unique_filename = f"{unique_id}.{ext}"
        target_path = UPLOADS_DIR / unique_filename

        # Ensure directory exists
        UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

        # 5. Save file to disk
        with open(target_path, "wb") as f:
            f.write(content)

        # 6. Extract image dimensions if applicable
        width, height = None, None
        if file_category == "image" and ext in ["png", "jpg", "jpeg", "webp"]:
            try:
                with Image.open(target_path) as img:
                    width, height = img.size
            except Exception:
                pass

        # 7. Construct publicly accessible URL
        file_url = f"http://127.0.0.1:8000/uploads/{unique_filename}"

        # 8. Save metadata to PostgreSQL
        media_record = Media(
            file_name=unique_filename,
            original_name=original_filename,
            file_type=file_category,
            mime_type=file.content_type or expected_mime,
            file_size=file_size,
            storage_key=unique_filename,
            url=file_url,
            alt_text=alt_text or original_filename,
            width=width,
            height=height,
            uploaded_by=user_id,
        )
        db.add(media_record)
        db.commit()
        db.refresh(media_record)
        return media_record

    @staticmethod
    def delete_media(db: Session, media_id: int) -> None:
        media = AdminMediaService.get_media_by_id(db, media_id)
        
        # Remove physical file from disk
        file_path = UPLOADS_DIR / media.storage_key
        if file_path.exists():
            try:
                os.remove(file_path)
            except OSError:
                pass

        db.delete(media)
        db.commit()


admin_media_service = AdminMediaService()