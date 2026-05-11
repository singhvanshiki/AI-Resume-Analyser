from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from shared.models.enums import ContentType
from app.ai.openrouter import OpenRouterProvider
from app.ai.prompt_manager import PromptManager
from app.api.deps import get_db_session
from app.core.auth import UserContext, get_user_context
from app.core.config import get_settings
from app.schemas.analysis import (
    ATSRequest,
    ATSResponse,
    ContentRequest,
    ContentResponse,
    MatchRequest,
    MatchResponse,
    SkillResponse,
)
from app.services.analysis_service import (
    extract_resume_skills,
    generate_content,
    get_job_description,
    get_resume,
    match_skills,
    run_ats_analysis,
)

router = APIRouter(prefix="/analysis", tags=["analysis"])
PROMPT_PATH = Path(__file__).resolve().parents[2] / "prompts"


async def _resolve_job_context(
    session: AsyncSession,
    job_description_id: str | None,
    job_description_text: str | None,
) -> tuple[str, str | None]:
    job_text = job_description_text or ""
    job_id: str | None = None
    if job_description_id:
        job = await get_job_description(session, job_description_id)
        job_id = str(job.id)
        if not job_text:
            job_text = job.description_text
    return job_text, job_id


@router.post("/ats", response_model=ATSResponse)
async def ats_analysis(
    payload: ATSRequest,
    user: UserContext = Depends(get_user_context),
    session: AsyncSession = Depends(get_db_session),
):
    provider = OpenRouterProvider(get_settings())
    prompt_manager = PromptManager(str(PROMPT_PATH))
    try:
        resume = await get_resume(session, payload.resume_id)
        job_text, job_id = await _resolve_job_context(
            session, payload.job_description_id, payload.job_description_text
        )
    except ValueError as exc:
        status_code = status.HTTP_400_BAD_REQUEST if "Invalid" in str(exc) else status.HTTP_404_NOT_FOUND
        raise HTTPException(status_code=status_code, detail=str(exc))
    if not job_text:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Job description is required")

    analysis = await run_ats_analysis(session, provider, prompt_manager, resume, job_text, job_id)
    return ATSResponse(
        analysis_id=str(analysis.id),
        ats_score=analysis.ats_score,
        category_scores=analysis.category_scores,
        explanation=analysis.explanation,
        missing_skills=analysis.missing_skills,
        recommendations=analysis.recommendations,
        semantic_similarity=analysis.semantic_similarity,
    )


@router.post("/match", response_model=MatchResponse)
async def match_analysis(
    payload: MatchRequest,
    user: UserContext = Depends(get_user_context),
    session: AsyncSession = Depends(get_db_session),
):
    provider = OpenRouterProvider(get_settings())
    prompt_manager = PromptManager(str(PROMPT_PATH))
    try:
        resume = await get_resume(session, payload.resume_id)
        job_text, job_id = await _resolve_job_context(
            session, payload.job_description_id, payload.job_description_text
        )
    except ValueError as exc:
        status_code = status.HTTP_400_BAD_REQUEST if "Invalid" in str(exc) else status.HTTP_404_NOT_FOUND
        raise HTTPException(status_code=status_code, detail=str(exc))
    if not job_text:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Job description is required")

    analysis = await run_ats_analysis(session, provider, prompt_manager, resume, job_text, job_id)
    matches = await match_skills(session, resume, job_text, job_id)
    missing = [m["skill"] for m in matches if m["match_type"] == "missing"]
    strengths: list[str] = []
    gaps: list[str] = []
    overall_fit: str | None = None
    try:
        prompt = prompt_manager.render(
            "jd_matching.j2",
            resume_text=resume.text,
            job_description=job_text,
        )
        jd_summary = await provider.generate_json(prompt)
        if isinstance(jd_summary, dict):
            raw_strengths = jd_summary.get("strengths", [])
            raw_gaps = jd_summary.get("gaps", [])
            strengths = raw_strengths if isinstance(raw_strengths, list) else []
            gaps = raw_gaps if isinstance(raw_gaps, list) else []
            overall_fit = jd_summary.get("overall_fit")
    except Exception:
        pass
    return MatchResponse(
        semantic_similarity=analysis.semantic_similarity,
        skill_matches=matches,
        missing_skills=missing,
        strengths=strengths,
        gaps=gaps,
        overall_fit=overall_fit,
    )


