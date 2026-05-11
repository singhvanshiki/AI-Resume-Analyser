from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from shared.pagination import clamp_pagination
from shared.models.tables import JobDescription
from app.core.auth import UserContext, get_user_context
from app.schemas.job import JobDescriptionCreate, JobDescriptionList, JobDescriptionResponse
from app.api.deps import get_db_session

router = APIRouter(prefix="/job-descriptions", tags=["job_descriptions"])


@router.post("", response_model=JobDescriptionResponse, status_code=status.HTTP_201_CREATED)
async def create_job_description(
    payload: JobDescriptionCreate,
    user: UserContext = Depends(get_user_context),
    session: AsyncSession = Depends(get_db_session),
) -> JobDescriptionResponse:
    try:
        user_uuid = uuid.UUID(user.user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user id")
    job = JobDescription(
        user_id=user_uuid,
        title=payload.title,
        company=payload.company,
        location=payload.location,
        description_text=payload.description_text,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    session.add(job)
    await session.commit()
    await session.refresh(job)
    return JobDescriptionResponse(
        id=str(job.id),
        title=job.title,
        company=job.company,
        location=job.location,
        description_text=job.description_text,
        created_at=job.created_at,
    )


@router.get("", response_model=JobDescriptionList)
async def list_job_descriptions(
    page: int = 1,
    page_size: int = 20,
    user: UserContext = Depends(get_user_context),
    session: AsyncSession = Depends(get_db_session),
) -> JobDescriptionList:
    page, page_size = clamp_pagination(page, page_size)
    try:
        user_uuid = uuid.UUID(user.user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user id")
    stmt = (
        select(JobDescription)
        .where(JobDescription.user_id == user_uuid)
        .order_by(JobDescription.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    result = await session.execute(stmt)
    items = result.scalars().all()
    return JobDescriptionList(
        items=[
            JobDescriptionResponse(
                id=str(item.id),
                title=item.title,
                company=item.company,
                location=item.location,
                description_text=item.description_text,
                created_at=item.created_at,
            )
            for item in items
        ],
        page=page,
        page_size=page_size,
    )
