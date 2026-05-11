from __future__ import annotations

from dataclasses import dataclass
from fastapi import Depends, Header, HTTPException, status

from shared.security import decode_token
from app.core.config import Settings, get_settings


@dataclass
class UserContext:
    user_id: str
    role: str


async def get_user_context(
    x_user_id: str | None = Header(default=None, alias="X-User-Id"),
    x_user_role: str | None = Header(default=None, alias="X-User-Role"),
    x_internal_token: str | None = Header(default=None, alias="X-Internal-Token"),
    authorization: str | None = Header(default=None, alias="Authorization"),
    settings: Settings = Depends(get_settings),
) -> UserContext:
    if x_internal_token == settings.internal_token and x_user_id and x_user_role:
        return UserContext(user_id=x_user_id, role=x_user_role)
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1]
        try:
            payload = decode_token(token, settings)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        if payload.get("type") != "access":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
        return UserContext(user_id=payload.get("sub"), role=payload.get("role"))
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
