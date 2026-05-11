from __future__ import annotations

from datetime import datetime, timezone
import uuid

import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from shared.models.tables import CandidateRanking, JobDescription, Resume, ResumeAnalysis
from app.core.config import Settings


async def ensure_analysis(
    session: AsyncSession,
    settings: Settings,
    resume_id: uuid.UUID,
    job_description_id: uuid.UUID,
    user_headers: dict[str, str],
) -> ResumeAnalysis:
    stmt = (
        select(ResumeAnalysis)
        .where(ResumeAnalysis.resume_id == resume_id, ResumeAnalysis.job_description_id == job_description_id)
        .order_by(ResumeAnalysis.created_at.desc())
    )
    result = await session.execute(stmt)
    analysis = result.scalars().first()
    if analysis:
        return analysis

    payload = {"resume_id": str(resume_id), "job_description_id": str(job_description_id)}
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(f"{settings.analysis_service_url}/analysis/ats", json=payload, headers=user_headers)
        response.raise_for_status()
        data = response.json()
    analysis_id = uuid.UUID(data["analysis_id"])
    result = await session.execute(select(ResumeAnalysis).where(ResumeAnalysis.id == analysis_id))
    return result.scalar_one()


async def rank_candidates(
    session: AsyncSession,
    settings: Settings,
    job_description_id: str,
    resume_ids: list[str],
    user_headers: dict[str, str],
) -> list[CandidateRanking]:
    if not resume_ids:
        raise ValueError("resume_ids required")
    try:
        job_uuid = uuid.UUID(job_description_id)
    except ValueError:
        raise ValueError("Invalid job description id")
    result = await session.execute(select(JobDescription).where(JobDescription.id == job_uuid))
    job = result.scalar_one_or_none()
    if job is None:
        raise ValueError("Job description not found")

    rankings = []
    for resume_id in resume_ids:
        try:
            resume_uuid = uuid.UUID(resume_id)
        except ValueError:
            raise ValueError("Invalid resume id")
        analysis = await ensure_analysis(session, settings, resume_uuid, job_uuid, user_headers)
        score = analysis.ats_score * 0.7 + analysis.semantic_similarity * 100 * 0.3
        rankings.append(
            CandidateRanking(
                job_description_id=job_uuid,
                resume_id=resume_uuid,
                total_score=round(score, 2),
                breakdown={"ats": analysis.ats_score, "semantic": analysis.semantic_similarity},
                rank=0,
                explanation="Combined ATS and semantic similarity scoring.",
                created_at=datetime.now(timezone.utc),
            )
        )

    rankings.sort(key=lambda r: r.total_score, reverse=True)
    for idx, ranking in enumerate(rankings, start=1):
        ranking.rank = idx
        session.add(ranking)
    await session.commit()
    return rankings
