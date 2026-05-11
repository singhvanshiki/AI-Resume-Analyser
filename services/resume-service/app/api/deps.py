from typing import AsyncGenerator

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from shared.db import get_session
from app.core.config import Settings, get_settings


async def get_db_session(settings: Settings = Depends(get_settings)) -> AsyncGenerator[AsyncSession, None]:
    async for session in get_session(settings.database_url):
        yield session
