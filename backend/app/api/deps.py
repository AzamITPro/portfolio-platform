from typing import Optional
from fastapi import Depends, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import decode_access_token
from app.core.exceptions import UnauthorizedException, ForbiddenException
from app.repositories.user import user_repo
from app.models.user import User

security_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    request: Request,
    token_bearer: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Extract token from Authorization header OR HttpOnly Cookie ('access_token').
    Validate and return the currently authenticated user.
    """
    token = None
    if token_bearer:
        token = token_bearer.credentials
    elif "access_token" in request.cookies:
        token = request.cookies.get("access_token")

    if not token:
        raise UnauthorizedException("Authentication token is missing. Please log in.")

    try:
        payload = decode_access_token(token)
        user_email: str = payload.get("sub")
        if not user_email:
            raise UnauthorizedException("Invalid token credentials.")
    except Exception:
        raise UnauthorizedException("Token has expired or is invalid.")

    user = user_repo.get_by_email(db, user_email)
    if not user:
        raise UnauthorizedException("User associated with this token no longer exists.")
    if not user.is_active:
        raise ForbiddenException("User account is inactive or disabled.")

    return user


def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    """Ensure the authenticated user has administrative privileges."""
    if current_user.role != "admin":
        raise ForbiddenException("Administrative access required.")
    return current_user