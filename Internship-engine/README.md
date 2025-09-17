# PM Internship Recommendation Engine (Lightweight Prototype)

A simple, mobile-friendly prototype for recommending top 3–5 internships to candidates of the PM Internship Scheme using a hybrid (rule-based + TF-IDF) approach.

## Tech Stack
- **Backend:** FastAPI (Python), scikit-learn (TF-IDF), simple JSON dataset
- **Frontend:** React (Vite), i18next (EN/HI), responsive CSS
- **Deployment:** Uvicorn; optional Dockerfile included for backend

---
## Quick Start (Local)

### 1) Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API endpoints:
- `GET /health`
- `GET /internships`
- `POST /recommendations` (body below)

**Example request body:**
```json
{
  "education": "B.Sc. Computer Science",
  "skills": ["HTML", "CSS", "JavaScript"],
  "sector_interests": ["Information Technology"],
  "location": "Maharashtra",
  "top_n": 5
}
```

### 2) Frontend
```bash
cd frontend
npm install
cp .env.example .env   # edit API base if needed
npm run dev
```

Open http://localhost:5173

> Use the language switcher (EN/HI) in the header.

---
## How Recommendations Work (ML-Light)
1. TF-IDF vectorization of internship titles + skills + sector (bigrams included).
2. Candidate query: education + skills + sector interests -> vectorized.
3. Cosine similarity for base score.
4. Soft rule-based bonuses for sector/location matches and exact skill hits.
5. Top-N (default 5) returned to UI.

---
## Integration Notes (Portal-Friendly)
- The backend exposes `POST /recommendations` suitable for server-to-server or client calls.
- Easily replace `internships.json` with DB source or API ingestion.
- Add simple JWT middleware if the PM portal requires auth.

---
## Optional Enhancements
- Add voice input in UI (Web Speech API) for low literacy users.
- Add PWA manifest + service worker for basic offline UX.
- Add synonyms/stemming via spaCy/WordNet for broader skill matching.
- Add ranking model (e.g., Logistic Regression) using historical click/apply data.

## Docker (Backend)
```bash
cd backend
docker build -t pm-reco-backend:latest .
docker run -p 8000:8000 pm-reco-backend:latest
```

---
## File Tree
```
pm-internship-reco/
├─ backend/
│  ├─ app/
│  │  ├─ main.py
│  │  ├─ schemas.py
│  │  ├─ data_loader.py
│  │  ├─ recommender.py
│  │  └─ internships.json
│  ├─ requirements.txt
│  └─ Dockerfile
└─ frontend/
   ├─ src/
   │  ├─ App.jsx
   │  ├─ main.jsx
   │  ├─ styles.css
   │  └─ i18n/
   │     ├─ index.js
   │     ├─ en.json
   │     └─ hi.json
   ├─ index.html
   ├─ package.json
   ├─ vite.config.js
   └─ .env.example
```
