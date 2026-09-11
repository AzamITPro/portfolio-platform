from datetime import datetime
from typing import Optional
from sqlalchemy import String, DateTime, Integer, Text, Index
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from app.db.session import Base


class PageView(Base):
    __tablename__ = "page_views"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    path: Mapped[str] = mapped_column(String(500), index=True, nullable=False)
    referrer: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    session_id: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    device_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # mobile, desktop, tablet
    browser: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    country: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True, nullable=False
    )

    __table_args__ = (
        Index("idx_page_views_path_created_at", "path", "created_at"),
    )


class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    event_name: Mapped[str] = mapped_column(String(100), index=True, nullable=False)  # cv_download, github_click, etc.
    page_path: Mapped[str] = mapped_column(String(500), nullable=False)
    target_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # document, project, link
    target_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    session_id: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    metadata_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON-encoded extra details
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True, nullable=False
    )