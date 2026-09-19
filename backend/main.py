"""
FastAPI Main Entrypoint
Legal Metrology Compliance Engine Real Production Architecture
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import settings
from backend.api.routes.pipeline import router as pipeline_router

app = FastAPI(
    title=settings.APP_NAME,
    description="Production-Ready AI Engine for Legal Metrology Packaged Commodities Rule Verification in India",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API V1 Routes
app.include_router(pipeline_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "status": "ONLINE",
        "active_rule_version": settings.ACTIVE_RULE_VERSION,
        "supported_versions": settings.SUPPORTED_RULE_VERSIONS,
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
