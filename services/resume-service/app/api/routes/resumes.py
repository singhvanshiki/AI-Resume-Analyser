from __future__ import annotations

from datetime import datetime, timezone
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from shared.pagination import clamp_pagination
from shared.models.enums import SectionType
from shared.models.tables import Resume, ResumeSection
from app.core.auth import UserContext, get_user_context
from app.core.config import Settings, get_settings
from app.services.parser import parse_resume
from app.services.storage import get_storage
from app.schemas.resume import ResumeDetail, ResumeList, ResumeResponse
from app.api.deps import get_db_session

router = APIRouter(prefix="/resumes", tags=["resumes"])


@router.post("/upload", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    user: UserContext = Depends(get_user_context),
    session: AsyncSession = Depends(get_db_session),
    settings: Settings = Depends(get_settings),
) -> ResumeResponse:
    content = await file.read()
    if not content:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Empty file")
    content_type = file.content_type or "text/plain"
    allowed = {
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "text/plain",
    }
    if content_type not in allowed:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file type")
    text, sections = parse_resume(content, content_type)
    storage = get_storage(settings)
    stored = storage.upload_bytes(content, file.filename or "resume", content_type)

    try:
        user_uuid = uuid.UUID(user.user_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user id")
    resume = Resume(
        user_id=user_uuid,
        original_filename=file.filename or "resume",
        content_type=file.content_type or "text/plain",
        storage_path=stored.key,
        text=text,
        parsed_sections=sections,
        status="parsed",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    session.add(resume)
    await session.flush()

    for index, (section_type, content_text) in enumerate(sections.items()):
        try:
            enum_section = SectionType(section_type)
        except ValueError:
            enum_section = SectionType.other
        session.add(
            ResumeSection(
                resume_id=resume.id,
                section_type=enum_section,
                content=content_text,
                position=index,
                created_at=datetime.now(timezone.utc),
            )
        )

    await session.commit()
    await session.refresh(resume)
    return ResumeResponse(
        id=str(resume.id),
        original_filename=resume.original_filename,
        content_type=resume.content_type,
        storage_path=resume.storage_path,
        created_at=resume.created_at,
    )


@router.get("", response_model=ResumeList)
async def list_resumes(
    page: int = 1,
    page_size: int = 20,
    user: UserContext = Depends(get_user_context),
    session: AsyncSession = Depends(get_db_session),
) -> ResumeList:
    page, page_size = clamp_pagination(page, page_size)
    try:
        user_uuid = uuid.UUID(user.user_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user id")
    stmt = (
        select(Resume)
        .where(Resume.user_id == user_uuid)
        .order_by(Resume.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    result = await session.execute(stmt)
    items = result.scalars().all()
    return ResumeList(
        items=[
            ResumeResponse(
                id=str(item.id),
                original_filename=item.original_filename,
                content_type=item.content_type,
                storage_path=item.storage_path,
                created_at=item.created_at,
            )
            for item in items
        ],
        page=page,
        page_size=page_size,
    )


@router.get("/{resume_id}", response_model=ResumeDetail)
async def get_resume(
    resume_id: str,
    user: UserContext = Depends(get_user_context),
    session: AsyncSession = Depends(get_db_session),
) -> ResumeDetail:
    try:
        resume_uuid = uuid.UUID(resume_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid resume id")
    try:
        user_uuid = uuid.UUID(user.user_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user id")
    result = await session.execute(select(Resume).where(Resume.id == resume_uuid, Resume.user_id == user_uuid))
    resume = result.scalar_one_or_none()
    if resume is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    return ResumeDetail(
        id=str(resume.id),
        original_filename=resume.original_filename,
        content_type=resume.content_type,
        storage_path=resume.storage_path,
        created_at=resume.created_at,
        text=resume.text,
        sections=resume.parsed_sections,
    )
