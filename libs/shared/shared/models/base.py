from __future__ import annotations

from datetime import datetime, timezone
from sqlalchemy.orm import DeclarativeBase, mapped_column
from sqlalchemy import DateTime


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    pass


class TimestampMixin:
    created_at = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)


class SoftDeleteMixin:
    deleted_at = mapped_column(DateTime(timezone=True), nullable=True)
