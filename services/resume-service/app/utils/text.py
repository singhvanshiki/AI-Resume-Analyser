from __future__ import annotations

import re
import unicodedata
from collections import Counter

SECTION_PATTERNS = {
    "summary": [r"summary", r"professional summary", r"profile"],
    "skills": [r"skills", r"technical skills", r"core competencies"],
    "experience": [r"experience", r"work experience", r"professional experience"],
    "education": [r"education", r"academic background"],
    "projects": [r"projects", r"project experience"],
    "certifications": [r"certifications", r"licenses"],
}


def normalize_text(text: str) -> str:
    text = unicodedata.normalize("NFKC", text)
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    counts = Counter(lines)
    cleaned_lines = [line for line in lines if counts[line] < 3 or len(line) > 80]
    normalized = "\n".join(cleaned_lines)
    normalized = re.sub(r"[ \t]+", " ", normalized).strip()
    return normalized


def detect_sections(text: str) -> dict:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    sections: dict[str, str] = {}
    current = "summary"
    buffer: list[str] = []

    def flush(section_name: str, content: list[str]) -> None:
        if content:
            sections[section_name] = " ".join(content).strip()

    for line in lines:
        lowered = line.lower().strip(":")
        matched_section = None
        for section, patterns in SECTION_PATTERNS.items():
            if any(re.fullmatch(pattern, lowered) for pattern in patterns):
                matched_section = section
                break
        if matched_section:
            flush(current, buffer)
            current = matched_section
            buffer = []
        else:
            buffer.append(line)
    flush(current, buffer)

    if not sections:
        sections["summary"] = text
    return sections
