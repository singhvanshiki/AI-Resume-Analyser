from fastapi import FastAPI

from shared.logging import configure_logging
from app.api.routes.analysis import router as analysis_router
from app.core.config import get_settings

settings = get_settings()
configure_logging(settings.log_level)

app = FastAPI(title="Analysis Service", version="1.0.0")
app.include_router(analysis_router)


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}
