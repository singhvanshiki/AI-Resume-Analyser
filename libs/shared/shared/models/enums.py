from enum import Enum


class RoleName(str, Enum):
    student = "student"
    recruiter = "recruiter"
    admin = "admin"


class SectionType(str, Enum):
    summary = "summary"
    skills = "skills"
    experience = "experience"
    education = "education"
    projects = "projects"
    certifications = "certifications"
    other = "other"


class ContentType(str, Enum):
    ats_analysis = "ats_analysis"
    rewrite = "rewrite"
    interview_questions = "interview_questions"
    cover_letter = "cover_letter"
    recruiter_summary = "recruiter_summary"
    skill_extraction = "skill_extraction"


class SkillMatchType(str, Enum):
    exact = "exact"
    related = "related"
    missing = "missing"
