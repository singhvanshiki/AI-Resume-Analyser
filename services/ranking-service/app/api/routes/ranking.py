from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db_session
from app.core.auth import UserContext, get_user_context
from app.core.config import Settings, get_settings
from app.schemas.ranking import CompareRequest, RankingResponse, RankingItem
from app.services.ranking_service import rank_candidates

router = APIRouter(prefix="/ranking", tags=["ranking"])
ALLOWED_ROLES = {"recruiter", "admin"}


@router.post("/compare", response_model=RankingResponse)
async def compare_candidates(
    payload: CompareRequest,
    user: UserContext = Depends(get_user_context),
    session: AsyncSession = Depends(get_db_session),
    settings: Settings = Depends(get_settings),
) -> RankingResponse:
    if user.role not in ALLOWED_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    try:
        user_headers = {
            "X-Internal-Token": settings.internal_token,
            "X-User-Id": user.user_id,
            "X-User-Role": user.role,
        }
        rankings = await rank_candidates(session, settings, payload.job_description_id, payload.resume_ids, user_headers)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    return RankingResponse(
        job_description_id=payload.job_description_id,
        rankings=[
            RankingItem(resume_id=str(r.resume_id), score=r.total_score, rank=r.rank, explanation=r.explanation)
            for r in rankings
        ],
    )


@router.get("/{job_id}", response_model=RankingResponse)
async def list_rankings(
    job_id: str,
    user: UserContext = Depends(get_user_context),
    session: AsyncSession = Depends(get_db_session),
) -> RankingResponse:
    if user.role not in ALLOWED_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    from sqlalchemy import select
    from shared.models.tables import CandidateRanking
    import uuid

    try:
        job_uuid = uuid.UUID(job_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid job id")

    result = await session.execute(
        select(CandidateRanking).where(CandidateRanking.job_description_id == job_uuid).order_by(CandidateRanking.rank)
    )
    rankings = result.scalars().all()
    return RankingResponse(
        job_description_id=job_id,
        rankings=[
            RankingItem(resume_id=str(r.resume_id), score=r.total_score, rank=r.rank, explanation=r.explanation)
            for r in rankings
        ],
    )
