from functools import lru_cache
from pydantic import Field
from shared.config import AppSettings


class Settings(AppSettings):
    service_name: str = "auth-service"
    password_min_length: int = Field(default=8, alias="PASSWORD_MIN_LENGTH")


@lru_cache
def get_settings() -> Settings:
    return Settings()
