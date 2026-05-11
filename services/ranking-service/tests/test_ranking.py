import pytest
from datetime import datetime, timezone

from shared.models.tables import JobDescription, Resume, ResumeAnalysis


@pytest.mark.asyncio
async def test_ranking_endpoint(client, db_session):
    job = JobDescription(
        user_id="00000000-0000-0000-0000-000000000001",
        title="Engineer",
        company="TestCo",
        location="Remote",
        description_text="Need Python",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    resume = Resume(
        user_id="00000000-0000-0000-0000-000000000001",
        original_filename="resume.txt",
        content_type="text/plain",
        storage_path="local/resume.txt",
        text="Python developer",
        parsed_sections={"summary": "Python", "skills": "Python"},
        status="parsed",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db_session.add_all([job, resume])
    await db_session.commit()
    await db_session.refresh(job)
    await db_session.refresh(resume)

    analysis = ResumeAnalysis(
        resume_id=resume.id,
        job_description_id=job.id,
        ats_score=80,
        category_scores={"keyword": 80},
        explanation="Good fit",
        missing_skills=[],
        recommendations=[],
        semantic_similarity=0.9,
        embedding=None,
        created_at=datetime.now(timezone.utc),
    )
    db_session.add(analysis)
    await db_session.commit()

    payload = {"job_description_id": str(job.id), "resume_ids": [str(resume.id)]}
    response = await client.post("/ranking/compare", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["rankings"][0]["rank"] == 1
