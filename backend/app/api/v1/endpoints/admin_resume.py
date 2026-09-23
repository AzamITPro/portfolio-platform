from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_admin
from app.models.user import User
from app.models.resume import Document
from app.schemas.common import APIResponse
from app.schemas.admin_resume import (
    CertificateCreate, CertificateUpdate, CertificateAdminOut,
    EducationCreate, EducationUpdate, EducationAdminOut,
    ExperienceCreate, ExperienceUpdate, ExperienceAdminOut,
    ServiceCreate, ServiceUpdate, ServiceAdminOut,
)
from app.services.admin_resume import admin_resume_service
from app.services.admin_media import admin_media_service
from app.core.exceptions import BadRequestException

router = APIRouter(prefix="/admin", tags=["Admin: Career, Education & Services"])


# ==============================================================================
# Certificates Endpoints
# ==============================================================================

@router.get("/certificates", response_model=APIResponse[List[CertificateAdminOut]])
def list_certificates(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    return APIResponse(message="Certificates retrieved", data=admin_resume_service.list_certificates(db))

@router.post("/certificates", response_model=APIResponse[CertificateAdminOut], status_code=status.HTTP_201_CREATED)
def create_certificate(payload: CertificateCreate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    return APIResponse(message="Certificate created", data=admin_resume_service.create_certificate(db, payload))

@router.put("/certificates/{cert_id}", response_model=APIResponse[CertificateAdminOut])
def update_certificate(cert_id: int, payload: CertificateUpdate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    return APIResponse(message="Certificate updated", data=admin_resume_service.update_certificate(db, cert_id, payload))

@router.delete("/certificates/{cert_id}", response_model=APIResponse[None])
def delete_certificate(cert_id: int, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    admin_resume_service.delete_certificate(db, cert_id)
    return APIResponse(message="Certificate deleted", data=None)


# ==============================================================================
# Education Endpoints
# ==============================================================================

@router.get("/education", response_model=APIResponse[List[EducationAdminOut]])
def list_education(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    return APIResponse(message="Education retrieved", data=admin_resume_service.list_education(db))

@router.post("/education", response_model=APIResponse[EducationAdminOut], status_code=status.HTTP_201_CREATED)
def create_education(payload: EducationCreate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    return APIResponse(message="Education created", data=admin_resume_service.create_education(db, payload))

@router.put("/education/{edu_id}", response_model=APIResponse[EducationAdminOut])
def update_education(edu_id: int, payload: EducationUpdate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    return APIResponse(message="Education updated", data=admin_resume_service.update_education(db, edu_id, payload))

@router.delete("/education/{edu_id}", response_model=APIResponse[None])
def delete_education(edu_id: int, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    admin_resume_service.delete_education(db, edu_id)
    return APIResponse(message="Education deleted", data=None)


# ==============================================================================
# Experience Endpoints
# ==============================================================================

@router.get("/experience", response_model=APIResponse[List[ExperienceAdminOut]])
def list_experience(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    return APIResponse(message="Experience retrieved", data=admin_resume_service.list_experience(db))

@router.post("/experience", response_model=APIResponse[ExperienceAdminOut], status_code=status.HTTP_201_CREATED)
def create_experience(payload: ExperienceCreate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    return APIResponse(message="Experience created", data=admin_resume_service.create_experience(db, payload))

@router.put("/experience/{exp_id}", response_model=APIResponse[ExperienceAdminOut])
def update_experience(exp_id: int, payload: ExperienceUpdate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    return APIResponse(message="Experience updated", data=admin_resume_service.update_experience(db, exp_id, payload))

@router.delete("/experience/{exp_id}", response_model=APIResponse[None])
def delete_experience(exp_id: int, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    admin_resume_service.delete_experience(db, exp_id)
    return APIResponse(message="Experience deleted", data=None)


# ==============================================================================
# Services Endpoints
# ==============================================================================

@router.get("/services", response_model=APIResponse[List[ServiceAdminOut]])
def list_services(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    return APIResponse(message="Services retrieved", data=admin_resume_service.list_services(db))

@router.post("/services", response_model=APIResponse[ServiceAdminOut], status_code=status.HTTP_201_CREATED)
def create_service(payload: ServiceCreate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    return APIResponse(message="Service created", data=admin_resume_service.create_service(db, payload))

@router.put("/services/{srv_id}", response_model=APIResponse[ServiceAdminOut])
def update_service(srv_id: int, payload: ServiceUpdate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    return APIResponse(message="Service updated", data=admin_resume_service.update_service(db, srv_id, payload))

@router.delete("/services/{srv_id}", response_model=APIResponse[None])
def delete_service(srv_id: int, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    admin_resume_service.delete_service(db, srv_id)
    return APIResponse(message="Service deleted", data=None)


# ==============================================================================
# Resume / CV PDF Document Management
# ==============================================================================

@router.get("/documents/cv", response_model=APIResponse[Optional[dict]])
def get_current_cv(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    """Retrieve currently active primary CV."""
    query = select(Document).where(Document.is_primary == True, Document.type == "cv").limit(1)
    doc = db.execute(query).scalars().first()
    if not doc or not doc.media:
        return APIResponse(message="No active CV found", data=None)
    return APIResponse(
        message="Active CV retrieved",
        data={
            "id": doc.id,
            "title": doc.title,
            "url": doc.media.url,
            "file_size": doc.media.file_size,
            "updated_at": doc.updated_at.isoformat(),
        },
    )


@router.post("/documents/upload-cv", response_model=APIResponse[dict], status_code=status.HTTP_201_CREATED)
async def upload_primary_cv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """
    Upload a new resume/CV PDF, store in media library, and mark as primary active document.
    """
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise BadRequestException("Only PDF documents are allowed for resumes.")

    # 1. Upload via Media Service
    media = await admin_media_service.upload_file(db, file, admin.id, alt_text="Primary Resume Document")

    # 2. Set previous primary CVs to False
    existing_cvs = db.execute(select(Document).where(Document.type == "cv")).scalars().all()
    for cv in existing_cvs:
        cv.is_primary = False

    # 3. Create or register new primary Document
    new_doc = Document(
        title=file.filename,
        type="cv",
        media_id=media.id,
        description="Official professional curriculum vitae",
        is_primary=True,
        is_visible=True,
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    return APIResponse(
        message="Resume PDF uploaded and activated successfully!",
        data={
            "id": new_doc.id,
            "title": new_doc.title,
            "url": media.url,
            "file_size": media.file_size,
        },
    )