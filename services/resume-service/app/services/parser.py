from __future__ import annotations

import io
from typing import Tuple

from pdfminer.high_level import extract_text
from pdfminer.layout import LAParams
from pypdf import PdfReader
from docx import Document

from app.utils.text import detect_sections, normalize_text


def extract_text_pdf(content: bytes) -> str:
    try:
        return extract_text(io.BytesIO(content), laparams=LAParams())
    except Exception:
        reader = PdfReader(io.BytesIO(content))
        pages = []
        for page in reader.pages:
            try:
                pages.append(page.extract_text() or "")
            except Exception:
                continue
        return "\n".join(pages)


def extract_text_docx(content: bytes) -> str:
    doc = Document(io.BytesIO(content))
    return "\n".join([p.text for p in doc.paragraphs])


def extract_text_txt(content: bytes) -> str:
    return content.decode("utf-8", errors="ignore")


def parse_resume(content: bytes, content_type: str) -> Tuple[str, dict]:
    if content_type == "application/pdf":
        raw = extract_text_pdf(content)
    elif content_type in {"application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"}:
        try:
            raw = extract_text_docx(content)
        except Exception:
            raw = extract_text_txt(content)
    else:
        raw = extract_text_txt(content)
    normalized = normalize_text(raw)
    sections = detect_sections(normalized)
    return normalized, sections
