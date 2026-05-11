from fastapi import APIRouter, Depends, Request, Response
import httpx

from app.api.deps import CurrentUser, get_current_user
from app.core.config import Settings, get_settings
from app.core.limiter import limiter, RATE_LIMIT

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.api_route("/{path:path}", methods=["POST"])
@limiter.limit(RATE_LIMIT)
async def proxy_analysis(
    path: str,
    request: Request,
    user: CurrentUser = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
):
    headers = {"X-User-Id": user.user_id, "X-User-Role": user.role, "X-Internal-Token": settings.internal_token}
    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.request(
            request.method,
            f"{settings.analysis_service_url}/analysis/{path}",
            headers=headers,
            params=request.query_params,
            content=await request.body(),
        )
    return Response(content=response.content, status_code=response.status_code, media_type=response.headers.get("content-type"))
