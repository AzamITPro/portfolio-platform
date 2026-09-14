from typing import Optional, List, Dict, Any
from datetime import datetime, date
from pydantic import BaseModel, ConfigDict


class PageViewCreate(BaseModel):
    path: str
    referrer: Optional[str] = None
    session_id: str
    device_type: Optional[str] = None  # desktop, mobile, tablet
    browser: Optional[str] = None


class AnalyticsEventCreate(BaseModel):
    event_name: str  # cv_download, github_click, contact_submit, project_view
    page_path: str
    target_type: Optional[str] = None
    target_id: Optional[str] = None
    session_id: str
    metadata_json: Optional[str] = None


class DailyStat(BaseModel):
    date: str
    views: int


class TopPathStat(BaseModel):
    path: str
    count: int


class AnalyticsSummaryOut(BaseModel):
    total_page_views: int
    unique_visitors: int
    cv_downloads: int
    github_clicks: int
    contact_submissions: int
    top_pages: List[TopPathStat]
    daily_traffic: List[DailyStat]