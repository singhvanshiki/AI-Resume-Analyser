from fastapi import APIRouter, Depends, Request, UploadFile, File, Response
import httpx

from app.api.deps import CurrentUser, get_current_user
from app.core.config import Settings, get_settings
from app.core.limiter import limiter, RATE_LIMIT

router = APIRouter(prefix="/resumes", tags=["resumes"])


@router.post("/upload")
@limiter.limit(RATE_LIMIT)
async def upload_resume(
    request: Request,
    file: UploadFile = File(...),
    user: CurrentUser = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
):
    headers = {"X-User-Id": user.user_id, "X-User-Role": user.role, "X-Internal-Token": settings.internal_token}
    content = await file.read()
    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            f"{settings.resume_service_url}/resumes/upload",
            headers=headers,
            files={"file": (file.filename, content, file.content_type)},
        )
    return Response(content=response.content, status_code=response.status_code, media_type=response.headers.get("content-type"))


@router.api_route("", methods=["GET"])
@limiter.limit(RATE_LIMIT)
async def list_resumes(
    request: Request,
    user: CurrentUser = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
):
    headers = {"X-User-Id": user.user_id, "X-User-Role": user.role, "X-Internal-Token": settings.internal_token}
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(f"{settings.resume_service_url}/resumes", headers=headers, params=request.query_params)
    return Response(content=response.content, status_code=response.status_code, media_type=response.headers.get("content-type"))


@router.api_route("/{resume_id}", methods=["GET"])
@limiter.limit(RATE_LIMIT)
async def get_resume(
    resume_id: str,
    request: Request,
    user: CurrentUser = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
):
    headers = {"X-User-Id": user.user_id, "X-User-Role": user.role, "X-Internal-Token": settings.internal_token}
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(
            f"{settings.resume_service_url}/resumes/{resume_id}", headers=headers, params=request.query_params
        )
    return Response(content=response.content, status_code=response.status_code, media_type=response.headers.get("content-type"))
