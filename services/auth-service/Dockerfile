FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app/libs/shared
ENV VIRTUAL_ENV=/app/.venv
ENV PATH="/root/.local/bin:/app/.venv/bin:$PATH"

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
	build-essential \
	curl \
	ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:0.11.13 /uv /usr/local/bin/uv
COPY --from=ghcr.io/astral-sh/uv:0.11.13 /uvx /usr/local/bin/uvx

COPY services/auth-service/pyproject.toml services/auth-service/uv.lock /app/services/auth-service/

WORKDIR /app/services/auth-service
RUN uv venv "$VIRTUAL_ENV" \
	&& uv sync --frozen --no-dev --active --no-install-project

WORKDIR /app
COPY libs/shared /app/libs/shared
COPY services/auth-service /app/services/auth-service

WORKDIR /app/services/auth-service

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
