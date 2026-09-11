from fastapi import APIRouter
from app.schemas.common import APIResponse

api_router = APIRouter()


@api_router.get("/status", tags=["System Status"])
def api_v1_status():
    return APIResponse(
        message="Portfolio REST API v1 router is operational",
        data={
            "version": "1.0.0",
            "api_prefix": "/api/v1",
            "endpoints": "ready for module mounting",
        },
    )