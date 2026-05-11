from __future__ import annotations

import json
import re
import asyncio

import httpx

from app.core.config import Settings


class OpenRouterProvider:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.base_url = settings.openrouter_base_url

    def _headers(self) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {self.settings.openrouter_api_key}",
            "Content-Type": "application/json",
        }

    async def _post_with_retries(self, path: str, payload: dict) -> dict:
        last_exc: Exception | None = None
        for attempt in range(3):
            try:
                async with httpx.AsyncClient(timeout=self.settings.openrouter_timeout_seconds) as client:
                    response = await client.post(f"{self.base_url}{path}", headers=self._headers(), json=payload)
                    response.raise_for_status()
                    return response.json()
            except Exception as exc:
                last_exc = exc
                await asyncio.sleep(0.5 * (attempt + 1))
        raise last_exc if last_exc else RuntimeError("OpenRouter request failed")

    async def generate_json(self, prompt: str) -> dict:
        if not self.settings.openrouter_api_key or self.settings.openrouter_api_key == "local-dev-key":
            raise RuntimeError("OpenRouter API key not configured")
        payload = {
            "model": self.settings.openrouter_model,
            "messages": [
                {"role": "system", "content": "Return only valid JSON."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.2,
        }
        data = await self._post_with_retries("/chat/completions", payload)
        content = data["choices"][0]["message"]["content"]
        return self._parse_json(content)

    async def generate_text(self, prompt: str) -> str:
        if not self.settings.openrouter_api_key or self.settings.openrouter_api_key == "local-dev-key":
            raise RuntimeError("OpenRouter API key not configured")
        payload = {
            "model": self.settings.openrouter_model,
            "messages": [
                {"role": "system", "content": "Be concise and clear."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.4,
        }
        data = await self._post_with_retries("/chat/completions", payload)
        return data["choices"][0]["message"]["content"].strip()

    async def embeddings(self, text: str) -> list[float] | None:
        if not self.settings.openrouter_api_key or self.settings.openrouter_api_key == "local-dev-key":
            return None
        payload = {
            "model": self.settings.openrouter_embedding_model,
            "input": text,
        }
        try:
            data = await self._post_with_retries("/embeddings", payload)
            return data.get("data", [{}])[0].get("embedding")
        except Exception:
            return None

    def _parse_json(self, content: str) -> dict:
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            match = re.search(r"\{.*\}", content, re.DOTALL)
            if not match:
                raise ValueError("No JSON found")
            return json.loads(match.group(0))
