from __future__ import annotations

from datetime import datetime, timedelta, timezone
import hashlib

import bcrypt
from jose import jwt, JWTError

from shared.config import AppSettings


_BCRYPT_MAX_BYTES = 72


def _ensure_bcrypt_length(password: str) -> None:
    if len(password.encode("utf-8")) > _BCRYPT_MAX_BYTES:
        raise ValueError(
            "password cannot be longer than 72 bytes, truncate manually if necessary (e.g. my_password[:72])"
        )


def hash_password(password: str) -> str:
    _ensure_bcrypt_length(password)
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except ValueError:
        return False


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _create_token(data: dict, expires_delta: timedelta, settings: AppSettings) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    return jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def create_access_token(user_id: str, role: str, settings: AppSettings) -> str:
    return _create_token(
        {"sub": user_id, "role": role, "type": "access"},
        timedelta(minutes=settings.access_token_expire_minutes),
        settings,
    )


def create_refresh_token(user_id: str, settings: AppSettings) -> str:
    return _create_token(
        {"sub": user_id, "type": "refresh"},
        timedelta(days=settings.refresh_token_expire_days),
        settings,
    )


def decode_token(token: str, settings: AppSettings) -> dict:
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError as exc:
        raise ValueError("Invalid token") from exc
