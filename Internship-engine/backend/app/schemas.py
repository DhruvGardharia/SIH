from pydantic import BaseModel, Field
from typing import List, Optional

class CandidateInput(BaseModel):
    education: Optional[str] = Field(default="", description="Degree or major")
    skills: List[str] = Field(default_factory=list)
    sector_interests: List[str] = Field(default_factory=list)
    location: Optional[str] = Field(default="", description="Preferred city/state")
    top_n: int = Field(default=5, ge=1, le=10)

class InternshipOut(BaseModel):
    id: str
    title: str
    company: str
    location: str
    sector: str
    skills: List[str]
    match_score: float
    apply_url: str
