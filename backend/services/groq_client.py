import json
import re

from groq import Groq

from config import settings
from schemas import AnalysisResult

client = Groq(api_key=settings.groq_api_key)

MODEL = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = """You are a resume analysis assistant.

You will be given a resume and a job description. Compare them and respond
with ONLY a valid JSON object — no markdown code fences, no commentary, no
explanation before or after. The JSON object must have exactly these fields:

{
  "match_score": <integer 0-100, how well the resume matches the job description>,
  "matched_keywords": [<list of important skills/keywords present in both>],
  "missing_keywords": [<list of important skills/keywords in the job description but missing from the resume>],
  "summary": "<2-3 sentence plain-English summary of the overall fit>",
  "suggested_bullets": [<3-5 rewritten resume bullet points tailored to this job description>]
}

Respond with the JSON object only.
"""


def _strip_code_fences(text: str) -> str:
    """Llama models sometimes wrap JSON in ```json ... ``` fences even when
    told not to. Strip those before parsing."""
    text = text.strip()
    match = re.match(r"^```(?:json)?\s*(.*?)\s*```$", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text


def analyze_resume(resume_text: str, jd_text: str) -> AnalysisResult:
    user_message = f"""RESUME:
{resume_text}

JOB DESCRIPTION:
{jd_text}
"""

    response = client.chat.completions.create(
        model=MODEL,
        temperature=0.3,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message},
        ],
    )

    raw_content = response.choices[0].message.content
    cleaned = _strip_code_fences(raw_content)

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as exc:
        raise ValueError(
            f"Groq did not return valid JSON. Raw response: {raw_content!r}"
        ) from exc

    return AnalysisResult(**data)