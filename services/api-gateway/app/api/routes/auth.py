from fastapi import APIRouter, Depends, Request

from app.api.deps import CurrentUser, get_current_user
from app.api.proxy import forward_request
from app.core.config import Settings, get_settings
from app.core.limiter import limiter, RATE_LIMIT

router = APIRouter(prefix="/auth", tags=["auth"])


@router.api_route("/register", methods=["POST"])
@limiter.limit(RATE_LIMIT)
async def register(request: Request, settings: Settings = Depends(get_settings)):
    return await forward_request(request, f"{settings.auth_service_url}/auth/register", settings)


@router.api_route("/login", methods=["POST"])
@limiter.limit(RATE_LIMIT)
async def login(request: Request, settings: Settings = Depends(get_settings)):
    return await forward_request(request, f"{settings.auth_service_url}/auth/login", settings)


@router.api_route("/refresh", methods=["POST"])
@limiter.limit(RATE_LIMIT)
async def refresh(request: Request, settings: Settings = Depends(get_settings)):
    return await forward_request(request, f"{settings.auth_service_url}/auth/refresh", settings)


@router.api_route("/logout", methods=["POST"])
@limiter.limit(RATE_LIMIT)
async def logout(request: Request, settings: Settings = Depends(get_settings)):
    return await forward_request(request, f"{settings.auth_service_url}/auth/logout", settings)


@router.api_route("/me", methods=["GET"])
@limiter.limit(RATE_LIMIT)
async def me(
    request: Request,
    settings: Settings = Depends(get_settings),
    user: CurrentUser = Depends(get_current_user),
):
    return await forward_request(request, f"{settings.auth_service_url}/auth/me", settings, user)
