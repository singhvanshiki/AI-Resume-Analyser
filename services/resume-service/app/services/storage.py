from __future__ import annotations

import io
import os
import uuid
from dataclasses import dataclass

from minio import Minio

from app.core.config import Settings


@dataclass
class StoredObject:
    key: str
    size: int


class MinioStorage:
    def __init__(self, settings: Settings) -> None:
        self.client = Minio(
            settings.minio_endpoint,
            access_key=settings.minio_access_key,
            secret_key=settings.minio_secret_key,
            secure=settings.minio_secure,
        )
        self.bucket = settings.minio_bucket
        self._ensure_bucket()

    def _ensure_bucket(self) -> None:
        if not self.client.bucket_exists(self.bucket):
            self.client.make_bucket(self.bucket)

    def upload_bytes(self, data: bytes, filename: str, content_type: str) -> StoredObject:
        key = f"resumes/{uuid.uuid4().hex}-{filename}"
        self.client.put_object(
            self.bucket,
            key,
            data=io.BytesIO(data),
            length=len(data),
            content_type=content_type,
        )
        return StoredObject(key=key, size=len(data))


class LocalStorage:
    def __init__(self, base_path: str = "/tmp/resume_storage") -> None:
        self.base_path = base_path
        os.makedirs(self.base_path, exist_ok=True)

    def upload_bytes(self, data: bytes, filename: str, content_type: str) -> StoredObject:
        key = f"resumes/{uuid.uuid4().hex}-{filename}"
        full_path = os.path.join(self.base_path, key)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "wb") as handle:
            handle.write(data)
        return StoredObject(key=key, size=len(data))


def get_storage(settings: Settings):
    if settings.storage_mode == "local":
        return LocalStorage()
    return MinioStorage(settings)
