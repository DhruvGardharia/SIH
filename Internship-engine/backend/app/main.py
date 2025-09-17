import json
import os
import re
from typing import List, Dict
import numpy as np
from fastapi import FastAPI
from fastapi import Body, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from openai import OpenAI
import requests
import hashlib
from collections import OrderedDict

# ------------------------------
# Paths & Data Loading
# ------------------------------
DATA_PATH = os.path.join(os.path.dirname(__file__), "internships.json")
USER_PATH = os.path.join(os.path.dirname(__file__), "user.json")

def load_user() -> Dict:
    with open(USER_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def load_internships() -> List[Dict]:
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    for it in data:
        it["_skills_text"] = " ".join([s.lower() for s in it.get("skills", [])])
        it["_sector_lc"] = it.get("sector", "").lower()
        it["_location_lc"] = it.get("location", "").lower()
        it["_title_lc"] = it.get("title", "").lower()
        # Weighted blob to emphasize important fields (title > skills > sector/location)
        it["text_blob"] = f"{it['_title_lc']} {it['_skills_text']} {it['_sector_lc']} {it['_location_lc']}"
        it["weighted_blob"] = (
            (it["_title_lc"] + " ") * 3 +
            (it["_skills_text"] + " ") * 2 +
            it["_sector_lc"] + " " +
            it["_location_lc"]
        ).strip()
    return data

# ------------------------------
# Helper
# ------------------------------
def _normalize_tokens(items: List[str]) -> str:
    cleaned = []
    for x in items:
        x = x.strip().lower()
        x = re.sub(r"[^a-z0-9+.# ]+", " ", x)
        cleaned.append(x)
    return " ".join(cleaned)

def _expand_skill_terms(skills: List[str]) -> List[str]:
    # Minimal synonym expansion to improve recall without extra deps
    synonym_map = {
        "react": ["react", "reactjs", "react.js", "frontend"],
        "html": ["html", "html5", "frontend"],
        "css": ["css", "css3", "frontend"],
        "express": ["express", "expressjs", "express.js", "node", "node.js"],
        "javascript": ["javascript", "js"],
        "python": ["python", "py"],
        "machine learning": ["machine learning", "ml", "ai"],
        "data analysis": ["data analysis", "analytics"],
        "sql": ["sql", "postgres", "mysql"],
        "cloud": ["cloud", "aws", "gcp", "azure"],
        "kubernetes": ["kubernetes", "k8s"],
    }
    expanded: List[str] = []
    for s in skills:
        key = s.lower().strip()
        expanded.extend(synonym_map.get(key, [key]))
    return list(dict.fromkeys(expanded))  # de-duplicate preserving order

def _count_skill_hits(user_skills: List[str], it: Dict) -> int:
    haystack = (it.get("_skills_text", "") + " " + it.get("_title_lc", "")).lower()
    return sum(1 for s in user_skills if s.lower() in haystack)

def _is_remote_location(loc_lc: str) -> bool:
    return (
        ("remote" in loc_lc)
        or ("work from home" in loc_lc)
        or ("wfh" in loc_lc)
        or ("hybrid" in loc_lc)
    )

# ------------------------------
# TF-IDF Recommender
# ------------------------------
class Recommender:
    def __init__(self, internships: List[Dict]):
        self.internships = internships
        self.corpus = [it.get("weighted_blob") or it["text_blob"] for it in internships]
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1,3),
            min_df=1,
            max_df=0.9,
            stop_words="english",
            sublinear_tf=True,
        )
        self.matrix = self.vectorizer.fit_transform(self.corpus)

    def recommend(self, education: str, skills: List[str], sector_interests: List[str], location: str, top_n: int = 10, preferences: Dict = None, career_goals: str = ""):
        # Expand skills/sectors and include preference/career tokens in the query text
        expanded_skills = _expand_skill_terms(skills)
        prefers_remote = bool((preferences or {}).get("remote", False))
        remote_tokens = ["remote", "work from home", "wfh", "hybrid"] if prefers_remote else []
        career_tokens = []
        if career_goals:
            cg = career_goals.lower()
            if any(k in cg for k in ["health", "healthcare", "biotech", "medical", "medtech"]):
                career_tokens.extend(["health", "healthcare", "biotech", "medical", "medtech"])
        user_text = " ".join([
            education.lower(),
            _normalize_tokens(expanded_skills),
            _normalize_tokens(sector_interests),
            _normalize_tokens(remote_tokens + career_tokens)
        ]).strip()
        if not user_text:
            user_text = "internship general"
        user_vec = self.vectorizer.transform([user_text])
        sim = cosine_similarity(user_vec, self.matrix).flatten()

        loc = (location or "").lower().strip()
        sectors = [s.lower().strip() for s in sector_interests]
        prefers_remote = bool((preferences or {}).get("remote", False))
        career_goals_lc = (career_goals or "").lower()
        cares_health = any(k in career_goals_lc for k in ["health", "healthcare", "biotech", "medical", "medtech"]) if career_goals_lc else False

        scores = []
        for idx, it in enumerate(self.internships):
            score = float(sim[idx])
            if sectors:
                if it["_sector_lc"] in sectors:
                    score += 0.20  # prioritize sector exact match
                elif any(s in it["_sector_lc"] for s in sectors):
                    score += 0.10  # higher weight for partial sector overlap
            if loc:
                if loc == it["_location_lc"]:
                    score += 0.10
                elif loc in it["_location_lc"] or it["_location_lc"] in loc:
                    score += 0.05
            # Stronger emphasis on direct skill overlap
            skill_hits = sum(1 for s in skills if s.lower() in (it["_skills_text"] + " " + it["_title_lc"]))
            score += min(0.12 * skill_hits, 0.48)
            # Remote preference bonus/penalty
            if prefers_remote:
                is_remote = ("remote" in it["_location_lc"]) or ("work from home" in it["_location_lc"]) or ("wfh" in it["_location_lc"]) or ("hybrid" in it["_location_lc"])  # lenient
                if is_remote:
                    score += 0.12
                else:
                    score -= 0.08
            # Healthcare/biotech keyword bonus when goals mention healthcare
            if cares_health:
                text = it["_title_lc"] + " " + it["_sector_lc"]
                if any(k in text for k in ["health", "healthcare", "bio", "biotech", "medical", "medtech", "clinic", "hospital"]):
                    score += 0.08
            scores.append((idx, score))

        scores.sort(key=lambda x: x[1], reverse=True)
        top = scores[:top_n]
        return [self.internships[idx] for idx, _ in top]

