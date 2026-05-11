from functools import lru_cache
from pydantic import Field
from shared.config import AppSettings


class Settings(AppSettings):
    service_name: str = "api-gateway"
    auth_service_url: str = Field(default="http://auth-service:8000", alias="AUTH_SERVICE_URL")
    resume_service_url: str = Field(default="http://resume-service:8000", alias="RESUME_SERVICE_URL")
    analysis_service_url: str = Field(default="http://analysis-service:8000", alias="ANALYSIS_SERVICE_URL")
    ranking_service_url: str = Field(default="http://ranking-service:8000", alias="RANKING_SERVICE_URL")
    rate_limit_per_minute: int = Field(default=120, alias="RATE_LIMIT_PER_MINUTE")


@lru_cache
def get_settings() -> Settings:
    return Settings()
