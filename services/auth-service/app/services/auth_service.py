from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Tuple

from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from shared.models.tables import RefreshToken, Role, User
from shared.models.enums import RoleName
from shared.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    hash_token,
    verify_password,
)
from app.core.config import Settings


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


async def get_role(session: AsyncSession, role_name: str) -> Role | None:
    try:
        role_enum = RoleName(role_name)
    except ValueError:
        return None
    result = await session.execute(select(Role).where(Role.name == role_enum))
    return result.scalar_one_or_none()


async def create_user(session: AsyncSession, settings: Settings, email: str, password: str, full_name: str, role: str) -> User:
    role_obj = await get_role(session, role)
    if role_obj is None:
        raise ValueError("Invalid role")
    user = User(
        email=email.lower(),
        full_name=full_name,
        password_hash=hash_password(password),
        role_id=role_obj.id,
        is_active=True,
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


async def authenticate_user(session: AsyncSession, email: str, password: str) -> User | None:
    result = await session.execute(
        select(User).options(selectinload(User.role)).where(User.email == email.lower())
    )
    user = result.scalar_one_or_none()
    if user is None:
        return None
    if not verify_password(password, user.password_hash):
        return None
    user.last_login_at = now_utc()
    await session.commit()
    return user


async def issue_tokens(session: AsyncSession, settings: Settings, user: User) -> tuple[str, str]:
    await session.refresh(user, attribute_names=["role"])
    access_token = create_access_token(str(user.id), user.role.name, settings)
    refresh_token = create_refresh_token(str(user.id), settings)
    token_record = RefreshToken(
        user_id=user.id,
        token_hash=hash_token(refresh_token),
        expires_at=now_utc() + timedelta(days=settings.refresh_token_expire_days),
        created_at=now_utc(),
    )
    session.add(token_record)
    await session.commit()
    return access_token, refresh_token


async def refresh_tokens(session: AsyncSession, settings: Settings, refresh_token: str) -> tuple[str, str, User]:
    token_hash = hash_token(refresh_token)
    result = await session.execute(select(RefreshToken).where(RefreshToken.token_hash == token_hash))
    token_record = result.scalar_one_or_none()
    if token_record is None:
        raise ValueError("Refresh token not found")
    if token_record.revoked_at is not None:
        raise ValueError("Refresh token revoked")
    if token_record.expires_at < now_utc():
        raise ValueError("Refresh token expired")
    token_record.revoked_at = now_utc()
    await session.commit()
    user = await session.get(User, token_record.user_id)
    if user is None:
        raise ValueError("User not found")
    await session.refresh(user, attribute_names=["role"])
    access_token, new_refresh_token = await issue_tokens(session, settings, user)
    return access_token, new_refresh_token, user


async def revoke_refresh_token(session: AsyncSession, refresh_token: str) -> None:
    token_hash = hash_token(refresh_token)
    result = await session.execute(select(RefreshToken).where(RefreshToken.token_hash == token_hash))
    token_record = result.scalar_one_or_none()
    if token_record is None:
        return
    token_record.revoked_at = now_utc()
    await session.commit()
