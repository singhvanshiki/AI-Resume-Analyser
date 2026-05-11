from datetime import datetime
from pydantic import BaseModel


class ResumeResponse(BaseModel):
    id: str
    original_filename: str
    content_type: str
    storage_path: str
    created_at: datetime


class ResumeDetail(ResumeResponse):
    text: str
    sections: dict


class ResumeList(BaseModel):
    items: list[ResumeResponse]
    page: int
    page_size: int
