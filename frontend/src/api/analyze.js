import axios from "axios";

// ⚠️ ASSUMPTION: adjust this to match wherever your FastAPI backend
// actually runs. Check your main.py / uvicorn command for the real port.
const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Calls POST /analyze with resume + job description data.
 *
 * ⚠️ ASSUMPTION: field names below (resume_text, resume_file, jd_text,
 * jd_file) are guesses based on your Day 3 plan ("exactly one of
 * text-or-file required per field"). Open your backend's /analyze route
 * (main.py or routers/analyze.py) and confirm the exact Form(...) and
 * UploadFile parameter names — FormData keys MUST match those exactly,
 * or FastAPI will silently 422 without a clear error on the frontend.
 *
 * @param {{ resumeMode: 'paste'|'upload', resumeText?: string, resumeFile?: File,
 *           jdMode: 'paste'|'upload', jdText?: string, jdFile?: File }} params
 */
export async function analyzeResume({
  resumeMode,
  resumeText,
  resumeFile,
  jdMode,
  jdText,
  jdFile,
}) {
  const formData = new FormData();

  if (resumeMode === "paste") {
    formData.append("resume_text", resumeText);
  } else {
    formData.append("resume_file", resumeFile);
  }

  if (jdMode === "paste") {
    formData.append("jd_text", jdText);
  } else {
    formData.append("jd_file", jdFile);
  }

  const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // ⚠️ ASSUMPTION: response shape below (match_score, missing_keywords,
  // summary, suggested_bullets) is a guess based on your project
  // description. Confirm against your actual Pydantic response schema
  // and adjust ResultsPanel.jsx to match if the keys differ.
  return response.data;
}