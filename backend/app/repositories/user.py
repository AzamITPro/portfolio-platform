from typing import Optional
from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.user import User, Profile
from app.core.security import get_password_hash, verify_password


class UserRepository(BaseRepository[User]):
    def __init__(self):
        super().__init__(User)

    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        """Retrieve a user by their unique email address."""
        query = select(User).where(User.email == email.strip().lower())
        return db.execute(query).scalars().first()

    def create_admin(
        self, db: Session, email: str, password: str, full_name: str
    ) -> User:
        """Create a new administrative user with a linked default profile."""
        hashed_pw = get_password_hash(password)
        db_user = User(
            email=email.strip().lower(),
            password_hash=hashed_pw,
            full_name=full_name.strip(),
            role="admin",
            is_active=True,
        )
        db.add(db_user)
        db.flush()  # Obtain db_user.id before committing

        # Initialize an associated empty profile ready for dashboard customization
        db_profile = Profile(
            user_id=db_user.id,
            full_name=full_name.strip(),
            professional_title="IT Student & Software Developer",
            short_bio="Passionate developer crafting robust and scalable web applications.",
            about_me="Full-Stack Developer focused on modern technologies and clean architecture.",
            location="Yemen",
            email=email.strip().lower(),
            availability="Available for Opportunities",
        )
        db.add(db_profile)
        db.commit()
        db.refresh(db_user)
        return db_user

    def authenticate(
        self, db: Session, email: str, password: str
    ) -> Optional[User]:
        """Validate credentials; returns the User if valid, None otherwise."""
        user = self.get_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.password_hash):
            return None
        return user

    def update_last_login(self, db: Session, user_id: int) -> None:
        """Update last login timestamp."""
        user = self.get_by_id(db, user_id)
        if user:
            user.last_login_at = datetime.now(timezone.utc)
            db.commit()


user_repo = UserRepository()