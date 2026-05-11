# Architecture

## Service Boundaries

- **API Gateway**: Routes requests to internal services, validates JWTs, applies rate limiting.
- **Auth Service**: Owns user identity, roles, password hashing, access/refresh tokens.
- **Resume Service**: Parses and normalizes resumes, stores sections and files.
- **Analysis Service**: ATS scoring, skill extraction, AI generation, embeddings.
- **Ranking Service**: Job-specific candidate ranking and comparisons.

## Data Flow

1. User authenticates via Auth Service.
2. Resumes are uploaded to Resume Service, stored in MinIO, and normalized text saved in Postgres.
3. Analysis Service computes ATS scores and AI content.
4. Ranking Service compares resumes to job descriptions and generates ranking explanations.

## Storage

- Postgres for relational data with pgvector for embeddings.
- MinIO for object storage (resume files).
- Redis for rate limiting and Celery broker.
