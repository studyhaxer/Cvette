import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Calls POST /report to generate and download a PDF report.
 *
 * ⚠️ ASSUMPTION: this sends the already-computed analysis results
 * (match_score, missing_keywords, summary, suggested_bullets) as JSON,
 * rather than re-uploading the resume/JD — on the theory that your
 * backend shouldn't need to call Groq a second time just to render a
 * PDF of results it already produced.
 *
 * If your actual /report route instead expects the original resume/JD
 * text or files (re-running the analysis internally), you'll need to
 * change this to send FormData like analyze.js does instead of JSON.
 * Check your report.py / router signature to confirm which it expects.
 */
export async function downloadReport(results) {
  const response = await axios.post(`${API_BASE_URL}/report`, results, {
    responseType: "blob",
  });

  // Trigger a browser download from the returned PDF blob.
  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "cvette-report.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}