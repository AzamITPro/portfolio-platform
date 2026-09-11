from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class MediaOut(BaseModel):
    id: int
    file_name: str
    original_name: str
    file_type: str  # image, document
    mime_type: str
    file_size: int
    storage_key: str
    url: str
    alt_text: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    uploaded_by: Optional[int] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MediaUpdate(BaseModel):
    alt_text: Optional[str] = None