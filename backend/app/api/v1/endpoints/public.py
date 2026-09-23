from typing import List, Optional, Dict
from pathlib import Path
from fastapi import APIRouter, Depends, Request
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.limiter import limiter
from app.core.exceptions import NotFoundException
from app.models.communication import SiteSetting
from app.schemas.common import APIResponse
from app.schemas.public import (
    PublicProfileOut,
    PublicSkillCategoryOut,
    PublicProjectSummaryOut,
    PublicProjectDetailOut,
    PublicCertificateOut,
    PublicEducationOut,
    PublicExperienceOut,
    PublicServiceOut,
    PublicDocumentOut,
    ContactMessageCreate,
)
from app.services.public import public_service

UPLOADS_DIR = Path(__file__).resolve().parents[4] / "uploads"

router = APIRouter(prefix="/public", tags=["Public Portfolio"])


@router.get("/profile", response_model=APIResponse[Optional[PublicProfileOut]])
def get_public_profile(db: Session = Depends(get_db)):
    """Retrieve public developer profile, bio, and visible social links."""
    data = public_service.get_profile(db)
    return APIResponse(message="Profile retrieved successfully", data=data)


@router.get("/skills", response_model=APIResponse[List[PublicSkillCategoryOut]])
def get_public_skills(db: Session = Depends(get_db)):
    """Retrieve all visible skills categorized by department/stack."""
    data = public_service.get_skills_grouped(db)
    return APIResponse(message="Skills retrieved successfully", data=data)


@router.get("/projects", response_model=APIResponse[List[PublicProjectSummaryOut]])
def get_public_projects(featured_only: bool = False, db: Session = Depends(get_db)):
    """Retrieve portfolio projects with optional featured filter."""
    data = public_service.get_projects(db, featured_only=featured_only)
    return APIResponse(message="Projects retrieved successfully", data=data)


@router.get("/projects/{slug}", response_model=APIResponse[PublicProjectDetailOut])
def get_public_project_details(slug: str, db: Session = Depends(get_db)):
    """Retrieve in-depth project study (problem, solution, features, learnings)."""
    data = public_service.get_project_by_slug(db, slug)
    return APIResponse(message="Project details retrieved successfully", data=data)


@router.get("/certificates", response_model=APIResponse[List[PublicCertificateOut]])
def get_public_certificates(db: Session = Depends(get_db)):
    """Retrieve verified professional certificates and credentials."""
    data = public_service.get_certificates(db)
    return APIResponse(message="Certificates retrieved successfully", data=data)


@router.get("/education", response_model=APIResponse[List[PublicEducationOut]])
def get_public_education(db: Session = Depends(get_db)):
    """Retrieve academic background timeline."""
    data = public_service.get_education(db)
    return APIResponse(message="Education timeline retrieved successfully", data=data)


@router.get("/experience", response_model=APIResponse[List[PublicExperienceOut]])
def get_public_experience(db: Session = Depends(get_db)):
    """Retrieve professional work experience timeline."""
    data = public_service.get_experience(db)
    return APIResponse(message="Work experience retrieved successfully", data=data)


@router.get("/services", response_model=APIResponse[List[PublicServiceOut]])
def get_public_services(db: Session = Depends(get_db)):
    """Retrieve software development capabilities and offerings."""
    data = public_service.get_services(db)
    return APIResponse(message="Services retrieved successfully", data=data)


@router.get("/documents/cv", response_model=APIResponse[Optional[PublicDocumentOut]])
def get_public_cv(db: Session = Depends(get_db)):
    """Retrieve the primary active resume document metadata."""
    data = public_service.get_primary_cv(db)
    return APIResponse(message="CV metadata retrieved successfully", data=data)


@router.get("/documents/cv/download")
def download_public_cv(db: Session = Depends(get_db)):
    """Stream and trigger direct download of the active primary resume PDF."""
    doc = public_service.get_primary_cv_record(db)
    if not doc or not doc.media:
        raise NotFoundException("No active resume document currently available.")

    file_path = UPLOADS_DIR / doc.media.storage_key
    if not file_path.exists():
        raise NotFoundException("Resume PDF file not found on storage disk.")

    return FileResponse(
        path=str(file_path),
        filename=doc.title,
        media_type="application/pdf",
    )


@router.get("/settings", response_model=APIResponse[Dict[str, str]])
def get_public_site_settings(db: Session = Depends(get_db)):
    """Retrieve public site configuration key-value dictionary."""
    settings_rows = db.execute(select(SiteSetting)).scalars().all()
    settings_dict = {s.key: s.value for s in settings_rows}
    return APIResponse(message="Settings retrieved successfully", data=settings_dict)


@router.post("/contact", response_model=APIResponse[None])
@limiter.limit("5/hour")
def submit_contact_form(
    request: Request,
    msg: ContactMessageCreate,
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "127.0.0.1"
    user_agent = request.headers.get("user-agent")
    public_service.submit_contact_message(db, msg, client_ip, user_agent)
    return APIResponse(
        message="Thank you for reaching out! Your message has been received.",
        data=None,
    )