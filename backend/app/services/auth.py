from fastapi import Response
from sqlalchemy.orm import Session
from app.core.security import create_access_token
from app.core.exceptions import UnauthorizedException
from app.repositories.user import user_repo
from app.schemas.auth import LoginRequest, TokenResponse, UserOut


class AuthService:
    @staticmethod
    def login(db: Session, credentials: LoginRequest, response: Response) -> TokenResponse:
        user = user_repo.authenticate(db, credentials.email, credentials.password)
        if not user:
            raise UnauthorizedException("Invalid email or password.")
        if not user.is_active:
            raise UnauthorizedException("Your account is currently disabled.")

        user_repo.update_last_login(db, user.id)

        token_data = {"sub": user.email, "role": user.role, "user_id": user.id}
        access_token = create_access_token(token_data)

        # Set secure HttpOnly cookie for web browsers (XSS protection)
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,  # Set to True when HTTPS is enabled in production
            samesite="lax",
            max_age=60 * 60 * 24,  # 24 hours
        )

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserOut.model_validate(user),
        )

    @staticmethod
    def logout(response: Response) -> None:
        """Clear the HttpOnly access token cookie."""
        response.delete_cookie(key="access_token", path="/")


auth_service = AuthService()