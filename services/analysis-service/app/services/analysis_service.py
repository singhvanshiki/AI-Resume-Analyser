from __future__ import annotations

from datetime import datetime, timezone
import uuid
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from shared.models.tables import (
    ExtractedSkill,
    GeneratedContent,
    JobDescription,
    Resume,
    ResumeAnalysis,
    SkillMatch,
)
from shared.models.enums import ContentType, SkillMatchType
from app.ai.provider import AIProvider
from app.ai.prompt_manager import PromptManager
from app.services.ats import extract_skills, score_resume


def _parse_uuid(value: str | uuid.UUID | None, label: str) -> uuid.UUID | None:
    if value is None:
        return None
    if isinstance(value, uuid.UUID):
        return value
    try:
        return uuid.UUID(value)
    except ValueError as exc:
        raise ValueError(f"Invalid {label} id") from exc


async def get_resume(session: AsyncSession, resume_id: str) -> Resume:
    try:
        resume_uuid = uuid.UUID(resume_id)
    except ValueError:
        raise ValueError("Invalid resume id")
    result = await session.execute(select(Resume).where(Resume.id == resume_uuid))
    resume = result.scalar_one_or_none()
    if resume is None:
        raise ValueError("Resume not found")
    return resume


async def get_job_description(session: AsyncSession, job_description_id: str) -> JobDescription:
    try:
        job_uuid = uuid.UUID(job_description_id)
    except ValueError:
        raise ValueError("Invalid job description id")
    result = await session.execute(select(JobDescription).where(JobDescription.id == job_uuid))
    job = result.scalar_one_or_none()
    if job is None:
        raise ValueError("Job description not found")
    return job


async def run_ats_analysis(
    session: AsyncSession,
    provider: AIProvider,
    prompt_manager: PromptManager,
    resume: Resume,
    job_text: str,
    job_description_id: str | uuid.UUID | None,
) -> ResumeAnalysis:
    job_uuid = _parse_uuid(job_description_id, "job description")
    resume_embedding = await provider.embeddings(resume.text)
    job_embedding = await provider.embeddings(job_text)
    ats_result = score_resume(resume.text, job_text, resume.parsed_sections, resume_embedding, job_embedding)

    ai_summary = None
    try:
        prompt = prompt_manager.render(
            "ats_analysis.j2",
            resume_text=resume.text,
            job_description=job_text,
        )
        ai_summary = await provider.generate_json(prompt)
    except Exception:
        ai_summary = {}

    recommendations = ats_result.recommendations
    missing_skills = ats_result.missing_skills
    if ai_summary:
        recommendations = list({*recommendations, *ai_summary.get("recommendations", [])})
        missing_skills = list({*missing_skills, *ai_summary.get("missing_skills", [])})

    analysis = ResumeAnalysis(
        resume_id=resume.id,
        job_description_id=job_uuid,
        ats_score=ats_result.score,
        category_scores=ai_summary.get("category_scores", ats_result.category_scores),
        explanation=ai_summary.get("summary", ats_result.explanation),
        missing_skills=missing_skills,
        recommendations=recommendations,
        semantic_similarity=ats_result.semantic_similarity,
        embedding=resume_embedding,
        created_at=datetime.now(timezone.utc),
    )
    session.add(analysis)
    await session.commit()
    await session.refresh(analysis)
    return analysis


async def extract_resume_skills(session: AsyncSession, resume: Resume, provider: AIProvider, prompt_manager: PromptManager) -> list[ExtractedSkill]:
    skills = []
    try:
        prompt = prompt_manager.render("skill_extraction.j2", resume_text=resume.text)
        response = await provider.generate_json(prompt)
        skills = response.get("skills", [])
        if not isinstance(skills, list):
            skills = []
    except Exception:
        skills = list(extract_skills(resume.text))

    await session.execute(delete(ExtractedSkill).where(ExtractedSkill.resume_id == resume.id))
    records = []
    for skill in sorted(set(skills)):
        record = ExtractedSkill(
            resume_id=resume.id,
            skill=skill,
            category=None,
            confidence=0.7,
            source="ai",
            created_at=datetime.now(timezone.utc),
        )
        session.add(record)
        records.append(record)
    await session.commit()
    return records


async def match_skills(
    session: AsyncSession,
    resume: Resume,
    job_text: str,
    job_description_id: str | uuid.UUID | None,
) -> list[dict]:
    job_uuid = _parse_uuid(job_description_id, "job description")
    resume_skills = extract_skills(resume.text)
    job_skills = extract_skills(job_text)
    matches: list[dict] = []
    for skill in job_skills:
        if skill in resume_skills:
            match_type = SkillMatchType.exact
            score = 1.0
        else:
            match_type = SkillMatchType.missing
            score = 0.0
        if job_uuid:
            match = SkillMatch(
                resume_id=resume.id,
                job_description_id=job_uuid,
                skill=skill,
                match_type=match_type,
                score=score,
                created_at=datetime.now(timezone.utc),
            )
            session.add(match)
        matches.append({"skill": skill, "match_type": match_type.value, "score": score})
    if job_uuid:
        await session.commit()
    return matches


async def generate_content(
    session: AsyncSession,
    provider: AIProvider,
    prompt_manager: PromptManager,
    resume: Resume,
    job_text: str,
    job_description_id: str | uuid.UUID | None,
    content_type: ContentType,
    template_name: str,
) -> GeneratedContent:
    job_uuid = _parse_uuid(job_description_id, "job description")
    prompt = prompt_manager.render(template_name, resume_text=resume.text, job_description=job_text)
    try:
        content = await provider.generate_text(prompt)
    except Exception:
        summary = resume.parsed_sections.get("summary", "")
        skills = resume.parsed_sections.get("skills", "")
        if content_type == ContentType.cover_letter:
            content = (
                "Dear Hiring Manager,\n\n"
                "I am excited to apply for this role. My background aligns well with the job requirements. "
                f"Highlights include: {summary}. Key skills include {skills}.\n\n"
                "Thank you for your consideration.\n"
            )
        elif content_type == ContentType.interview_questions:
            content = (
                "1. Walk me through your most relevant project.\n"
                "2. How do you approach debugging a production issue?\n"
                "3. Describe a time you improved performance or reliability.\n"
                "4. How do you prioritize tasks when deadlines conflict?\n"
                "5. Explain a challenging technical decision you made.\n"
                "6. What would your first 30 days in this role look like?\n"
            )
        else:
            content = "Focus on measurable impact, align keywords to the job description, and clarify outcomes."
    record = GeneratedContent(
        resume_id=resume.id,
        job_description_id=job_uuid,
        content_type=content_type,
        content_text=content,
        created_at=datetime.now(timezone.utc),
    )
    session.add(record)
    await session.commit()
    await session.refresh(record)
    return record
