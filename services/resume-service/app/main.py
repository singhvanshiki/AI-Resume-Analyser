from fastapi import FastAPI

from shared.logging import configure_logging
from app.api.routes.resumes import router as resume_router
from app.api.routes.job_descriptions import router as jd_router
from app.core.config import get_settings

settings = get_settings()
configure_logging(settings.log_level)

app = FastAPI(title="Resume Service", version="1.0.0")
app.include_router(resume_router)
app.include_router(jd_router)


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}
