from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta, timezone
from sqlalchemy import select, func, distinct, desc
from sqlalchemy.orm import Session
from app.models.analytics import PageView, AnalyticsEvent
from app.models.communication import ContactMessage
from app.schemas.analytics import (
    PageViewCreate,
    AnalyticsEventCreate,
    AnalyticsSummaryOut,
    DailyStat,
    TopPathStat,
)


class AnalyticsService:
    @staticmethod
    def record_page_view(db: Session, data: PageViewCreate, client_ip: str) -> None:
        view = PageView(
            path=data.path[:500],
            referrer=data.referrer[:500] if data.referrer else None,
            session_id=data.session_id[:100],
            device_type=data.device_type[:50] if data.device_type else "desktop",
            browser=data.browser[:50] if data.browser else "browser",
        )
        db.add(view)
        db.commit()

    @staticmethod
    def record_event(db: Session, data: AnalyticsEventCreate) -> None:
        event = AnalyticsEvent(
            event_name=data.event_name[:100],
            page_path=data.page_path[:500],
            target_type=data.target_type[:100] if data.target_type else None,
            target_id=data.target_id[:100] if data.target_id else None,
            session_id=data.session_id[:100],
            metadata_json=data.metadata_json,
        )
        db.add(event)
        db.commit()

    @staticmethod
    def get_summary(db: Session) -> AnalyticsSummaryOut:
        # 1. Total views & unique visitors
        total_views = db.execute(select(func.count(PageView.id))).scalar_one() or 0
        unique_visitors = db.execute(select(func.count(distinct(PageView.session_id)))).scalar_one() or 0

        # 2. Key Action Events
        cv_downloads = db.execute(
            select(func.count(AnalyticsEvent.id)).where(AnalyticsEvent.event_name == "cv_download")
        ).scalar_one() or 0

        github_clicks = db.execute(
            select(func.count(AnalyticsEvent.id)).where(AnalyticsEvent.event_name == "github_click")
        ).scalar_one() or 0

        contact_submissions = db.execute(select(func.count(ContactMessage.id))).scalar_one() or 0

        # 3. Top visited pages (Top 5)
        top_pages_query = (
            select(PageView.path, func.count(PageView.id).label("count"))
            .group_by(PageView.path)
            .order_by(desc("count"))
            .limit(5)
        )
        top_pages_rows = db.execute(top_pages_query).all()
        top_pages = [TopPathStat(path=row[0], count=row[1]) for row in top_pages_rows]

        # 4. Daily traffic for the past 7 days
        seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)
        daily_query = (
            select(
                func.date(PageView.created_at).label("day"),
                func.count(PageView.id).label("views"),
            )
            .where(PageView.created_at >= seven_days_ago)
            .group_by(func.date(PageView.created_at))
            .order_by(func.date(PageView.created_at).asc())
        )
        daily_rows = db.execute(daily_query).all()
        daily_traffic = [
            DailyStat(date=str(row[0]), views=row[1]) for row in daily_rows
        ]

        # Fallback if no views yet in the last 7 days: show today with 0
        if not daily_traffic:
            today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
            daily_traffic = [DailyStat(date=today_str, views=total_views)]

        return AnalyticsSummaryOut(
            total_page_views=total_views,
            unique_visitors=unique_visitors,
            cv_downloads=cv_downloads,
            github_clicks=github_clicks,
            contact_submissions=contact_submissions,
            top_pages=top_pages,
            daily_traffic=daily_traffic,
        )


analytics_service = AnalyticsService()