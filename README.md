# SIH Internship Platform – End-to-end Prototype

This repository contains two coordinated services and a React frontend:

- `SIH-PM-INTERNSHIP/` – User platform
  - Node/Express backend with MongoDB for auth, onboarding, OCR draft + profile
  - React (Vite + Tailwind) frontend
- `Internship-engine/` – Python FastAPI recommender microservice

## High-level user flow
1. Register/Login (OTP) on the user platform.
2. Build profile via onboarding (basic, education, preferences, skills/projects/certs).
3. Optionally upload resume; OCR extracts a draft that you can apply to profile.
4. Home page fetches `GET /api/user/recommendations`.
5. Node backend proxies profile → Python recommender `POST /recommendations`.
6. Recommender returns ranked internships (TF‑IDF + optional embeddings + LLM explanations).

## Services and endpoints
### Node/Express (SIH-PM-INTERNSHIP/backend)
- Auth: `/api/user/register`, `/verifyOtp/:token`, `/login`, `/logout`
- Password reset: `/forget`, `/reset-password/:token`
- Profile: `/me`, `/profile/basic`, `/profile/education`, `/profile/preferences`, `/profile/projects-certs`, `/skills`
- OCR:
  - Upload + extract: `POST /resume/extract`
  - Draft get/set/apply: `/ocr-draft` (GET/POST), `/ocr-apply` (POST)
- Recommendations proxy: `GET /recommendations?top_n=8`

### FastAPI (Internship-engine/backend/app)
- `GET /health`
- `GET /internships` – Sample list
- `GET /recommendations?top_n=5` – uses `user.json`
- `POST /recommendations` – accepts live user payload from Node

## Environment variables
Create `.env` files as needed.

Node (SIH-PM-INTERNSHIP/backend):
- `PORT=5000`
- `MONGO_URI=mongodb+srv://...`
- `JWT_SEC=...`
- `MY_GMAIL=...` and `MY_PASS=...` (or set `SKIP_EMAIL=true` for dev)
- `Cloud_Name=...`, `Cloud_Api=...`, `Cloud_Secret=...`
- `OCR_SERVICE_URL=http://localhost:8001`
- `RECO_SERVICE_URL=http://localhost:8001`

Python (Internship-engine/backend/app):
- `OPENAI_API_KEY=...` (optional, for embeddings/LLM)
- `XAI_API_KEY=...` (optional alternative for LLM)
- `XAI_BASE_URL=https://api.x.ai/v1`
- `XAI_MODEL=grok-2-latest`

## Start locally
Terminal A – Python recommender:
```
cd Internship-engine/backend
pip install -r app/requirements.txt
uvicorn app.main:app --port 8001
```

Terminal B – Node backend:
```
cd SIH-PM-INTERNSHIP/backend
npm install
npm start
```

Terminal C – React frontend:
```
cd SIH-PM-INTERNSHIP/frontend
npm install
npm run dev
```

## Frontend
Home page calls `GET /api/user/recommendations` and renders result cards. Use onboarding to improve matches.

## Notes
- For production: move all secrets to env and set secure cookie flags.
- If embeddings/LLM are disabled, the recommender still works with TF‑IDF.

