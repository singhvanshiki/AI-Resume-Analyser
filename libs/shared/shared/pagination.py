from __future__ import annotations


def clamp_pagination(page: int, page_size: int, max_size: int = 100) -> tuple[int, int]:
    page = max(page, 1)
    page_size = max(1, min(page_size, max_size))
    return page, page_size
