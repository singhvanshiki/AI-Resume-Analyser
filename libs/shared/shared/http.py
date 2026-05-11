from __future__ import annotations

import httpx


def create_async_client(timeout_seconds: int = 30) -> httpx.AsyncClient:
    return httpx.AsyncClient(timeout=httpx.Timeout(timeout_seconds))
