from functools import lru_cache
from pydantic import Field
from shared.config import AppSettings


class Settings(AppSettings):
    service_name: str = "ranking-service"
    analysis_service_url: str = Field(default="http://analysis-service:8000", alias="ANALYSIS_SERVICE_URL")


@lru_cache
def get_settings() -> Settings:
    return Settings()
