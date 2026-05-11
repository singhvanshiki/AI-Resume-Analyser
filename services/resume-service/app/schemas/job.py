from datetime import datetime
from pydantic import BaseModel


class JobDescriptionCreate(BaseModel):
    title: str
    company: str | None = None
    location: str | None = None
    description_text: str


class JobDescriptionResponse(BaseModel):
    id: str
    title: str
    company: str | None
    location: str | None
    description_text: str
    created_at: datetime


class JobDescriptionList(BaseModel):
    items: list[JobDescriptionResponse]
    page: int
    page_size: int
