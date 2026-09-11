from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.core.limiter import limiter
from app.core.exceptions import AppException
from app.schemas.common import APIResponse, APIErrorResponse, ErrorDetail
from app.api.v1.router import api_router

# Initialize structured logging
setup_logging()
logger.info("Initializing Azzam AL-JARMOUZI Portfolio API Backend...")

# Initialize FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API powering the Personal Portfolio & Profile Management Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Connect Rate Limiter state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==============================================================================
# Centralized Exception Handlers (Standardized Error Envelopes)
# ==============================================================================

@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    logger.warning(f"AppException: {exc.code} - {exc.message} on {request.url.path}")
    return JSONResponse(
        status_code=exc.status_code,
        content=APIErrorResponse(
            success=False,
            error=ErrorDetail(code=exc.code, message=exc.message, details=exc.details),
        ).model_dump(),
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    code = "NOT_FOUND" if exc.status_code == 404 else "HTTP_ERROR"
    return JSONResponse(
        status_code=exc.status_code,
        content=APIErrorResponse(
            success=False,
            error=ErrorDetail(code=code, message=str(exc.detail)),
        ).model_dump(),
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=APIErrorResponse(
            success=False,
            error=ErrorDetail(
                code="VALIDATION_ERROR",
                message="Invalid request payload or query parameters",
                details=exc.errors(),
            ),
        ).model_dump(),
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=APIErrorResponse(
            success=False,
            error=ErrorDetail(
                code="INTERNAL_SERVER_ERROR",
                message="An unexpected internal server error occurred",
            ),
        ).model_dump(),
    )


# ==============================================================================
# Mount API Routers
# ==============================================================================

app.include_router(api_router, prefix=settings.API_V1_STR)


# ==============================================================================
# Root & Health Endpoints
# ==============================================================================

@app.get("/", tags=["Root"])
def read_root():
    return APIResponse(
        message=f"Welcome to {settings.PROJECT_NAME}",
        data={"version": "1.0.0", "docs": "/docs"},
    )


@app.get("/api/v1/health", tags=["Health"])
def health_check():
    return APIResponse(
        message="Service is healthy and fully operational",
        data={
            "status": "healthy",
            "service": "portfolio-backend",
            "environment": settings.ENVIRONMENT,
        },
    )