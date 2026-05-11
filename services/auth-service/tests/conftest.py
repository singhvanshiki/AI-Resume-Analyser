import os
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from shared.models.base import Base
from shared.models.tables import Role
from shared.models.enums import RoleName
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
    os.environ["JWT_ALGORITHM"] = "HS256"


@pytest.fixture(scope="session")
async def engine():
    engine = create_async_engine(os.environ["DATABASE_URL"])
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await conn.execute(
            Role.__table__.insert(),
            [
                {"id": "00000000-0000-0000-0000-000000000010", "name": RoleName.student, "description": "Student"},
                {"id": "00000000-0000-0000-0000-000000000011", "name": RoleName.recruiter, "description": "Recruiter"},
                {"id": "00000000-0000-0000-0000-000000000012", "name": RoleName.admin, "description": "Admin"},
            ],
        )
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
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client
    app.dependency_overrides.clear()
