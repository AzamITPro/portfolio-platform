from typing import List
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.resume import Certificate, Education, Experience, Service
from app.core.exceptions import NotFoundException, ConflictException
from app.schemas.admin_resume import (
    CertificateCreate, CertificateUpdate,
    EducationCreate, EducationUpdate,
    ExperienceCreate, ExperienceUpdate,
    ServiceCreate, ServiceUpdate,
)


class AdminResumeService:
    # --- Certificates ---
    @staticmethod
    def list_certificates(db: Session) -> List[Certificate]:
        return list(db.execute(select(Certificate).order_by(Certificate.display_order.asc(), Certificate.id.desc())).scalars().all())

    @staticmethod
    def create_certificate(db: Session, data: CertificateCreate) -> Certificate:
        cert = Certificate(**data.model_dump())
        db.add(cert)
        db.commit()
        db.refresh(cert)
        return cert

    @staticmethod
    def update_certificate(db: Session, cert_id: int, data: CertificateUpdate) -> Certificate:
        cert = db.get(Certificate, cert_id)
        if not cert:
            raise NotFoundException(f"Certificate with ID {cert_id} not found.")
        for k, v in data.model_dump(exclude_unset=True).items():
            setattr(cert, k, v)
        db.commit()
        db.refresh(cert)
        return cert

    @staticmethod
    def delete_certificate(db: Session, cert_id: int) -> None:
        cert = db.get(Certificate, cert_id)
        if not cert:
            raise NotFoundException(f"Certificate with ID {cert_id} not found.")
        db.delete(cert)
        db.commit()

    # --- Education ---
    @staticmethod
    def list_education(db: Session) -> List[Education]:
        return list(db.execute(select(Education).order_by(Education.display_order.asc(), Education.start_date.desc())).scalars().all())

    @staticmethod
    def create_education(db: Session, data: EducationCreate) -> Education:
        edu = Education(**data.model_dump())
        db.add(edu)
        db.commit()
        db.refresh(edu)
        return edu

    @staticmethod
    def update_education(db: Session, edu_id: int, data: EducationUpdate) -> Education:
        edu = db.get(Education, edu_id)
        if not edu:
            raise NotFoundException(f"Education record with ID {edu_id} not found.")
        for k, v in data.model_dump(exclude_unset=True).items():
            setattr(edu, k, v)
        db.commit()
        db.refresh(edu)
        return edu

    @staticmethod
    def delete_education(db: Session, edu_id: int) -> None:
        edu = db.get(Education, edu_id)
        if not edu:
            raise NotFoundException(f"Education record with ID {edu_id} not found.")
        db.delete(edu)
        db.commit()

    # --- Experience ---
    @staticmethod
    def list_experience(db: Session) -> List[Experience]:
        return list(db.execute(select(Experience).order_by(Experience.display_order.asc(), Experience.start_date.desc())).scalars().all())

    @staticmethod
    def create_experience(db: Session, data: ExperienceCreate) -> Experience:
        exp = Experience(**data.model_dump())
        db.add(exp)
        db.commit()
        db.refresh(exp)
        return exp

    @staticmethod
    def update_experience(db: Session, exp_id: int, data: ExperienceUpdate) -> Experience:
        exp = db.get(Experience, exp_id)
        if not exp:
            raise NotFoundException(f"Experience record with ID {exp_id} not found.")
        for k, v in data.model_dump(exclude_unset=True).items():
            setattr(exp, k, v)
        db.commit()
        db.refresh(exp)
        return exp

    @staticmethod
    def delete_experience(db: Session, exp_id: int) -> None:
        exp = db.get(Experience, exp_id)
        if not exp:
            raise NotFoundException(f"Experience record with ID {exp_id} not found.")
        db.delete(exp)
        db.commit()

    # --- Services ---
    @staticmethod
    def list_services(db: Session) -> List[Service]:
        return list(db.execute(select(Service).order_by(Service.display_order.asc(), Service.id.asc())).scalars().all())

    @staticmethod
    def create_service(db: Session, data: ServiceCreate) -> Service:
        existing = db.execute(select(Service).where(Service.slug == data.slug)).scalars().first()
        if existing:
            raise ConflictException(f"Service slug '{data.slug}' is already taken.")
        service = Service(**data.model_dump())
        db.add(service)
        db.commit()
        db.refresh(service)
        return service

    @staticmethod
    def update_service(db: Session, srv_id: int, data: ServiceUpdate) -> Service:
        service = db.get(Service, srv_id)
        if not service:
            raise NotFoundException(f"Service with ID {srv_id} not found.")
        fields = data.model_dump(exclude_unset=True)
        if "slug" in fields and fields["slug"] != service.slug:
            existing = db.execute(select(Service).where(Service.slug == fields["slug"])).scalars().first()
            if existing:
                raise ConflictException(f"Service slug '{fields['slug']}' is already taken.")
        for k, v in fields.items():
            setattr(service, k, v)
        db.commit()
        db.refresh(service)
        return service

    @staticmethod
    def delete_service(db: Session, srv_id: int) -> None:
        service = db.get(Service, srv_id)
        if not service:
            raise NotFoundException(f"Service with ID {srv_id} not found.")
        db.delete(service)
        db.commit()


admin_resume_service = AdminResumeService()