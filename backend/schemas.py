from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    resume_text: str = Field(..., min_length=20, description="Plain text resume content")
    jd_text: str = Field(..., min_length=20, description="Plain text job description content")


class AnalysisResult(BaseModel):
    match_score: int = Field(..., ge=0, le=100)
    matched_keywords: list[str]
    missing_keywords: list[str]
    summary: str
    suggested_bullets: list[str]