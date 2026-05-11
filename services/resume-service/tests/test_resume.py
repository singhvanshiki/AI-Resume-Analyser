import pytest


@pytest.mark.asyncio
async def test_upload_resume_txt(client):
    files = {"file": ("resume.txt", b"Summary\nSkills\nPython", "text/plain")}
    response = await client.post("/resumes/upload", files=files)
    assert response.status_code == 201
    body = response.json()
    assert body["original_filename"] == "resume.txt"
