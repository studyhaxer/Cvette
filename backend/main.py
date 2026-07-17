from fastapi import FastAPI, HTTPException

from schemas import AnalyzeRequest, AnalysisResult
from services.groq_client import analyze_resume

app = FastAPI(title="Cvette API", description="Match your resume. Land the interview.")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalysisResult)
def analyze(payload: AnalyzeRequest):
    try:
        return analyze_resume(payload.resume_text, payload.jd_text)
    except ValueError as exc:
        raise HTTPException(status_code=502, detail=str(exc))