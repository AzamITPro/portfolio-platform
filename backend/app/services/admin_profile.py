from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.user import Profile, SocialLink
from app.core.exceptions import NotFoundException
from app.schemas.admin_profile import ProfileUpdate, SocialLinkCreate, SocialLinkUpdate


class AdminProfileService:
    @staticmethod
    def get_profile(db: Session, user_id: int) -> Profile:
        query = select(Profile).where(Profile.user_id == user_id)
        profile = db.execute(query).scalars().first()
        if not profile:
            raise NotFoundException("Profile not found for this user.")
        return profile

    @staticmethod
    def update_profile(db: Session, user_id: int, update_data: ProfileUpdate) -> Profile:
        profile = AdminProfileService.get_profile(db, user_id)
        
        # Apply only explicitly provided fields
        fields = update_data.model_dump(exclude_unset=True)
        for key, value in fields.items():
            setattr(profile, key, value)
            
        db.commit()
        db.refresh(profile)
        return profile

    @staticmethod
    def list_social_links(db: Session, profile_id: int) -> List[SocialLink]:
        query = (
            select(SocialLink)
            .where(SocialLink.profile_id == profile_id)
            .order_by(SocialLink.display_order.asc(), SocialLink.id.asc())
        )
        return list(db.execute(query).scalars().all())

    @staticmethod
    def create_social_link(db: Session, profile_id: int, link_in: SocialLinkCreate) -> SocialLink:
        new_link = SocialLink(
            profile_id=profile_id,
            platform=link_in.platform.strip(),
            url=link_in.url.strip(),
            username=link_in.username.strip(),
            icon=link_in.icon.strip() if link_in.icon else None,
            display_order=link_in.display_order,
            is_visible=link_in.is_visible,
        )
        db.add(new_link)
        db.commit()
        db.refresh(new_link)
        return new_link

    @staticmethod
    def update_social_link(db: Session, profile_id: int, link_id: int, link_in: SocialLinkUpdate) -> SocialLink:
        query = select(SocialLink).where(SocialLink.id == link_id, SocialLink.profile_id == profile_id)
        link = db.execute(query).scalars().first()
        if not link:
            raise NotFoundException(f"Social link with ID {link_id} not found.")

        fields = link_in.model_dump(exclude_unset=True)
        for key, value in fields.items():
            setattr(link, key, value)

        db.commit()
        db.refresh(link)
        return link

    @staticmethod
    def delete_social_link(db: Session, profile_id: int, link_id: int) -> None:
        query = select(SocialLink).where(SocialLink.id == link_id, SocialLink.profile_id == profile_id)
        link = db.execute(query).scalars().first()
        if not link:
            raise NotFoundException(f"Social link with ID {link_id} not found.")
        db.delete(link)
        db.commit()


admin_profile_service = AdminProfileService()