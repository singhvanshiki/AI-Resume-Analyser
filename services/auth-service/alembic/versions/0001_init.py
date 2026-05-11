from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector


revision = "0001_init"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    op.create_table(
        "roles",
        sa.Column("id", sa.Uuid(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("name", sa.Enum("student", "recruiter", "admin", name="rolename"), nullable=False, unique=True),
        sa.Column("description", sa.String(length=255)),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True)),
    )

    op.create_table(
        "users",
        sa.Column("id", sa.Uuid(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("role_id", sa.Uuid(as_uuid=True), sa.ForeignKey("roles.id"), nullable=False),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default=sa.text("true")),
        sa.Column("last_login_at", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True)),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_index("ix_users_role_id", "users", ["role_id"], unique=False)

    op.create_table(
        "refresh_tokens",
        sa.Column("id", sa.Uuid(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("user_id", sa.Uuid(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("token_hash", sa.String(length=255), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("revoked_at", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_refresh_tokens_user_id", "refresh_tokens", ["user_id"], unique=False)
    op.create_index("ix_refresh_tokens_token_hash", "refresh_tokens", ["token_hash"], unique=True)

    op.create_table(
        "resumes",
        sa.Column("id", sa.Uuid(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("user_id", sa.Uuid(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("original_filename", sa.String(length=255), nullable=False),
        sa.Column("content_type", sa.String(length=100), nullable=False),
        sa.Column("storage_path", sa.String(length=500), nullable=False),
        sa.Column("text", sa.Text, nullable=False),
        sa.Column("parsed_sections", sa.JSON, nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True)),
    )
    op.create_index("ix_resumes_user_id", "resumes", ["user_id"], unique=False)
    op.create_index("ix_resumes_storage_path", "resumes", ["storage_path"], unique=True)

    op.create_table(
        "resume_sections",
        sa.Column("id", sa.Uuid(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("resume_id", sa.Uuid(as_uuid=True), sa.ForeignKey("resumes.id"), nullable=False),
        sa.Column("section_type", sa.Enum(
            "summary", "skills", "experience", "education", "projects", "certifications", "other", name="sectiontype"
        ), nullable=False),
        sa.Column("content", sa.Text, nullable=False),
        sa.Column("position", sa.Integer, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_resume_sections_resume_id", "resume_sections", ["resume_id"], unique=False)

    op.create_table(
        "job_descriptions",
        sa.Column("id", sa.Uuid(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("user_id", sa.Uuid(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("company", sa.String(length=255)),
        sa.Column("location", sa.String(length=255)),
        sa.Column("description_text", sa.Text, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True)),
    )
    op.create_index("ix_job_descriptions_user_id", "job_descriptions", ["user_id"], unique=False)

    op.create_table(
        "resume_analysis",
        sa.Column("id", sa.Uuid(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("resume_id", sa.Uuid(as_uuid=True), sa.ForeignKey("resumes.id"), nullable=False),
        sa.Column("job_description_id", sa.Uuid(as_uuid=True), sa.ForeignKey("job_descriptions.id")),
        sa.Column("ats_score", sa.Float, nullable=False),
        sa.Column("category_scores", sa.JSON, nullable=False),
        sa.Column("explanation", sa.Text, nullable=False),
        sa.Column("missing_skills", sa.JSON, nullable=False),
        sa.Column("recommendations", sa.JSON, nullable=False),
        sa.Column("semantic_similarity", sa.Float, nullable=False),
        sa.Column("embedding", Vector(1536)),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_resume_analysis_resume_id", "resume_analysis", ["resume_id"], unique=False)
    op.create_index("ix_resume_analysis_job_description_id", "resume_analysis", ["job_description_id"], unique=False)

    op.create_table(
        "extracted_skills",
        sa.Column("id", sa.Uuid(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("resume_id", sa.Uuid(as_uuid=True), sa.ForeignKey("resumes.id"), nullable=False),
        sa.Column("skill", sa.String(length=255), nullable=False),
        sa.Column("category", sa.String(length=255)),
        sa.Column("confidence", sa.Float, nullable=False),
        sa.Column("source", sa.String(length=50), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_extracted_skills_resume_id", "extracted_skills", ["resume_id"], unique=False)
    op.create_index("ix_extracted_skills_resume_skill", "extracted_skills", ["resume_id", "skill"], unique=True)

    op.create_table(
        "skill_matches",
        sa.Column("id", sa.Uuid(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("resume_id", sa.Uuid(as_uuid=True), sa.ForeignKey("resumes.id"), nullable=False),
        sa.Column("job_description_id", sa.Uuid(as_uuid=True), sa.ForeignKey("job_descriptions.id"), nullable=False),
        sa.Column("skill", sa.String(length=255), nullable=False),
        sa.Column("match_type", sa.Enum("exact", "related", "missing", name="skillmatchtype"), nullable=False),
        sa.Column("score", sa.Float, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_skill_matches_resume_id", "skill_matches", ["resume_id"], unique=False)
    op.create_index("ix_skill_matches_job_description_id", "skill_matches", ["job_description_id"], unique=False)

    op.create_table(
        "candidate_rankings",
        sa.Column("id", sa.Uuid(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("job_description_id", sa.Uuid(as_uuid=True), sa.ForeignKey("job_descriptions.id"), nullable=False),
        sa.Column("resume_id", sa.Uuid(as_uuid=True), sa.ForeignKey("resumes.id"), nullable=False),
        sa.Column("total_score", sa.Float, nullable=False),
        sa.Column("breakdown", sa.JSON, nullable=False),
        sa.Column("rank", sa.Integer, nullable=False),
        sa.Column("explanation", sa.Text, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_candidate_rankings_job_rank", "candidate_rankings", ["job_description_id", "rank"], unique=False)

    op.create_table(
        "generated_content",
        sa.Column("id", sa.Uuid(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("resume_id", sa.Uuid(as_uuid=True), sa.ForeignKey("resumes.id"), nullable=False),
        sa.Column("job_description_id", sa.Uuid(as_uuid=True), sa.ForeignKey("job_descriptions.id")),
        sa.Column("content_type", sa.Enum(
            "ats_analysis", "rewrite", "interview_questions", "cover_letter", "recruiter_summary", "skill_extraction",
            name="contenttype"
        ), nullable=False),
        sa.Column("content_text", sa.Text, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_generated_content_resume_id", "generated_content", ["resume_id"], unique=False)
    op.create_index("ix_generated_content_job_description_id", "generated_content", ["job_description_id"], unique=False)

    op.create_table(
        "audit_logs",
        sa.Column("id", sa.Uuid(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("user_id", sa.Uuid(as_uuid=True), sa.ForeignKey("users.id")),
        sa.Column("action", sa.String(length=100), nullable=False),
        sa.Column("resource_type", sa.String(length=100), nullable=False),
        sa.Column("resource_id", sa.Uuid(as_uuid=True)),
        sa.Column("ip_address", sa.String(length=64)),
        sa.Column("user_agent", sa.String(length=512)),
        sa.Column("metadata", sa.JSON, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_audit_logs_user_id", "audit_logs", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_table("audit_logs")
    op.drop_table("generated_content")
    op.drop_table("candidate_rankings")
    op.drop_table("skill_matches")
    op.drop_table("extracted_skills")
    op.drop_table("resume_analysis")
    op.drop_table("job_descriptions")
    op.drop_table("resume_sections")
    op.drop_table("resumes")
    op.drop_table("refresh_tokens")
    op.drop_table("users")
    op.drop_table("roles")
    op.execute("DROP EXTENSION IF EXISTS vector")
