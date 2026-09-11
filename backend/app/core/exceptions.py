from typing import Any, Optional


class AppException(Exception):
    """Base exception for all application-specific errors."""
    def __init__(self, message: str, status_code: int = 400, code: str = "BAD_REQUEST", details: Optional[Any] = None):
        self.message = message
        self.status_code = status_code
        self.code = code
        self.details = details
        super().__init__(self.message)


class BadRequestException(AppException):
    def __init__(self, message: str = "Bad request payload or file", details: Optional[Any] = None):
        super().__init__(message=message, status_code=400, code="BAD_REQUEST", details=details)


class NotFoundException(AppException):
    def __init__(self, message: str = "Resource not found", details: Optional[Any] = None):
        super().__init__(message=message, status_code=404, code="NOT_FOUND", details=details)


class UnauthorizedException(AppException):
    def __init__(self, message: str = "Authentication required", details: Optional[Any] = None):
        super().__init__(message=message, status_code=401, code="UNAUTHORIZED", details=details)


class ForbiddenException(AppException):
    def __init__(self, message: str = "Permission denied", details: Optional[Any] = None):
        super().__init__(message=message, status_code=403, code="FORBIDDEN", details=details)


class ConflictException(AppException):
    def __init__(self, message: str = "Resource already exists", details: Optional[Any] = None):
        super().__init__(message=message, status_code=409, code="CONFLICT", details=details)