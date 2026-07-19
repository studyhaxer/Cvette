import { useState } from "react";
import { downloadReport } from "../api/report";

/**
 * ⚠️ ASSUMPTION: this expects the /analyze response to look like:
 * {
 *   match_score: number,          // e.g. 0-100
 *   missing_keywords: string[],
 *   summary: string,
 *   suggested_bullets: string[]
 * }
 * Adjust the destructuring below to match your actual Pydantic schema
 * if the field names differ (check schemas.py on the backend).
 */
export default function ResultsPanel({ results }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  if (!results) return null;

  const {
    match_score,
    missing_keywords = [],
    summary,
    suggested_bullets = [],
  } = results;

  async function handleDownload() {
    setDownloadError("");
    setDownloading(true);
    try {
      await downloadReport(results);
    } catch (err) {
      console.error(err);
      setDownloadError("Couldn't generate the PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="results">
      <div className="results__score">
        <div className="results__score-num">{match_score}%</div>
        <div className="results__score-label">Match Score</div>
      </div>

      <div className="results__download">
        <button
          type="button"
          className="results__download-btn"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? "Generating PDF..." : "📄 Download PDF Report"}
        </button>
        {downloadError && <div className="app__error">{downloadError}</div>}
      </div>

      {summary && (
        <div className="results__block">
          <h4>Summary</h4>
          <p>{summary}</p>
        </div>
      )}

      {missing_keywords.length > 0 && (
        <div className="results__block">
          <h4>Missing Keywords</h4>
          <div className="chip-row">
            {missing_keywords.map((kw) => (
              <span key={kw} className="chip">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {suggested_bullets.length > 0 && (
        <div className="results__block">
          <h4>Suggested Bullet Points</h4>
          <ul className="bullet-list">
            {suggested_bullets.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}