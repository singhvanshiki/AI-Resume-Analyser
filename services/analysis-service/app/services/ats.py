from __future__ import annotations

import re
from dataclasses import dataclass

import numpy as np

COMMON_SKILLS = {
    "python",
    "java",
    "javascript",
    "typescript",
    "sql",
    "postgresql",
    "mysql",
    "mongodb",
    "redis",
    "docker",
    "kubernetes",
    "aws",
    "gcp",
    "azure",
    "fastapi",
    "django",
    "flask",
    "react",
    "next.js",
    "node",
    "celery",
    "linux",
    "git",
    "ci/cd",
    "terraform",
    "kafka",
    "spark",
    "pandas",
    "numpy",
    "scikit-learn",
    "nlp",
    "llm",
    "openai",
    "openrouter",
    "testing",
    "pytest",
    "agile",
    "scrum",
}


@dataclass
class ATSResult:
    score: float
    category_scores: dict
    explanation: str
    missing_skills: list[str]
    recommendations: list[str]
    semantic_similarity: float


def tokenize(text: str) -> list[str]:
    return re.findall(r"[a-zA-Z]{2,}", text.lower())


def keyword_overlap(resume: str, jd: str) -> float:
    r_tokens = set(tokenize(resume))
    j_tokens = set(tokenize(jd))
    if not r_tokens or not j_tokens:
        return 0.0
    return len(r_tokens & j_tokens) / len(r_tokens | j_tokens)


def extract_skills(text: str) -> set[str]:
    lowered = text.lower()
    return {skill for skill in COMMON_SKILLS if skill in lowered}


def section_completeness(sections: dict) -> float:
    required = {"summary", "skills", "experience", "education"}
    present = {key for key in sections.keys() if key in required}
    return len(present) / len(required)


def experience_relevance(experience_text: str, jd_text: str) -> float:
    return keyword_overlap(experience_text, jd_text)


def education_relevance(education_text: str) -> float:
    degrees = ["bachelor", "master", "phd", "b.sc", "m.sc", "mba"]
    text = education_text.lower()
    return 1.0 if any(deg in text for deg in degrees) else 0.5 if text else 0.0


def cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    a = np.array(vec_a)
    b = np.array(vec_b)
    if a.size == 0 or b.size == 0:
        return 0.0
    denom = (np.linalg.norm(a) * np.linalg.norm(b))
    if denom == 0:
        return 0.0
    return float(np.dot(a, b) / denom)


def fallback_similarity(resume: str, jd: str) -> float:
    r_tokens = tokenize(resume)
    j_tokens = tokenize(jd)
    if not r_tokens or not j_tokens:
        return 0.0
    vocab = list(set(r_tokens + j_tokens))
    r_vec = np.array([r_tokens.count(term) for term in vocab])
    j_vec = np.array([j_tokens.count(term) for term in vocab])
    denom = np.linalg.norm(r_vec) * np.linalg.norm(j_vec)
    if denom == 0:
        return 0.0
    return float(np.dot(r_vec, j_vec) / denom)


def score_resume(
    resume_text: str,
    job_text: str,
    sections: dict,
    resume_embedding: list[float] | None,
    jd_embedding: list[float] | None,
) -> ATSResult:
    keyword_score = keyword_overlap(resume_text, job_text)
    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_text)
    skill_overlap = 0.0
    missing_skills = []
    if job_skills:
        skill_overlap = len(resume_skills & job_skills) / len(job_skills)
        missing_skills = sorted(list(job_skills - resume_skills))

    completeness = section_completeness(sections)
    experience_score = experience_relevance(sections.get("experience", ""), job_text)
    education_score = education_relevance(sections.get("education", ""))

    if resume_embedding and jd_embedding:
        semantic_similarity = cosine_similarity(resume_embedding, jd_embedding)
    else:
        semantic_similarity = fallback_similarity(resume_text, job_text)

    weights = {
        "keyword": 0.25,
        "semantic": 0.25,
        "skills": 0.2,
        "experience": 0.15,
        "education": 0.1,
        "completeness": 0.05,
    }

    final_score = (
        keyword_score * weights["keyword"]
        + semantic_similarity * weights["semantic"]
        + skill_overlap * weights["skills"]
        + experience_score * weights["experience"]
        + education_score * weights["education"]
        + completeness * weights["completeness"]
    )
    final_score = round(final_score * 100, 2)

    category_scores = {
        "keyword_overlap": round(keyword_score * 100, 2),
        "semantic_similarity": round(semantic_similarity * 100, 2),
        "skill_overlap": round(skill_overlap * 100, 2),
        "experience_relevance": round(experience_score * 100, 2),
        "education_relevance": round(education_score * 100, 2),
        "section_completeness": round(completeness * 100, 2),
    }

    recommendations = []
    if missing_skills:
        recommendations.append("Add missing skills that appear in the job description.")
    if completeness < 1:
        recommendations.append("Ensure the resume includes summary, skills, experience, and education sections.")
    if experience_score < 0.3:
        recommendations.append("Expand experience details to align with job requirements.")

    explanation = "ATS score blends keyword overlap, semantic similarity, skills, and section quality."

    return ATSResult(
        score=final_score,
        category_scores=category_scores,
        explanation=explanation,
        missing_skills=missing_skills,
        recommendations=recommendations,
        semantic_similarity=semantic_similarity,
    )
