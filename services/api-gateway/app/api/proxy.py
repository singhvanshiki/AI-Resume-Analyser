from __future__ import annotations

from fastapi import Request, Response
import httpx

from app.api.deps import CurrentUser
from app.core.config import Settings


def _filtered_headers(request: Request) -> dict:
    excluded = {"host", "content-length"}
    return {k: v for k, v in request.headers.items() if k.lower() not in excluded}


async def forward_request(
    request: Request,
    target_url: str,
    settings: Settings,
    user: CurrentUser | None = None,
) -> Response:
    headers = _filtered_headers(request)
    if user and user.user_id:
        headers["X-User-Id"] = user.user_id
        headers["X-User-Role"] = user.role
        headers["X-Internal-Token"] = settings.internal_token

    body = await request.body()
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.request(
            request.method,
            target_url,
            params=request.query_params,
            content=body,
            headers=headers,
        )
    return Response(content=response.content, status_code=response.status_code, headers=response.headers)
