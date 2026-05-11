from typing import List
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class AppSettings(BaseSettings):
    model_config = SettingsConfigDict(case_sensitive=False)

    app_env: str = Field(default="local", alias="APP_ENV")
    log_level: str = Field(default="info", alias="LOG_LEVEL")
    database_url: str = Field(alias="DATABASE_URL")
    redis_url: str | None = Field(default=None, alias="REDIS_URL")
    cors_origins: List[str] = Field(default_factory=list, alias="CORS_ORIGINS")
    internal_token: str = Field(default="internal-token", alias="INTERNAL_TOKEN")

    jwt_secret: str = Field(default="secret", alias="JWT_SECRET")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    access_token_expire_minutes: int = Field(default=30, alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    refresh_token_expire_days: int = Field(default=14, alias="REFRESH_TOKEN_EXPIRE_DAYS")

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _split_origins(cls, value: str | List[str]) -> List[str]:
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        return value