# ------------------------------
# Embeddings & Similarity
# ------------------------------
OPENAI_API_KEY = "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"
XAI_API_KEY = os.getenv("XAI_API_KEY", "")
XAI_BASE_URL = os.getenv("XAI_BASE_URL", "https://api.x.ai/v1")
XAI_MODEL = os.getenv("XAI_MODEL", "grok-2-latest")
client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

# ------------------------------
# Utilities
# ------------------------------
def _extract_json(text: str):
    try:
        return json.loads(text)
    except Exception:
        pass
    # Strip common markdown code fences
    stripped = text.strip()
    if stripped.startswith("```") and stripped.endswith("```"):
        lines = [ln for ln in stripped.splitlines() if not ln.startswith("```")]
        candidate = "\n".join(lines).strip()
        try:
            return json.loads(candidate)
        except Exception:
            pass
    # Try to extract the first JSON array
    try:
        start = text.find("[")
        end = text.rfind("]")
        if start != -1 and end != -1 and end > start:
            candidate = text[start:end+1]
            return json.loads(candidate)
    except Exception:
        pass
    # Try object wrapper {"items": [...]}
    try:
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            obj = json.loads(text[start:end+1])
            if isinstance(obj, dict):
                for key in ("items", "data", "result", "recommendations"):
                    if key in obj and isinstance(obj[key], list):
                        return obj[key]
    except Exception:
        pass
    return None
