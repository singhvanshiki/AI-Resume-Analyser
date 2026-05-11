from pydantic import BaseModel


class ATSRequest(BaseModel):
    resume_id: str
    job_description_id: str | None = None
    job_description_text: str | None = None


class ATSResponse(BaseModel):
    analysis_id: str
    ats_score: float
    category_scores: dict
    explanation: str
    missing_skills: list
    recommendations: list
    semantic_similarity: float


class MatchRequest(BaseModel):
    resume_id: str
    job_description_id: str | None = None
    job_description_text: str | None = None


class MatchResponse(BaseModel):
    semantic_similarity: float
    skill_matches: list
    missing_skills: list
    strengths: list[str] = []
    gaps: list[str] = []
    overall_fit: str | None = None


class ContentRequest(BaseModel):
    resume_id: str
    job_description_id: str | None = None
    job_description_text: str | None = None


class ContentResponse(BaseModel):
    content_id: str
    content: str


class SkillResponse(BaseModel):
    skills: list[str]
