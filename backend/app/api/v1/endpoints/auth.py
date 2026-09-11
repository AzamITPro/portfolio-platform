from fastapi import APIRouter, Depends, Response, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.limiter import limiter
from app.schemas.common import APIResponse
from app.schemas.auth import LoginRequest, TokenResponse, UserOut
from app.services.auth import auth_service
from app.api.deps import get_current_admin
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=APIResponse[TokenResponse])
@limiter.limit("5/minute")
def login(request: Request, response: Response, credentials: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate an administrator and issue a JWT token + HttpOnly cookie.
    Rate limited to 5 requests per minute per IP to prevent brute-force attacks.
    """
    token_resp = auth_service.login(db, credentials, response)
    return APIResponse(message="Login successful", data=token_resp)


@router.post("/logout", response_model=APIResponse[None])
def logout(response: Response):
    """Log out the user and clear session cookies."""
    auth_service.logout(response)
    return APIResponse(message="Logged out successfully", data=None)


@router.get("/me", response_model=APIResponse[UserOut])
def get_current_user_profile(current_admin: User = Depends(get_current_admin)):
    """
    Protected endpoint: Returns the profile of the currently authenticated administrator.
    Requires a valid JWT Bearer token or HttpOnly cookie.
    """
    return APIResponse(
        message="Authenticated user retrieved successfully",
        data=UserOut.model_validate(current_admin),
    )