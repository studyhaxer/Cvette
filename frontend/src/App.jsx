import { useState } from "react";
import TextOrFileInput from "./components/TextOrFileInput";
import ResultsPanel from "./components/ResultsPanel";
import { analyzeResume } from "./api/analyze";
import "./App.css";

function App() {
  const [resumeData, setResumeData] = useState({ mode: "paste", text: "", file: null });
  const [jdData, setJdData] = useState({ mode: "paste", text: "", file: null });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function isReady() {
    const resumeReady =
      resumeData.mode === "paste" ? resumeData.text.trim().length > 0 : !!resumeData.file;
    const jdReady = jdData.mode === "paste" ? jdData.text.trim().length > 0 : !!jdData.file;
    return resumeReady && jdReady;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResults(null);

    if (!isReady()) {
      setError("Please provide both a resume and a job description before analyzing.");
      return;
    }

    setLoading(true);
    try {
      const data = await analyzeResume({
        resumeMode: resumeData.mode,
        resumeText: resumeData.text,
        resumeFile: resumeData.file,
        jdMode: jdData.mode,
        jdText: jdData.text,
        jdFile: jdData.file,
      });
      setResults(data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "Something went wrong analyzing your resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>Cvette</h1>
        <p>Match your resume. Land the interview.</p>
      </header>

      <form className="app__form" onSubmit={handleSubmit}>
        <div className="app__inputs">
          <TextOrFileInput
            label="Resume"
            accept=".pdf,.docx"
            onChange={(data) => setResumeData(data)}
          />
          <TextOrFileInput
            label="Job Description"
            accept=".pdf,.docx"
            onChange={(data) => setJdData(data)}
          />
        </div>

        {error && <div className="app__error">{error}</div>}

        <button type="submit" className="app__submit" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Match"}
        </button>
      </form>

      <ResultsPanel results={results} />
    </div>
  );
}

export default App;