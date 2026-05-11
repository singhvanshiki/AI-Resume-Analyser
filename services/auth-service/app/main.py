from fastapi import FastAPI
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from shared.logging import configure_logging
from shared.models.enums import RoleName
from shared.models.tables import Role
from shared.db import get_session
from app.api.routes.auth import router as auth_router
from app.core.config import get_settings

settings = get_settings()
configure_logging(settings.log_level)

app = FastAPI(title="Auth Service", version="1.0.0")
app.include_router(auth_router)


@app.on_event("startup")
async def seed_roles() -> None:
    async for session in get_session(settings.database_url):
        result = await session.execute(select(Role))
        if result.first() is None:
            session.add_all(
                [
                    Role(name=RoleName.student, description="Student"),
                    Role(name=RoleName.recruiter, description="Recruiter"),
                    Role(name=RoleName.admin, description="Admin"),
                ]
            )
            await session.commit()
        break


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}
