from fastapi import APIRouter
from app.schemas.common import APIResponse
from app.api.v1.endpoints.auth import router as auth_router

api_router = APIRouter()

# Mount Authentication router
api_router.include_router(auth_router)


@api_router.get("/status", tags=["System Status"])
def api_v1_status():
    return APIResponse(
        message="Portfolio REST API v1 router is operational",
        data={
            "version": "1.0.0",
            "api_prefix": "/api/v1",
            "auth_module": "mounted and protected",
        },
    )