import { useState } from "react";

/**
 * Paste/upload toggle for a single field (resume or JD).
 * Lifts state up via onChange so App.jsx owns the source of truth.
 */
export default function TextOrFileInput({ label, accept, onChange }) {
  const [mode, setMode] = useState("paste");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");

  function handleModeSwitch(newMode) {
    setMode(newMode);
    // Clear the other input's value when switching, so we never
    // accidentally submit both text and a file at once.
    if (newMode === "paste") {
      onChange({ mode: "paste", text, file: null });
    } else {
      onChange({ mode: "upload", text: "", file: null });
    }
  }

  function handleTextChange(e) {
    setText(e.target.value);
    onChange({ mode: "paste", text: e.target.value, file: null });
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    setFileName(file ? file.name : "");
    onChange({ mode: "upload", text: "", file });
  }

  return (
    <div className="input-card">
      <div className="input-card__header">
        <h3>{label}</h3>
        <div className="toggle">
          <button
            type="button"
            className={mode === "paste" ? "toggle__btn toggle__btn--active" : "toggle__btn"}
            onClick={() => handleModeSwitch("paste")}
          >
            Paste
          </button>
          <button
            type="button"
            className={mode === "upload" ? "toggle__btn toggle__btn--active" : "toggle__btn"}
            onClick={() => handleModeSwitch("upload")}
          >
            Upload
          </button>
        </div>
      </div>

      {mode === "paste" ? (
        <textarea
          className="input-card__textarea"
          placeholder={`Paste ${label.toLowerCase()} text here...`}
          value={text}
          onChange={handleTextChange}
        />
      ) : (
        <label className="input-card__dropzone">
          <input type="file" accept={accept} onChange={handleFileChange} hidden />
          {fileName ? (
            <span>📄 {fileName}</span>
          ) : (
            <span>Click to upload (PDF or DOCX)</span>
          )}
        </label>
      )}
    </div>
  );
}