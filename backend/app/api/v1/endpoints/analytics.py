from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_admin
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.analytics import (
    PageViewCreate,
    AnalyticsEventCreate,
    AnalyticsSummaryOut,
)
from app.services.analytics import analytics_service

router = APIRouter(tags=["Analytics & Tracking"])


# Public Tracking Endpoints
@router.post("/public/analytics/view", response_model=APIResponse[None])
def record_page_view(
    payload: PageViewCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    """Anonymous page view beacon sent by the frontend."""
    client_ip = request.client.host if request.client else "127.0.0.1"
    analytics_service.record_page_view(db, payload, client_ip)
    return APIResponse(message="Page view logged", data=None)


@router.post("/public/analytics/event", response_model=APIResponse[None])
def record_event(
    payload: AnalyticsEventCreate,
    db: Session = Depends(get_db),
):
    """Track key user interactions (CV download, GitHub click, Project click)."""
    analytics_service.record_event(db, payload)
    return APIResponse(message="Event recorded", data=None)


# Protected Admin Analytics Endpoint
@router.get("/admin/analytics/summary", response_model=APIResponse[AnalyticsSummaryOut])
def get_analytics_summary(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Retrieve full analytics intelligence: traffic, visitor counts, and action events."""
    summary = analytics_service.get_summary(db)
    return APIResponse(message="Analytics intelligence retrieved", data=summary)