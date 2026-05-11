from __future__ import annotations

from typing import Protocol


class AIProvider(Protocol):
    async def generate_json(self, prompt: str) -> dict:
        ...

    async def generate_text(self, prompt: str) -> str:
        ...

    async def embeddings(self, text: str) -> list[float] | None:
        ...
