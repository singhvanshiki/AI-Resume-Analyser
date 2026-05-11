import asyncio
import os
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine


async def main() -> None:
    database_url = os.environ["DATABASE_URL"]
    engine = create_async_engine(database_url, pool_pre_ping=True)
    for _ in range(30):
        try:
            async with engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
                await engine.dispose()
                return
        except Exception:
            await asyncio.sleep(1)
    raise SystemExit("Database not ready")


if __name__ == "__main__":
    asyncio.run(main())
