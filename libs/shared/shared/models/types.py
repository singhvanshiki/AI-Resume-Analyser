from __future__ import annotations

import os
import sqlalchemy as sa


def vector_type():
    dim = int(os.getenv("VECTOR_DIM", "1536"))
    database_url = os.getenv("DATABASE_URL", "")
    if not database_url.startswith("postgresql"):
        return sa.JSON
    try:
        from pgvector.sqlalchemy import Vector

        return Vector(dim)
    except Exception:
        return sa.JSON
