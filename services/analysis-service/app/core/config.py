from functools import lru_cache
from pydantic import Field
from shared.config import AppSettings


class Settings(AppSettings):
    service_name: str = "analysis-service"
    openrouter_api_key: str = Field(default="", alias="OPENROUTER_API_KEY")
    openrouter_base_url: str = Field(default="https://openrouter.ai/api/v1", alias="OPENROUTER_BASE_URL")
    openrouter_model: str = Field(default="openai/gpt-4o-mini", alias="OPENROUTER_MODEL")
    openrouter_embedding_model: str = Field(default="openai/text-embedding-3-small", alias="OPENROUTER_EMBEDDING_MODEL")
    openrouter_timeout_seconds: int = Field(default=30, alias="OPENROUTER_TIMEOUT_SECONDS")


@lru_cache
def get_settings() -> Settings:
    return Settings()
