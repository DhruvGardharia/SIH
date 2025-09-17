import json
import os
from typing import List, Dict

DATA_PATH = os.path.join(os.path.dirname(__file__), "internships.json")

def load_internships() -> List[Dict]:
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    # Normalize: ensure lowercased helper fields
    for it in data:
        it["_skills_text"] = " ".join([s.lower() for s in it.get("skills", [])])
        it["_sector_lc"] = it.get("sector", "").lower()
        it["_location_lc"] = it.get("location", "").lower()
        it["_title_lc"] = it.get("title", "").lower()
    return data
