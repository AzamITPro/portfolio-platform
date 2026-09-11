from typing import Generic, TypeVar, Optional, Any
from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """Standardized success response envelope for all endpoints."""
    success: bool = True
    message: str = "Operation completed successfully"
    data: Optional[T] = None

    model_config = ConfigDict(from_attributes=True)


class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Any] = None


class APIErrorResponse(BaseModel):
    """Standardized error response envelope for all exceptions."""
    success: bool = False
    error: ErrorDetail


class PaginationMetadata(BaseModel):
    total: int
    page: int
    limit: int
    pages: int


class PaginatedResponse(BaseModel, Generic[T]):
    """Standardized response for paginated datasets."""
    success: bool = True
    message: str = "Data retrieved successfully"
    data: list[T]
    pagination: PaginationMetadata