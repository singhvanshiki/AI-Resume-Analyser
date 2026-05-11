from pydantic import BaseModel


class CompareRequest(BaseModel):
    job_description_id: str
    resume_ids: list[str]


class RankingItem(BaseModel):
    resume_id: str
    score: float
    rank: int
    explanation: str


class RankingResponse(BaseModel):
    job_description_id: str
    rankings: list[RankingItem]
