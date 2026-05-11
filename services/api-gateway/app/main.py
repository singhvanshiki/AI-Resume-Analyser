from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from starlette.responses import JSONResponse

from shared.logging import configure_logging
from app.core.config import get_settings
from app.core.limiter import limiter
from app.api.routes.auth import router as auth_router
from app.api.routes.resumes import router as resume_router
from app.api.routes.job_descriptions import router as job_router
from app.api.routes.analysis import router as analysis_router
from app.api.routes.ranking import router as ranking_router

settings = get_settings()
configure_logging(settings.log_level)

app = FastAPI(title="API Gateway", version="1.0.0")
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(resume_router, prefix="/api/v1")
app.include_router(job_router, prefix="/api/v1")
app.include_router(analysis_router, prefix="/api/v1")
app.include_router(ranking_router, prefix="/api/v1")


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request, exc):
    return JSONResponse(status_code=429, content={"detail": "Rate limit exceeded"})


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}
