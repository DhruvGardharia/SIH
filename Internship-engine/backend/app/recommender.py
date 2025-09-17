from typing import List, Dict, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import re

def _normalize_tokens(items: List[str]) -> str:
    # Clean and join items for vectorization
    cleaned = []
    for x in items:
        x = x.strip().lower()
        x = re.sub(r"[^a-z0-9+.# ]+", " ", x)  # keep tech-ish tokens
        cleaned.append(x)
    return " ".join(cleaned)

class Recommender:
    def __init__(self, internships: List[Dict]):
        self.internships = internships
        self.corpus = [f"{it['_title_lc']} {it['_skills_text']} {it['_sector_lc']}" for it in internships]
        self.vectorizer = TfidfVectorizer(ngram_range=(1,2), min_df=1)
        self.matrix = self.vectorizer.fit_transform(self.corpus)

    def recommend(self, education: str, skills: List[str], sector_interests: List[str], location: str, top_n: int = 5):
        # Build user query text (skills + sectors + education words)
        user_text = " ".join([education.lower(), _normalize_tokens(skills), _normalize_tokens(sector_interests)]).strip()
        if not user_text:
            user_text = "internship general"
        user_vec = self.vectorizer.transform([user_text])
        sim = cosine_similarity(user_vec, self.matrix).flatten()

        # Soft filters with additive bonuses
        loc = (location or "").lower().strip()
        sectors = [s.lower().strip() for s in sector_interests]

        scores = []
        for idx, it in enumerate(self.internships):
            score = float(sim[idx])

            # Sector match bonus
            if sectors:
                if it["_sector_lc"] in sectors:
                    score += 0.10
                else:
                    # partial sector overlap words
                    if any(s in it["_sector_lc"] for s in sectors):
                        score += 0.05

            # Location bonus (exact or partial)
            if loc:
                if loc == it["_location_lc"]:
                    score += 0.10
                elif loc and (loc in it["_location_lc"] or it["_location_lc"] in loc):
                    score += 0.05

            # If internship mentions any of the user's skills in title/skills, tiny boost
            if skills:
                skill_hits = sum(1 for s in skills if s.lower() in (it["_skills_text"] + " " + it["_title_lc"]))
                score += min(0.05 * skill_hits, 0.15)

            scores.append((idx, score))

        scores.sort(key=lambda x: x[1], reverse=True)
        top = scores[:top_n]
        out = []
        for idx, s in top:
            it = self.internships[idx]
            out.append({
                "id": it["id"],
                "title": it["title"],
                "company": it["company"],
                "location": it["location"],
                "sector": it["sector"],
                "skills": it["skills"],
                "match_score": round(float(s), 4),
                "apply_url": it["apply_url"],
            })
        return out
