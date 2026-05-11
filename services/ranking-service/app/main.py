from fastapi import FastAPI

from shared.logging import configure_logging
from app.api.routes.ranking import router as ranking_router
from app.core.config import get_settings

settings = get_settings()
configure_logging(settings.log_level)

app = FastAPI(title="Ranking Service", version="1.0.0")
app.include_router(ranking_router)


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}