def embed_text(text: str) -> np.ndarray:
    if not client:
        raise RuntimeError("OpenAI client is not configured. Set OPENAI_API_KEY.")
    resp = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return np.array(resp.data[0].embedding, dtype=np.float32).reshape(1, -1)

def rerank_by_embedding(user: Dict, candidates: List[Dict], top_k: int = 5) -> List[Dict]:
    if not candidates:
        return []
    top_k = min(top_k, len(candidates))
    try:
        user_text = " ".join([user.get("education", "")] + user.get("skills", []) + user.get("sector_interests", []))
        user_emb = embed_text(user_text)  # shape (1, d)
        cand_embs = np.vstack([embed_text(it["text_blob"]) for it in candidates])  # (n, d)
        # Cosine similarity
        user_norm = np.linalg.norm(user_emb)
        cand_norms = np.linalg.norm(cand_embs, axis=1)
        sims = (cand_embs @ user_emb.T).flatten() / (cand_norms * (user_norm + 1e-9) + 1e-9)
        order = np.argsort(-sims)[:top_k]
        return [candidates[i] for i in order]
    except Exception:
        # Fallback: return TF-IDF order if embeddings unavailable
        return candidates[:top_k]

# ------------------------------
# GPT Re-ranker
# ------------------------------
def llm_refine(user: Dict, internships: List[Dict]) -> List[Dict]:
    print("LLM refining", len(internships), "internships for user", user.get("name", "N/A"))
    print(user)
    print(internships)
    prompt = f"""
    You are a career advisor AI.
    User profile: {json.dumps(user)}
    Internship list: {json.dumps(internships)}
    Task:
    - Re-rank based on user fit
    - For each internship, add a short explanation 
    - Focus on skills, sector interests, location, and career goals
    - Only return internships that are a good match
    - Ensure the output is valid JSON
    - Return ONLY a JSON array (no text) where each item has fields:
      id, title, company, location, sector, skills, apply_url, explanation
      
    """
    try:
        content_str = None
        # Prefer xAI Grok if configured
        if XAI_API_KEY:
            headers = {
                "Authorization": f"Bearer {XAI_API_KEY}",
                "Content-Type": "application/json",
            }
            payload = {
                "model": XAI_MODEL,
                "messages": [
                    {"role": "system", "content": "You are a career advisor AI."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.4
            }
            r = requests.post(f"{XAI_BASE_URL}/chat/completions", headers=headers, json=payload, timeout=60)
            r.raise_for_status()
            data = r.json()
            content_str = data["choices"][0]["message"]["content"]
        elif client:
            resp = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a career advisor AI."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.4,
            )
            content_str = resp.choices[0].message.content
        else:
            raise RuntimeError("No LLM configured. Set XAI_API_KEY or OPENAI_API_KEY.")

        if not isinstance(content_str, str) or not content_str.strip():
            raise ValueError("Empty response from LLM")
        refined = _extract_json(content_str)
        if refined is None:
            raise ValueError("Could not parse LLM JSON response")
        return refined
    except Exception as e:
        print("LLM fallback:", e)
        return [{**it, "explanation": f"Matched with {user['name']}'s profile"} for it in internships]

# ------------------------------
# FastAPI App
# ------------------------------
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

INTERNSHIPS = load_internships()
RECO = Recommender(INTERNSHIPS)

# ------------------------------
# Simple LRU Cache for recommendations
# ------------------------------
class LRUCache:
    def __init__(self, capacity: int = 64):
        self.capacity = capacity
        self.store: OrderedDict[str, List[Dict]] = OrderedDict()

    def get(self, key: str):
        if key not in self.store:
            return None
        self.store.move_to_end(key)
        return self.store[key]

    def set(self, key: str, value: List[Dict]):
        self.store[key] = value
        self.store.move_to_end(key)
        if len(self.store) > self.capacity:
            self.store.popitem(last=False)

REC_CACHE = LRUCache(capacity=100)

def _user_cache_key(user: Dict, top_n: int) -> str:
    # Use a stable hash of user fields that affect results
    payload = {
        "education": user.get("education", ""),
        "skills": user.get("skills", []),
        "sector_interests": user.get("sector_interests", []),
        "location": user.get("location", ""),
        "preferences": user.get("preferences", {}),
        "career_goals": user.get("career_goals", ""),
        "top_n": top_n,
    }
    s = json.dumps(payload, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(s.encode("utf-8")).hexdigest()

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/user")
def get_user():
    # Always provide the latest user profile from disk
    return load_user()

@app.get("/internships")
def get_internships():
    return INTERNSHIPS[:10]

def _compute_recommendations(user: Dict, top_n: int = 5):
    cache_key = _user_cache_key(user, top_n)
    cached = REC_CACHE.get(cache_key)
    if cached is not None:
        print("Serving from cache for user")
        return cached
    # Step 1: TF-IDF coarse filter (retrieve a larger candidate pool)
    coarse = RECO.recommend(
        education=user.get("education", ""),
        skills=user.get("skills", []),
        sector_interests=user.get("sector_interests", []),
        location=user.get("location", ""),
        top_n=max(25, top_n * 5),
        preferences=user.get("preferences", {}),
        career_goals=user.get("career_goals", "")
    )
    # Step 1.5: Strict pre-filter based on skills/sector and preferences
    user_skills = user.get("skills", [])
    sectors = [s.lower().strip() for s in user.get("sector_interests", [])]
    prefers_remote = bool(user.get("preferences", {}).get("remote", False))
    avoid_devops = "not seeking roles related to devops" in (user.get("career_goals", "").lower())
    finance_focus = any(k in (user.get("career_goals", "").lower()) for k in ["finance", "fintech", "risk", "fraud", "trading", "credit", "aml"]) 

    filtered = []
    for it in coarse:
        sector_ok = (not sectors) or (it.get("_sector_lc", "") in sectors) or any(s in it.get("_sector_lc", "") for s in sectors)
        skill_hits = _count_skill_hits(user_skills, it)
        # Enforce at least 1 skill overlap or strong sector match
        if not sector_ok and skill_hits == 0:
            continue
        # Apply DevOps/cloud penalty
        if avoid_devops:
            text = (it.get("_title_lc", "") + " " + it.get("_skills_text", "") + " " + it.get("_sector_lc", "")).lower()
            if any(k in text for k in ["devops", "kubernetes", "k8s", "docker", "cloud", "infrastructure"]):
                continue
        # Prefer remote if requested
        if prefers_remote and not _is_remote_location(it.get("_location_lc", "")):
            # keep only if there is strong skill overlap (>=2)
            if skill_hits < 2:
                continue
        # Finance preference boost: keep items mentioning finance if found
        if finance_focus:
            text = (it.get("_title_lc", "") + " " + it.get("_sector_lc", "")).lower()
            if any(k in text for k in ["finance", "fintech", "bank", "risk", "fraud", "credit", "aml"]):
                filtered.append(it)
                continue
        filtered.append(it)

    if not filtered:
        filtered = coarse[:top_n]
    # Step 2: Embedding-based re-rank on the TF-IDF candidates
    reranked = rerank_by_embedding(user, filtered, top_k=top_n)
    # Step 3: LLM refinement with explanations
    refined = llm_refine(user, reranked)
    REC_CACHE.set(cache_key, refined)
    return refined

@app.get("/recommendations")
def get_recommendations(top_n: int = 5):
    user = load_user()
    return _compute_recommendations(user, top_n)

@app.post("/recommendations")
def post_recommendations(payload: Dict = Body(...)):
    # Expecting a JSON body with optional top_n and user profile fields
    top_n = int(payload.get("top_n", 5))
    # Normalize expected keys with safe defaults
    user = {
        "name": payload.get("name", ""),
        "education": payload.get("education", ""),
        "skills": payload.get("skills", []),
        "sector_interests": payload.get("sector_interests", []),
        "location": payload.get("location", ""),
        "preferences": payload.get("preferences", {}),
        "career_goals": payload.get("career_goals", ""),
    }
    return _compute_recommendations(user, top_n)
