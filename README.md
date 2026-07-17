# 🎯 Cvette

**Match your resume. Land the interview.**

Cvette is a small, public AI-powered web app that compares a resume against a job description and returns a match score, missing keywords, a short summary, and rewritten resume bullet suggestions — with a downloadable PDF report. Built as a fast, focused tool rather than a full platform: paste or upload, get results, done. No login, no saved history.

---

## 🚀 Features (planned)

### Core Analysis
- Paste resume + job description as plain text, or upload as PDF/DOCX
- AI-powered match score (0–100)
- Matched and missing keyword extraction
- Short plain-English summary of fit
- 3–5 rewritten resume bullet suggestions tailored to the job description

### Output
- On-screen results view
- Downloadable PDF report of the analysis

### Public-facing
- Fully stateless — no accounts, no saved data
- Rate-limited per IP to keep the tool sustainable on a free AI API tier

---

## 🛠 Tech Stack

### Backend
- FastAPI
- Groq API (`llama-3.3-70b-versatile`)
- `pdfplumber` (PDF text extraction)
- `python-docx` (DOCX text extraction)
- ReportLab (PDF report generation)
- `slowapi` (rate limiting)

### Frontend
- React
- Vite

### Development Tools
- Git
- GitHub
- VS Code
- Postman

---

## 📁 Project Structure

```
cvette/
├── backend/
│   ├── main.py
│   ├── config.py
│   ├── requirements.txt
│   ├── .env                 # local only — gitignored, never committed
│   ├── schemas.py
│   └── services/
│       ├── extract.py       # PDF/DOCX -> plain text
│       ├── groq_client.py   # Groq API call + prompt
│       └── report.py        # ReportLab PDF generation
├── frontend/                # Vite + React
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### Clone Repository
```bash
git clone https://github.com/studyhaxer/cvette.git
cd cvette
```

### Backend Setup

Create virtual environment
```bash
python -m venv venv
```

Activate virtual environment

**Windows**
```bash
venv\Scripts\activate
```

**Linux / macOS**
```bash
source venv/bin/activate
```

Install dependencies
```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file inside `backend/`:
```
GROQ_API_KEY=your_groq_api_key
```

**Never commit `.env`.** It's listed in `.gitignore` — double-check with `git status` that it shows as untracked before your first commit. If a real API key is ever accidentally committed, treat it as compromised: regenerate the key immediately rather than relying on removing it from history.

### Run the Backend

From `backend/`:
```bash
uvicorn main:app --reload
```

- Server: `http://127.0.0.1:8000`
- Swagger Documentation: `http://127.0.0.1:8000/docs`

### Run the Frontend

From `frontend/`:
```bash
npm install
npm run dev
```

- App: `http://localhost:5173`

---

## 🗺 Development Roadmap

### Step 1
- [x] Project scaffold (backend + frontend folder structure)

### Step 2
- [x] `/analyze` endpoint — plain text input, Groq integration, JSON response

### Step 3
- [ ] File upload support (PDF via `pdfplumber`, DOCX via `python-docx`)

### Step 4
- [ ] Frontend — input forms (paste/upload toggle), results display

### Step 5
- [ ] `/report` endpoint — PDF report generation via ReportLab, download button on frontend

### Step 6
- [ ] Deployment (Railway), rate limiting (`slowapi`), CORS configuration

---

## 📖 API Documentation

Interactive API documentation is available after running the server.

**Swagger UI**
```
/docs
```

---

## 📈 Future Improvements

- Automated testing (pytest suite)
- Docker Compose setup
- Support for additional file formats (e.g. `.txt`, `.rtf`)
- Multi-language resume support

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
```bash
git checkout -b feature/your-feature
```
3. Commit your changes
```bash
git commit -m "Add new feature"
```
4. Push to GitHub
```bash
git push origin feature/your-feature
```
5. Create a Pull Request

---

## 👤 Author

**Hafiz Atta Ur Rahman**
Backend Developer | Python | FastAPI | React

- GitHub: https://github.com/studyhaxer
- LinkedIn: https://linkedin.com/in/studyhaxer

---

## 📄 License

This project is licensed under the MIT License.

---

## ⭐ Project Status

🚧 **Day 2 — Core AI Matching Endpoint Live**

Cvette is being built incrementally and documented publicly as a build-in-public project. Follow along for daily updates as each step of the roadmap above is completed.