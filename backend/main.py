from fastapi import FastAPI, File, Form, HTTPException, UploadFile

from schemas import AnalysisResult
from services.extract import extract_text
from services.groq_client import analyze_resume

app = FastAPI(title="Cvette API", description="Match your resume. Land the interview.")


@app.get("/health")
def health():
    return {"status": "ok"}


async def _resolve_text(label: str, text: str | None, file: UploadFile | None) -> str:
    """Exactly one of text or file must be provided for a given field."""
    has_text = bool(text and text.strip())
    has_file = file is not None and file.filename

    if has_text and has_file:
        raise HTTPException(
            status_code=400,
            detail=f"Provide either {label} text or a {label} file, not both.",
        )
    if not has_text and not has_file:
        raise HTTPException(
            status_code=400,
            detail=f"Provide either {label} text or a {label} file.",
        )

    if has_file:
        return await extract_text(file)
    return text.strip()


@app.post("/analyze", response_model=AnalysisResult)
async def analyze(
    resume_text: str | None = Form(None),
    resume_file: UploadFile | None = File(None),
    jd_text: str | None = Form(None),
    jd_file: UploadFile | None = File(None),
):
    resolved_resume = await _resolve_text("resume", resume_text, resume_file)
    resolved_jd = await _resolve_text("job description", jd_text, jd_file)

    if len(resolved_resume) < 20:
        raise HTTPException(status_code=400, detail="Resume text is too short to analyze.")
    if len(resolved_jd) < 20:
        raise HTTPException(status_code=400, detail="Job description text is too short to analyze.")

    try:
        return analyze_resume(resolved_resume, resolved_jd)
    except ValueError as exc:
        raise HTTPException(status_code=502, detail=str(exc))