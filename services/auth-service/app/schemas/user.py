from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str


class UserInDB(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
