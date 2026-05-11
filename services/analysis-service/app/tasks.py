import asyncio
from pathlib import Path
from celery import Celery

from sqlalchemy.ext.asyncio import async_sessionmaker

from shared.db import get_engine
from app.ai.openrouter import OpenRouterProvider
from app.ai.prompt_manager import PromptManager
from app.core.config import get_settings
from app.services.analysis_service import get_resume, run_ats_analysis

settings = get_settings()
celery_app = Celery("analysis", broker=settings.redis_url)


@celery_app.task
def ping() -> str:
    return "pong"


@celery_app.task
def ats_task(resume_id: str, job_text: str, job_description_id: str | None = None) -> str:
    async def _run() -> str:
        engine = get_engine(settings.database_url)
        session_factory = async_sessionmaker(engine, expire_on_commit=False)
        prompt_path = Path(__file__).resolve().parent / "prompts"
        async with session_factory() as session:
            resume = await get_resume(session, resume_id)
            provider = OpenRouterProvider(settings)
            prompt_manager = PromptManager(str(prompt_path))
            analysis = await run_ats_analysis(session, provider, prompt_manager, resume, job_text, job_description_id)
            return str(analysis.id)

    return asyncio.run(_run())