@router.post("/rewrite", response_model=ContentResponse)
async def rewrite_resume(
    payload: ContentRequest,
    user: UserContext = Depends(get_user_context),
    session: AsyncSession = Depends(get_db_session),
):
    provider = OpenRouterProvider(get_settings())
    prompt_manager = PromptManager(str(PROMPT_PATH))
    try:
        resume = await get_resume(session, payload.resume_id)
    except ValueError as exc:
        status_code = status.HTTP_400_BAD_REQUEST if "Invalid" in str(exc) else status.HTTP_404_NOT_FOUND
        raise HTTPException(status_code=status_code, detail=str(exc))
    job_text, job_id = await _resolve_job_context(
        session, payload.job_description_id, payload.job_description_text
    )
    record = await generate_content(
        session,
        provider,
        prompt_manager,
        resume,
        job_text,
        job_id,
        ContentType.rewrite,
        "resume_rewrite.j2",
    )
    return ContentResponse(content_id=str(record.id), content=record.content_text)


@router.post("/questions", response_model=ContentResponse)
async def interview_questions(
    payload: ContentRequest,
    user: UserContext = Depends(get_user_context),
    session: AsyncSession = Depends(get_db_session),
):
    provider = OpenRouterProvider(get_settings())
    prompt_manager = PromptManager(str(PROMPT_PATH))
    try:
        resume = await get_resume(session, payload.resume_id)
    except ValueError as exc:
        status_code = status.HTTP_400_BAD_REQUEST if "Invalid" in str(exc) else status.HTTP_404_NOT_FOUND
        raise HTTPException(status_code=status_code, detail=str(exc))
    job_text, job_id = await _resolve_job_context(
        session, payload.job_description_id, payload.job_description_text
    )
    record = await generate_content(
        session,
        provider,
        prompt_manager,
        resume,
        job_text,
        job_id,
        ContentType.interview_questions,
        "interview_questions.j2",
    )
    return ContentResponse(content_id=str(record.id), content=record.content_text)


@router.post("/cover-letter", response_model=ContentResponse)
async def cover_letter(
    payload: ContentRequest,
    user: UserContext = Depends(get_user_context),
    session: AsyncSession = Depends(get_db_session),
):
    provider = OpenRouterProvider(get_settings())
    prompt_manager = PromptManager(str(PROMPT_PATH))
    try:
        resume = await get_resume(session, payload.resume_id)
    except ValueError as exc:
        status_code = status.HTTP_400_BAD_REQUEST if "Invalid" in str(exc) else status.HTTP_404_NOT_FOUND
        raise HTTPException(status_code=status_code, detail=str(exc))
    job_text, job_id = await _resolve_job_context(
        session, payload.job_description_id, payload.job_description_text
    )
    record = await generate_content(
        session,
        provider,
        prompt_manager,
        resume,
        job_text,
        job_id,
        ContentType.cover_letter,
        "cover_letter.j2",
    )
    return ContentResponse(content_id=str(record.id), content=record.content_text)


@router.post("/summary", response_model=ContentResponse)
async def summary(
    payload: ContentRequest,
    user: UserContext = Depends(get_user_context),
    session: AsyncSession = Depends(get_db_session),
):
    provider = OpenRouterProvider(get_settings())
    prompt_manager = PromptManager(str(PROMPT_PATH))
    try:
        resume = await get_resume(session, payload.resume_id)
    except ValueError as exc:
        status_code = status.HTTP_400_BAD_REQUEST if "Invalid" in str(exc) else status.HTTP_404_NOT_FOUND
        raise HTTPException(status_code=status_code, detail=str(exc))
    job_text, job_id = await _resolve_job_context(
        session, payload.job_description_id, payload.job_description_text
    )
    record = await generate_content(
        session,
        provider,
        prompt_manager,
        resume,
        job_text,
        job_id,
        ContentType.recruiter_summary,
        "recruiter_summary.j2",
    )
    return ContentResponse(content_id=str(record.id), content=record.content_text)


@router.post("/skills", response_model=SkillResponse)
async def skills(
    payload: ContentRequest,
    user: UserContext = Depends(get_user_context),
    session: AsyncSession = Depends(get_db_session),
):
    provider = OpenRouterProvider(get_settings())
    prompt_manager = PromptManager(str(PROMPT_PATH))
    try:
        resume = await get_resume(session, payload.resume_id)
    except ValueError as exc:
        status_code = status.HTTP_400_BAD_REQUEST if "Invalid" in str(exc) else status.HTTP_404_NOT_FOUND
        raise HTTPException(status_code=status_code, detail=str(exc))
    records = await extract_resume_skills(session, resume, provider, prompt_manager)
    return SkillResponse(skills=[record.skill for record in records])
