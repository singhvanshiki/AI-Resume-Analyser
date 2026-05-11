from __future__ import annotations

import uuid
from datetime import datetime

import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, relationship

from shared.models.base import Base, SoftDeleteMixin, TimestampMixin
from shared.models.enums import ContentType, RoleName, SectionType, SkillMatchType
from shared.models.types import vector_type


class Role(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "roles"

    id: Mapped[uuid.UUID] = mapped_column(sa.Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[RoleName] = mapped_column(sa.Enum(RoleName), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(sa.String(255))

    users: Mapped[list["User"]] = relationship(back_populates="role")


class User(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(sa.Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(sa.String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    password_hash: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    role_id: Mapped[uuid.UUID] = mapped_column(sa.ForeignKey("roles.id"), nullable=False, index=True)
    is_active: Mapped[bool] = mapped_column(sa.Boolean, default=True, nullable=False)
    last_login_at: Mapped[datetime | None] = mapped_column(sa.DateTime(timezone=True))

    role: Mapped[Role] = relationship(back_populates="users")
    resumes: Mapped[list["Resume"]] = relationship(back_populates="user")
    job_descriptions: Mapped[list["JobDescription"]] = relationship(back_populates="user")


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id: Mapped[uuid.UUID] = mapped_column(sa.Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(sa.ForeignKey("users.id"), nullable=False, index=True)
    token_hash: Mapped[str] = mapped_column(sa.String(255), unique=True, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), nullable=False)
    revoked_at: Mapped[datetime | None] = mapped_column(sa.DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), nullable=False)

    user: Mapped[User] = relationship()


class Resume(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "resumes"

    id: Mapped[uuid.UUID] = mapped_column(sa.Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(sa.ForeignKey("users.id"), index=True, nullable=False)
    original_filename: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    content_type: Mapped[str] = mapped_column(sa.String(100), nullable=False)
    storage_path: Mapped[str] = mapped_column(sa.String(500), unique=True, nullable=False)
    text: Mapped[str] = mapped_column(sa.Text, nullable=False)
    parsed_sections: Mapped[dict] = mapped_column(sa.JSON, default=dict, nullable=False)
    status: Mapped[str] = mapped_column(sa.String(50), default="parsed", nullable=False)

    user: Mapped[User] = relationship(back_populates="resumes")
    sections: Mapped[list["ResumeSection"]] = relationship(back_populates="resume", cascade="all, delete-orphan")
    analyses: Mapped[list["ResumeAnalysis"]] = relationship(back_populates="resume")
    skills: Mapped[list["ExtractedSkill"]] = relationship(back_populates="resume")


class ResumeSection(Base):
    __tablename__ = "resume_sections"

    id: Mapped[uuid.UUID] = mapped_column(sa.Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resume_id: Mapped[uuid.UUID] = mapped_column(sa.ForeignKey("resumes.id"), index=True, nullable=False)
    section_type: Mapped[SectionType] = mapped_column(sa.Enum(SectionType), nullable=False)
    content: Mapped[str] = mapped_column(sa.Text, nullable=False)
    position: Mapped[int] = mapped_column(sa.Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), nullable=False)

    resume: Mapped[Resume] = relationship(back_populates="sections")


class JobDescription(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "job_descriptions"

    id: Mapped[uuid.UUID] = mapped_column(sa.Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(sa.ForeignKey("users.id"), index=True, nullable=False)
    title: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    company: Mapped[str | None] = mapped_column(sa.String(255))
    location: Mapped[str | None] = mapped_column(sa.String(255))
    description_text: Mapped[str] = mapped_column(sa.Text, nullable=False)

    user: Mapped[User] = relationship(back_populates="job_descriptions")
    analyses: Mapped[list["ResumeAnalysis"]] = relationship(back_populates="job_description")


class ResumeAnalysis(Base):
    __tablename__ = "resume_analysis"

    id: Mapped[uuid.UUID] = mapped_column(sa.Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resume_id: Mapped[uuid.UUID] = mapped_column(sa.ForeignKey("resumes.id"), index=True, nullable=False)
    job_description_id: Mapped[uuid.UUID | None] = mapped_column(sa.ForeignKey("job_descriptions.id"), index=True)
    ats_score: Mapped[float] = mapped_column(sa.Float, nullable=False)
    category_scores: Mapped[dict] = mapped_column(sa.JSON, nullable=False, default=dict)
    explanation: Mapped[str] = mapped_column(sa.Text, nullable=False)
    missing_skills: Mapped[list] = mapped_column(sa.JSON, nullable=False, default=list)
    recommendations: Mapped[list] = mapped_column(sa.JSON, nullable=False, default=list)
    semantic_similarity: Mapped[float] = mapped_column(sa.Float, nullable=False)
    embedding = mapped_column(vector_type(), nullable=True)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), nullable=False)

    resume: Mapped[Resume] = relationship(back_populates="analyses")
    job_description: Mapped[JobDescription | None] = relationship(back_populates="analyses")


class ExtractedSkill(Base):
    __tablename__ = "extracted_skills"

    id: Mapped[uuid.UUID] = mapped_column(sa.Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resume_id: Mapped[uuid.UUID] = mapped_column(sa.ForeignKey("resumes.id"), index=True, nullable=False)
    skill: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    category: Mapped[str | None] = mapped_column(sa.String(255))
    confidence: Mapped[float] = mapped_column(sa.Float, default=0.5, nullable=False)
    source: Mapped[str] = mapped_column(sa.String(50), default="ai", nullable=False)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), nullable=False)

    resume: Mapped[Resume] = relationship(back_populates="skills")

    __table_args__ = (
        sa.Index("ix_extracted_skills_resume_skill", "resume_id", "skill", unique=True),
    )


class SkillMatch(Base):
    __tablename__ = "skill_matches"

    id: Mapped[uuid.UUID] = mapped_column(sa.Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resume_id: Mapped[uuid.UUID] = mapped_column(sa.ForeignKey("resumes.id"), index=True, nullable=False)
    job_description_id: Mapped[uuid.UUID] = mapped_column(sa.ForeignKey("job_descriptions.id"), index=True, nullable=False)
    skill: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    match_type: Mapped[SkillMatchType] = mapped_column(sa.Enum(SkillMatchType), nullable=False)
    score: Mapped[float] = mapped_column(sa.Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), nullable=False)


class CandidateRanking(Base):
    __tablename__ = "candidate_rankings"

    id: Mapped[uuid.UUID] = mapped_column(sa.Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_description_id: Mapped[uuid.UUID] = mapped_column(sa.ForeignKey("job_descriptions.id"), index=True, nullable=False)
    resume_id: Mapped[uuid.UUID] = mapped_column(sa.ForeignKey("resumes.id"), index=True, nullable=False)
    total_score: Mapped[float] = mapped_column(sa.Float, nullable=False)
    breakdown: Mapped[dict] = mapped_column(sa.JSON, nullable=False)
    rank: Mapped[int] = mapped_column(sa.Integer, nullable=False)
    explanation: Mapped[str] = mapped_column(sa.Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), nullable=False)

    __table_args__ = (
        sa.Index("ix_candidate_rankings_job_rank", "job_description_id", "rank"),
    )


class GeneratedContent(Base):
    __tablename__ = "generated_content"

    id: Mapped[uuid.UUID] = mapped_column(sa.Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resume_id: Mapped[uuid.UUID] = mapped_column(sa.ForeignKey("resumes.id"), index=True, nullable=False)
    job_description_id: Mapped[uuid.UUID | None] = mapped_column(sa.ForeignKey("job_descriptions.id"), index=True)
    content_type: Mapped[ContentType] = mapped_column(sa.Enum(ContentType), nullable=False)
    content_text: Mapped[str] = mapped_column(sa.Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), nullable=False)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[uuid.UUID] = mapped_column(sa.Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID | None] = mapped_column(sa.ForeignKey("users.id"), index=True)
    action: Mapped[str] = mapped_column(sa.String(100), nullable=False)
    resource_type: Mapped[str] = mapped_column(sa.String(100), nullable=False)
    resource_id: Mapped[uuid.UUID | None] = mapped_column(sa.Uuid(as_uuid=True))
    ip_address: Mapped[str | None] = mapped_column(sa.String(64))
    user_agent: Mapped[str | None] = mapped_column(sa.String(512))
    metadata_: Mapped[dict] = mapped_column("metadata", sa.JSON, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), nullable=False)
