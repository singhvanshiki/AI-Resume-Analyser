import pytest
from datetime import datetime, timezone

from shared.models.tables import Resume


@pytest.mark.asyncio
async def test_ats_endpoint(client, db_session):
    resume = Resume(
        user_id="00000000-0000-0000-0000-000000000001",
        original_filename="resume.txt",
        content_type="text/plain",
        storage_path="local/resume.txt",
        text="Summary Skills Python Experience",
        parsed_sections={"summary": "Summary", "skills": "Python", "experience": "Dev", "education": "BS"},
        status="parsed",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db_session.add(resume)
    await db_session.commit()
    await db_session.refresh(resume)

    payload = {"resume_id": str(resume.id), "job_description_text": "Looking for Python developer"}
    response = await client.post("/analysis/ats", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["ats_score"] >= 0
