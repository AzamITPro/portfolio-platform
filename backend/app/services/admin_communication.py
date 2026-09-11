from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.communication import ContactMessage, SiteSetting
from app.core.exceptions import NotFoundException, ConflictException
from app.schemas.admin_communication import (
    MessageStatusUpdate,
    SiteSettingCreate,
    SiteSettingUpdate,
)


class AdminCommunicationService:
    # --- Messages Inbox ---
    @staticmethod
    def list_messages(db: Session, status: Optional[str] = None) -> List[ContactMessage]:
        query = select(ContactMessage).order_by(ContactMessage.created_at.desc())
        if status:
            query = query.where(ContactMessage.status == status.strip().lower())
        return list(db.execute(query).scalars().all())

    @staticmethod
    def get_message(db: Session, msg_id: int) -> ContactMessage:
        msg = db.get(ContactMessage, msg_id)
        if not msg:
            raise NotFoundException(f"Message with ID {msg_id} not found.")
        
        # Automatically mark read_at when inspected by admin
        if not msg.read_at:
            msg.read_at = datetime.now(timezone.utc)
            if msg.status == "new":
                msg.status = "read"
            db.commit()
            db.refresh(msg)
        return msg

    @staticmethod
    def update_message_status(db: Session, msg_id: int, payload: MessageStatusUpdate) -> ContactMessage:
        msg = db.get(ContactMessage, msg_id)
        if not msg:
            raise NotFoundException(f"Message with ID {msg_id} not found.")

        msg.status = payload.status.strip().lower()
        if msg.status != "new" and not msg.read_at:
            msg.read_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(msg)
        return msg

    @staticmethod
    def delete_message(db: Session, msg_id: int) -> None:
        msg = db.get(ContactMessage, msg_id)
        if not msg:
            raise NotFoundException(f"Message with ID {msg_id} not found.")
        db.delete(msg)
        db.commit()

    # --- Site Settings ---
    @staticmethod
    def list_settings(db: Session) -> List[SiteSetting]:
        return list(db.execute(select(SiteSetting).order_by(SiteSetting.key.asc())).scalars().all())

    @staticmethod
    def create_setting(db: Session, data: SiteSettingCreate) -> SiteSetting:
        existing = db.execute(select(SiteSetting).where(SiteSetting.key == data.key)).scalars().first()
        if existing:
            raise ConflictException(f"Setting key '{data.key}' already exists.")

        setting = SiteSetting(
            key=data.key.strip(),
            value=data.value.strip(),
            description=data.description.strip() if data.description else None,
        )
        db.add(setting)
        db.commit()
        db.refresh(setting)
        return setting

    @staticmethod
    def update_setting(db: Session, key: str, data: SiteSettingUpdate) -> SiteSetting:
        setting = db.execute(select(SiteSetting).where(SiteSetting.key == key)).scalars().first()
        if not setting:
            raise NotFoundException(f"Setting with key '{key}' not found.")

        setting.value = data.value.strip()
        if data.description is not None:
            setting.description = data.description.strip()

        db.commit()
        db.refresh(setting)
        return setting

    @staticmethod
    def delete_setting(db: Session, key: str) -> None:
        setting = db.execute(select(SiteSetting).where(SiteSetting.key == key)).scalars().first()
        if not setting:
            raise NotFoundException(f"Setting with key '{key}' not found.")
        db.delete(setting)
        db.commit()


admin_comm_service = AdminCommunicationService()