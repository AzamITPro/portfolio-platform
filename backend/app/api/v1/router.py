from fastapi import APIRouter
from app.schemas.common import APIResponse
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.public import router as public_router
from app.api.v1.endpoints.admin_profile import router as admin_profile_router
from app.api.v1.endpoints.admin_skills import router as admin_skills_router
from app.api.v1.endpoints.admin_projects import router as admin_projects_router
from app.api.v1.endpoints.admin_resume import router as admin_resume_router
from app.api.v1.endpoints.admin_communication import router as admin_comm_router
from app.api.v1.endpoints.admin_media import router as admin_media_router

api_router = APIRouter()

# Mount Authentication router
api_router.include_router(auth_router)

# Mount Public Portfolio router
api_router.include_router(public_router)

# Mount Admin Routers
api_router.include_router(admin_profile_router)
api_router.include_router(admin_skills_router)
api_router.include_router(admin_projects_router)
api_router.include_router(admin_resume_router)
api_router.include_router(admin_comm_router)
api_router.include_router(admin_media_router)


@api_router.get("/status", tags=["System Status"])
def api_v1_status():
    return APIResponse(
        message="Portfolio REST API v1 router is operational",
        data={
            "version": "1.0.0",
            "api_prefix": "/api/v1",
            "modules": [
                "auth",
                "public",
                "admin_profile",
                "admin_skills",
                "admin_projects",
                "admin_resume",
                "admin_communication",
                "admin_media",
            ],
        },
    )