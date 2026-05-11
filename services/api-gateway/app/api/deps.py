from __future__ import annotations

from dataclasses import dataclass
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from shared.security import decode_token
from app.core.config import Settings, get_settings

security = HTTPBearer(auto_error=False)


@dataclass
class CurrentUser:
    user_id: str
    role: str


async def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    settings: Settings = Depends(get_settings),
) -> CurrentUser:
    if request.url.path.startswith("/api/v1/auth"):
        return CurrentUser(user_id="", role="")
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")
    token = credentials.credentials
    try:
        payload = decode_token(token, settings)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    if payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
    return CurrentUser(user_id=payload.get("sub"), role=payload.get("role"))
