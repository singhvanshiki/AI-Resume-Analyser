import os
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from shared.models.base import Base
from app.main import app
from app.api.deps import get_db_session


@pytest.fixture(scope="session")
def event_loop():
    import asyncio

    loop = asyncio.get_event_loop()
    yield loop


@pytest.fixture(scope="session", autouse=True)
def set_test_env():
    os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///:memory:"
    os.environ["JWT_SECRET"] = "test-secret"
    os.environ["INTERNAL_TOKEN"] = "internal-test"
    os.environ["OPENROUTER_API_KEY"] = ""


@pytest.fixture(scope="session")
async def engine():
    engine = create_async_engine(os.environ["DATABASE_URL"])
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest.fixture(scope="function")
async def db_session(engine):
    sessionmaker = async_sessionmaker(engine, expire_on_commit=False)
    async with sessionmaker() as session:
        yield session


@pytest.fixture(scope="function")
async def client(db_session):
    async def _get_db_override():
        yield db_session

    app.dependency_overrides[get_db_session] = _get_db_override
    headers = {
        "X-Internal-Token": "internal-test",
        "X-User-Id": "00000000-0000-0000-0000-000000000001",
        "X-User-Role": "student",
    }
    async with AsyncClient(app=app, base_url="http://test", headers=headers) as client:
        yield client
    app.dependency_overrides.clear()
