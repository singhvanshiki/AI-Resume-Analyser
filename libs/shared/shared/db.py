from __future__ import annotations

from functools import lru_cache
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine


@lru_cache(maxsize=4)
def get_engine(database_url: str):
    return create_async_engine(database_url, pool_pre_ping=True)


def get_sessionmaker(database_url: str) -> async_sessionmaker[AsyncSession]:
    engine = get_engine(database_url)
    return async_sessionmaker(engine, expire_on_commit=False)


async def get_session(database_url: str) -> AsyncGenerator[AsyncSession, None]:
    session_factory = get_sessionmaker(database_url)
    async with session_factory() as session:
        yield session
