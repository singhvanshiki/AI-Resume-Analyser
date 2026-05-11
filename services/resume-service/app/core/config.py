from functools import lru_cache
from pydantic import Field
from shared.config import AppSettings


class Settings(AppSettings):
    service_name: str = "resume-service"
    minio_endpoint: str = Field(default="minio:9000", alias="MINIO_ENDPOINT")
    minio_access_key: str = Field(default="minioadmin", alias="MINIO_ACCESS_KEY")
    minio_secret_key: str = Field(default="minioadmin", alias="MINIO_SECRET_KEY")
    minio_bucket: str = Field(default="resumes", alias="MINIO_BUCKET")
    minio_secure: bool = Field(default=False, alias="MINIO_SECURE")
    storage_mode: str = Field(default="minio", alias="STORAGE_MODE")


@lru_cache
def get_settings() -> Settings:
    return Settings()
