from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app with production-ready metadata
app = FastAPI(
    title="Azzam AL-JARMOUZI Portfolio API",
    description="Backend API powering the Personal Portfolio & Profile Management Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS (Permissive for local development, will be hardened in security phase)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
def read_root():
    return {
        "success": True,
        "message": "Welcome to Azzam AL-JARMOUZI Portfolio API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/api/v1/health", tags=["Health"])
def health_check():
    return {
        "success": True,
        "status": "healthy",
        "service": "portfolio-backend",
        "environment": "development",
    }