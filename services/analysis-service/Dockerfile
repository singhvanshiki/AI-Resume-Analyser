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

RUN curl -LsSf -o /tmp/uv.tar.gz https://github.com/astral-sh/uv/releases/download/0.11.13/uv-x86_64-unknown-linux-gnu.tar.gz \
	&& tar -xzf /tmp/uv.tar.gz -C /tmp \
	&& mv /tmp/uv-x86_64-unknown-linux-gnu/uv /usr/local/bin/uv \
	&& mv /tmp/uv-x86_64-unknown-linux-gnu/uvx /usr/local/bin/uvx \
	&& rm -rf /tmp/uv.tar.gz /tmp/uv-x86_64-unknown-linux-gnu

COPY services/analysis-service/pyproject.toml services/analysis-service/uv.lock /app/services/analysis-service/

WORKDIR /app/services/analysis-service
RUN uv venv "$VIRTUAL_ENV" \
	&& uv sync --frozen --no-dev --active --no-install-project

WORKDIR /app
COPY libs/shared /app/libs/shared
COPY services/analysis-service /app/services/analysis-service

WORKDIR /app/services/analysis-service

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
