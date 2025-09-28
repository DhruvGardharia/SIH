

import os
import shutil
import json
import re
from datetime import datetime
from typing import List, Dict, Optional, Union
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PyPDF2 import PdfReader
from dotenv import load_dotenv
import google.generativeai as genai

# -----------------------
# Load environment variables
# -----------------------
load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")
if not API_KEY:
    raise ValueError("❌ GOOGLE_API_KEY not found in .env file")

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

# -----------------------
# FastAPI Setup
# -----------------------
app = FastAPI(title="Resume Extractor with Gemini LLM")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# -----------------------
# Pydantic Models
# -----------------------
class ProjectLinks(BaseModel):
    repo: str = ""
    demo: str = ""

class Project(BaseModel):
    name: str = ""
    role: str = ""
    description: str = ""
    techStack: List[str] = []
    highlights: List[str] = []
    links: ProjectLinks | None = None

class Education(BaseModel):
    institution: str = ""
    degree: str = ""
    location: str = ""
    startYear: Optional[int] = None
    endYear: Optional[int] = None
    year: Optional[int] = None

class Links(BaseModel):
    github: str = ""
    linkedin: str = ""
    portfolio: str = ""

class Skills(BaseModel):
    programmingLanguages: List[str] = []
    frontend: List[str] = []
    backend: List[str] = []
    realtime_and_auth: List[str] = []
    databases: List[str] = []
    ml_ai_llm: List[str] = []
    tools_platforms: List[str] = []
    concepts: List[str] = []

class Experience(BaseModel):
    company: str = ""
    title: str = ""
    location: str = ""
    startDate: str = ""
    endDate: str = ""
    highlights: List[str] = []

class OCRDraft(BaseModel):
    name: str = ""
    title: str = ""
    location: str = ""
    email: str = ""
    phone: str = ""
    links: Links | None = None
    summary: str = ""
    skills: Skills | List[str] = []
    certifications: List[str] = []
    projects: List[Project] = []
    experience: List[Experience] = []
    education: List[Education] = []
    awards: List[str] = []
    extracurriculars: List[str] = []
    extractedAt: str = ""
    source: str = "resume"

class SimpleProject(BaseModel):
    title: str = ""
    description: str = ""
    link: str = ""

class SimpleEducation(BaseModel):
    educationLevel: str = ""
    degreeName: str = ""
    collegeName: str = ""
    yearOfStudy: str = ""
    cgpa: Optional[float] = None

class SimpleOCRDraft(BaseModel):
    skills: List[str] = []
    certifications: List[str] = []
    projects: List[SimpleProject] = []
    education: List[SimpleEducation] = []
    extractedAt: str = ""
    source: str = "resume"

class ResumeResponse(BaseModel):
    ocrDraft: OCRDraft

class SimpleResumeResponse(BaseModel):
    ocrDraft: SimpleOCRDraft

# -----------------------
# Helper Functions
# -----------------------
def extract_text_from_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text

def chunk_text(text: str, chunk_size: int = 1500) -> list[str]:
    """Split text into chunks for LLM processing"""
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

def parse_gemini_json(response_text: str):
    """Parse Gemini output safely"""
    try:
        return json.loads(response_text)
    except json.JSONDecodeError:
        json_str = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_str:
            return json.loads(json_str.group())
        else:
            raise HTTPException(status_code=500, detail="Gemini did not return valid JSON")

def extract_skills_from_text(text: str) -> List[str]:
    """Lightweight fallback: extract common skills from raw resume text when LLM misses skills."""
    # 1) Try to extract from a Skills/Technical Skills section
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    section_indices: List[int] = []
    for idx, ln in enumerate(lines):
        # Clean the line and check if it contains "skills" (case insensitive)
        clean_line = re.sub(r"[^a-zA-Z ]", "", ln).strip().lower()
        if "skills" in clean_line and len(clean_line.split()) <= 4:  # Only section headers
            section_indices.append(idx)
    collected: List[str] = []
    for start in section_indices:
        # Look at the next few lines after the skills heading
        for i in range(start + 1, min(start + 8, len(lines))):
            ln = lines[i]
            # Stop if we hit another major section header
            if re.match(r"^[A-Z][A-Z\s&]{3,}$", ln) and len(ln.split()) <= 6:
                break
            
            # Extract skills from this line - handle various formats
            # Split by common separators and clean up
            parts = re.split(r"[•\-\u2022\|,;:]", ln)
            for part in parts:
                # Handle "Category: items" format
                if ":" in part:
                    category_and_items = part.split(":", 1)
                    if len(category_and_items) > 1:
                        items = category_and_items[1].strip()
                        # Split items by comma
                        for item in items.split(","):
                            item = item.strip()
                            if len(item) >= 2 and len(item.split()) <= 4:
                                collected.append(item)
                else:
                    # Regular item
                    item = part.strip()
                    if len(item) >= 2 and len(item.split()) <= 4:
                        collected.append(item)
    
    # Normalize and filter skills
    def normalize_skill(s: str) -> str:
        s2 = s.strip()
        s2l = s2.lower()
        mapping = {
            "react": "React.js",
            "reactjs": "React.js", 
            "node": "Node.js",
            "nodejs": "Node.js",
            "tailwind": "Tailwind CSS",
            "postgres": "PostgreSQL",
            "rest": "REST APIs",
            "rest apis": "REST APIs",
            "vs code": "VS Code",
            "eclipse": "Eclipse",
            "thunder client": "Thunder Client",
            "prisma orm": "Prisma ORM"
        }
        return mapping.get(s2l, s2)
    
    # Filter out invalid skills
    invalid_terms = {
        'achievements', 'languages', 'frameworks & libraries', 'tools & ides', 
        'programming languages', 'technical skills', 'skills', 'core',
        'volunteer', 'events', 'leadership', 'communication', 'teamwork',
        'bcn', 'databases', 'concepts', 'technologies', 'tools', 'platforms'
    }
    
    collected = [normalize_skill(s) for s in collected]
    collected = [s for s in collected if s.lower() not in invalid_terms and len(s) > 1]
    
    seen_tmp = set()
    collected_unique = []
    for s in collected:
        sl = s.lower()
        if sl not in seen_tmp:
            collected_unique.append(s)
            seen_tmp.add(sl)
    
    if collected_unique:
        return collected_unique
    
    # 2) Fallback vocabulary scan across entire text
    vocabulary = [
        # Programming / Languages
        "javascript", "typescript", "python", "java", "c++", "c#", "php", "ruby", "go", "rust",
        # Frontend
        "react", "react.js", "angular", "vue", "html", "css", "tailwind", "tailwind css", "bootstrap",
        # Backend / Frameworks
        "node", "node.js", "express", "flask", "fastapi", "django", "spring", "laravel",
        # Databases
        "mongodb", "postgresql", "postgres", "mysql", "redis", "sqlite",
        # Cloud & DevOps
        "aws", "azure", "docker", "kubernetes", "jenkins", "git", "github", "gitlab",
        # Tools
        "postman", "vscode", "vs code", "intellij", "eclipse", "figma", "photoshop",
        # Concepts
        "rest apis", "graphql", "microservices", "agile", "scrum", "tdd", "oop", "dsa"
    ]
    
    text_lc = text.lower()
    detected: List[str] = []
    for term in vocabulary:
        if term in text_lc:
            # Normalize display form
            normalized = term.replace("rest apis", "REST APIs")
            if normalized == "react":
                normalized = "React.js"
            if normalized == "node":
                normalized = "Node.js"
            if normalized == "postgres":
                normalized = "PostgreSQL"
            if normalized == "tailwind":
                normalized = "Tailwind CSS"
            if normalized == "vscode":
                normalized = "VS Code"
            detected.append(normalized)
    
    # Unique while preserving order
    seen = set()
    unique_detected = []
    for s in detected:
        if s not in seen:
            unique_detected.append(s)
            seen.add(s)
    return unique_detected

def extract_institutions_from_text(text: str) -> Dict[str, str]:
    """Heuristically extract institution names for UG/HSC/SSC from raw text."""
    result: Dict[str, str] = {}
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    candidates = []
    # Patterns indicating institutions
    inst_regex = re.compile(r"(university|institute|institute of|college|junior college|school|high ?school)", re.IGNORECASE)
    for ln in lines:
        if inst_regex.search(ln):
            # Ignore lines that are pure headers
            if re.match(r"^[A-Z][A-Z\s&]{3,}$", ln) and len(ln.split()) <= 6:
                continue
            # Trim excessive punctuation
            candidates.append(re.sub(r"\s+\|\s+", " ", ln))

    # Assign by heuristics
    def pick(prefer_terms: List[str]) -> Optional[str]:
        for c in candidates:
            cl = c.lower()
            if any(term in cl for term in prefer_terms):
                return c
        return None

    ug = pick(["institute", "university", "college of engineering", "technology", "engineering"])
    hsc = pick(["junior college", "college"])
    ssc = pick(["highschool", "high school", "school"])
    if ug:
        result["UG"] = ug
    if hsc:
        result["HSC"] = hsc
    if ssc:
        result["SSC"] = ssc
    return result

def get_resume_json_from_gemini(text: str) -> OCRDraft:
    """Send PDF text chunks to Gemini, request a rich schema, and robustly merge results."""
    chunks = chunk_text(text)
    final_json: Dict = {
        "name": "",
        "title": "",
        "location": "",
        "email": "",
        "phone": "",
        "links": {"github": "", "linkedin": "", "portfolio": ""},
        "summary": "",
        "skills": {
            "programmingLanguages": [],
            "frontend": [],
            "backend": [],
            "realtime_and_auth": [],
            "databases": [],
            "ml_ai_llm": [],
            "tools_platforms": [],
            "concepts": []
        },
        "certifications": [],
        "projects": [],
        "experience": [],
        "education": [],
        "awards": [],
        "extracurriculars": [],
        "extractedAt": datetime.now().isoformat(),
        "source": "resume"
    }

    for chunk in chunks:
        prompt = f"""
You are an AI assistant that extracts structured resume information from resumes.
Return ONLY STRICT JSON, no prose, matching EXACTLY this schema (keys and types):

{json.dumps(final_json, indent=2)}

CRITICAL EXTRACTION RULES:

SKILLS EXTRACTION (MOST IMPORTANT):
- ONLY extract actual technical skills, programming languages, frameworks, tools, technologies
- VALID SKILLS: Programming languages (Java, Python, JavaScript, C++, etc.), Frameworks (React, Angular, Spring, etc.), Databases (MySQL, MongoDB, PostgreSQL, etc.), Tools (Git, Docker, AWS, etc.), Technologies (REST APIs, Machine Learning, etc.)
- INVALID SKILLS: Section headers ("Achievements", "Languages", "Tools & IDEs"), soft skills ("Leadership", "Communication"), activities ("Volunteer", "Events"), generic terms ("Core", "BCN", "Databases")
- Look for technical terms in project descriptions, experience sections, and skills sections
- Categorize skills into the provided buckets (programmingLanguages, frontend, backend, databases, etc.)
- DO NOT include resume section titles or headers as skills

CERTIFICATIONS:
- Look for actual certificates, courses, training programs, licenses, professional qualifications
- Extract the full name of each certification
- Avoid extracting project descriptions or achievements as certifications

PROJECTS:
- Extract project names, descriptions, and technologies used
- Look for project sections, portfolio mentions, or projects described in experience

EDUCATION:
- Extract degree names, institution names, and education levels carefully

EXPERIENCE:
- Extract company names, job titles, locations, dates, and key achievements

VALIDATION RULES:
- Skills must be specific technical terms, not section headers or generic words
- Do not include resume section titles as skills
- Do not include soft skills or personal attributes as technical skills
- Only include technologies that are actually mentioned in the resume
- Be precise and avoid hallucination
- Populate what is present; leave unknown fields empty ("") or arrays empty []
- Do not hallucinate dates or institutions
- Avoid duplicates across arrays
- Ensure valid JSON only

Resume text:
{chunk}
"""
        response = model.generate_content(prompt)
        print(f"=== Gemini Response for chunk {chunks.index(chunk) + 1}/{len(chunks)} ===")
        print(response.text)
        print("=" * 50)
        json_data = parse_gemini_json(response.text)

        # Merge scalar top-level fields if present and non-empty
        for key in ["name", "title", "location", "email", "phone", "summary"]:
            value = json_data.get(key)
            if isinstance(value, str) and value.strip() and not final_json.get(key):
                final_json[key] = value.strip()

        # Merge links
        links = json_data.get("links") or {}
        if isinstance(links, dict):
            for lk in ["github", "linkedin", "portfolio"]:
                v = links.get(lk)
                if isinstance(v, str) and v.strip():
                    final_json.setdefault("links", {})[lk] = v.strip()

        # Normalize skills: support both list and categorized dict
        skills = json_data.get("skills")
        if isinstance(skills, list):
            # If LLM returned flat list, put into concepts bucket
            final_json["skills"]["concepts"].extend([s for s in skills if isinstance(s, str)])
        elif isinstance(skills, dict):
            for bucket, items in skills.items():
                if bucket in final_json["skills"] and isinstance(items, list):
                    final_json["skills"][bucket].extend([s for s in items if isinstance(s, str)])

        # Certifications
        final_json["certifications"].extend([c for c in (json_data.get("certifications") or []) if isinstance(c, str)])

        # Projects
        final_json["projects"].extend([p for p in (json_data.get("projects") or []) if isinstance(p, dict)])

        # Experience
        final_json["experience"].extend([x for x in (json_data.get("experience") or []) if isinstance(x, dict)])

        # Education
        final_json["education"].extend([e for e in (json_data.get("education") or []) if isinstance(e, dict)])

        # Awards/Extracurriculars
        final_json["awards"].extend([a for a in (json_data.get("awards") or []) if isinstance(a, str)])
        final_json["extracurriculars"].extend([ex for ex in (json_data.get("extracurriculars") or []) if isinstance(ex, str)])

    # -----------------------
    # Deduplicate and clean data safely
    # -----------------------
    # Deduplicate skills by bucket
    for bucket in list(final_json.get("skills", {}).keys()):
        items = final_json["skills"].get(bucket) or []
        final_json["skills"][bucket] = sorted(list({s.strip() for s in items if isinstance(s, str) and s.strip()}))

    # Fallback: if all skill buckets are empty, try extracting from raw text
    all_skill_items = sum((final_json["skills"].get(b) or [] for b in final_json["skills"].keys()), [])
    if len(all_skill_items) == 0:
        fallback_skills = extract_skills_from_text(text)
        if fallback_skills:
            final_json["skills"]["concepts"] = sorted(list({*fallback_skills}))

    # Fallback institutions: if any education entries have empty institution, heuristically fill from text
    if any((not e.get("institution") for e in final_json["education"])):
        inst_map = extract_institutions_from_text(text)
        for e in final_json["education"]:
            if not e.get("institution"):
                deg = (e.get("degree") or "").lower()
                if any(k in deg for k in ["b.e", "b.tech", "bachelor", "ug", "computer engineering", "engineering"]):
                    e["institution"] = inst_map.get("UG", e.get("institution", ""))
                elif any(k in deg for k in ["hsc", "class xii", "12th", "xii"]):
                    e["institution"] = inst_map.get("HSC", e.get("institution", ""))
                elif any(k in deg for k in ["ssc", "class x", "10th", "x"]):
                    e["institution"] = inst_map.get("SSC", e.get("institution", ""))

    final_json["certifications"] = sorted(list({c.strip() for c in final_json["certifications"] if isinstance(c, str) and c.strip()}))

    # Deduplicate projects safely
    def merge_projects(projects: List[Dict]) -> List[Dict]:
        merged: Dict[str, Dict] = {}
        for p in projects:
            name = (p.get("name") or "").strip()
            key = name.lower() if name else (p.get("description") or "").strip().lower()
            if not key:
                continue
            target = merged.setdefault(key, {
                "name": name,
                "role": "",
                "description": "",
                "techStack": [],
                "highlights": [],
                "links": {"repo": "", "demo": ""}
            })

            # Prefer longer, non-empty fields
            for field in ["name", "role", "description"]:
                cur = (p.get(field) or "").strip()
                if cur and len(cur) > len(target.get(field) or ""):
                    target[field] = cur

            # Union arrays
            for arr_field in ["techStack", "highlights"]:
                if isinstance(p.get(arr_field), list):
                    target[arr_field].extend([x for x in p[arr_field] if isinstance(x, str)])

            # Links
            if isinstance(p.get("links"), dict):
                for lk in ["repo", "demo"]:
                    v = (p["links"].get(lk) or "").strip()
                    if v:
                        target["links"][lk] = v

        # Deduplicate arrays
        for k, v in merged.items():
            v["techStack"] = sorted(list({t.strip() for t in v["techStack"] if t and isinstance(t, str)}))
            # Keep up to 6 concise highlights
            uniq_h = []
            seen = set()
            for h in v["highlights"]:
                h2 = h.strip()
                if h2 and h2 not in seen:
                    uniq_h.append(h2)
                    seen.add(h2)
                if len(uniq_h) >= 6:
                    break
            v["highlights"] = uniq_h
        return list(merged.values())

    final_json["projects"] = merge_projects(final_json["projects"]) 

    # Deduplicate education safely
    unique_edu: Dict[tuple, Dict] = {}
    for e in final_json["education"]:
        institution = (e.get("institution") or "").strip()
        degree = (e.get("degree") or "").strip()
        key = (institution.lower(), degree.lower())
        if institution or degree:
            current = unique_edu.get(key, {"institution": institution, "degree": degree, "location": "", "startYear": None, "endYear": None, "year": None})
            # Prefer filled fields
            for f in ["location"]:
                val = (e.get(f) or "").strip()
                if val and not current.get(f):
                    current[f] = val
            # Years
            for f in ["startYear", "endYear", "year"]:
                if e.get(f) is not None:
                    current[f] = e.get(f)
            unique_edu[key] = current
    final_json["education"] = list(unique_edu.values())

    # Experience dedupe (by company+title)
    unique_exp: Dict[tuple, Dict] = {}
    for x in final_json["experience"]:
        company = (x.get("company") or "").strip()
        title = (x.get("title") or "").strip()
        key = (company.lower(), title.lower())
        tgt = unique_exp.get(key, {"company": company, "title": title, "location": "", "startDate": "", "endDate": "", "highlights": []})
        # Prefer non-empty scalars
        for f in ["location", "startDate", "endDate"]:
            val = (x.get(f) or "").strip()
            if val and not tgt.get(f):
                tgt[f] = val
        # Merge highlights
        if isinstance(x.get("highlights"), list):
            tgt["highlights"].extend([h for h in x["highlights"] if isinstance(h, str)])
        unique_exp[key] = tgt
    for k, v in unique_exp.items():
        v["highlights"] = sorted(list({h.strip() for h in v["highlights"] if h and isinstance(h, str)}))[:8]
    final_json["experience"] = list(unique_exp.values())

    # Convert lists of dicts to Pydantic models
    # Links object
    links_obj = None
    if isinstance(final_json.get("links"), dict):
        links_obj = Links(**final_json["links"]) 

    # Skills object
    skills_obj = final_json.get("skills")
    if isinstance(skills_obj, dict):
        skills_obj = Skills(**skills_obj)

    projects_models = [Project(**p) for p in final_json["projects"]]
    education_models = [Education(**e) for e in final_json["education"]]

    experience_models = []
    for x in final_json.get("experience", []):
        experience_models.append(Experience(**x))

    return OCRDraft(
        name=final_json.get("name", ""),
        title=final_json.get("title", ""),
        location=final_json.get("location", ""),
        email=final_json.get("email", ""),
        phone=final_json.get("phone", ""),
        links=links_obj,
        summary=final_json.get("summary", ""),
        skills=skills_obj if skills_obj else [],
        certifications=final_json.get("certifications", []),
        projects=projects_models,
        experience=experience_models,
        education=education_models,
        awards=final_json.get("awards", []),
        extracurriculars=final_json.get("extracurriculars", []),
        extractedAt=final_json.get("extractedAt"),
        source=final_json.get("source", "resume")
    )

def transform_to_simple_format(rich_data: OCRDraft, raw_text: str = "") -> SimpleOCRDraft:
    """Transform rich OCRDraft to simple MongoDB-compatible format"""
    
    # Flatten skills from categorized structure to simple list
    skills_list: List[str] = []
    if hasattr(rich_data.skills, '_dict_'):
        # It's a Pydantic model, get all attributes
        skills_dict = rich_data.skills._dict_
        for _, skill_list in skills_dict.items():
            if isinstance(skill_list, list):
                skills_list.extend([s for s in skill_list if isinstance(s, str)])
    elif isinstance(rich_data.skills, dict):
        # It's a dictionary
        for _, skill_list in rich_data.skills.items():
            if isinstance(skill_list, list):
                skills_list.extend([s for s in skill_list if isinstance(s, str)])
    elif isinstance(rich_data.skills, list):
        skills_list = [s for s in rich_data.skills if isinstance(s, str)]
    
    # Clean and filter skills - comprehensive filtering
    cleaned_skills = []
    filtered_out = []
    
    # Define comprehensive lists of invalid terms
    invalid_skills = {
        # Section headers
        'achievements', 'languages', 'frameworks & libraries', 'tools & ides', 
        'programming languages', 'technical skills', 'skills', 'core',
        # Soft skills and activities
        'volunteer', 'volunteered in tech', 'events', 'leadership', 'communication',
        'teamwork', 'problem solving', 'time management', 'project management',
        # Generic terms
        'bcn', 'databases', 'concepts', 'technologies', 'tools', 'platforms',
        'ml_ai_llm', 'realtime_and_auth', 'programming', 'development',
        # Common resume section titles
        'experience', 'education', 'projects', 'certifications', 'awards',
        'extracurriculars', 'summary', 'objective', 'profile'
    }
    
    for skill in skills_list:
        if skill and isinstance(skill, str):
            skill = skill.strip()
            skill_lower = skill.lower()
            
            # Check if skill is valid
            is_valid = (
                len(skill) > 1 and
                skill_lower not in invalid_skills and
                not skill_lower.startswith(('volunteer', 'achievement', 'section', 'header')) and
                not skill_lower.endswith(('&', 'libraries', 'ides', 'languages', 'skills', 'tools')) and
                not skill_lower in ['core', 'bcn', 'databases', 'concepts'] and
                # Must contain at least one letter and not be just numbers
                any(c.isalpha() for c in skill) and
                # Must not be too generic
                not skill_lower in ['tech', 'it', 'cs', 'computer', 'software', 'web', 'mobile']
            )
            
            if is_valid:
                cleaned_skills.append(skill)
            else:
                filtered_out.append(skill)
    
    if filtered_out:
        print(f"Filtered out non-technical skills: {filtered_out}")
    
    # Deduplicate and sort
    skills_list = sorted(list({s: None for s in cleaned_skills}.keys()))
    print(f"Final cleaned skills: {skills_list}")
    
    # If no skills found, try fallback extraction from raw text
    if not skills_list and raw_text:
        print("=== No skills found in LLM response, trying fallback extraction ===")
        fallback_skills = extract_skills_from_text(raw_text)
        if fallback_skills:
            print(f"Fallback skills found: {fallback_skills}")
            skills_list = sorted(list({*fallback_skills}))
        else:
            print("No fallback skills found either")
    
    # Transform projects
    simple_projects = []
    for project in rich_data.projects:
        simple_projects.append(SimpleProject(
            title=project.name,
            description=project.description,
            link=project.links.repo if project.links and project.links.repo else ""
        ))
    
    # Transform education
    simple_education = []
    for edu in rich_data.education:
        # Map degree to education level
        education_level = ""
        degree_lower = edu.degree.lower()
        if "b.e." in degree_lower or "bachelor" in degree_lower or "b.tech" in degree_lower:
            education_level = "UG"
        elif "m.e." in degree_lower or "master" in degree_lower or "m.tech" in degree_lower:
            education_level = "PG"
        elif "diploma" in degree_lower:
            education_level = "Diploma"
        elif "hsc" in degree_lower or "class xii" in degree_lower:
            education_level = "HSC"
        elif "ssc" in degree_lower or "class x" in degree_lower:
            education_level = "SSC"
        
        # Map year to year of study
        year_of_study = ""
        if edu.year:
            year_of_study = str(edu.year)
        elif edu.endYear:
            year_of_study = str(edu.endYear)
        
        simple_education.append(SimpleEducation(
            educationLevel=education_level,
            degreeName=edu.degree,
            collegeName=edu.institution,
            yearOfStudy=year_of_study,
            cgpa=None  # Not available in current data
        ))
    
    # Handle certifications - clean and filter
    certifications_list = rich_data.certifications if rich_data.certifications else []
    
    # Clean up certifications - filter out non-certification entries
    cleaned_certs = []
    for cert in certifications_list:
        if cert and isinstance(cert, str):
            cert = cert.strip()
            # Filter out very long entries that are likely not certifications
            if (len(cert) > 5 and len(cert) < 100 and 
                not cert.lower().startswith('implemented') and
                not cert.lower().startswith('developed') and
                not cert.lower().startswith('created') and
                not cert.lower().startswith('built')):
                cleaned_certs.append(cert)
    
    certifications_list = cleaned_certs
    
    if not certifications_list and raw_text:
        print("=== No certifications found in LLM response, trying fallback extraction ===")
        # Try to extract certifications from raw text
        cert_keywords = ["certificate", "certification", "certified", "course", "training", "diploma", "license"]
        lines = [ln.strip() for ln in raw_text.splitlines() if ln.strip()]
        for line in lines:
            line_lower = line.lower()
            if any(keyword in line_lower for keyword in cert_keywords):
                # Clean up the line and add as certification
                clean_line = re.sub(r'[^\w\s\-\.]', '', line).strip()
                if len(clean_line) > 5 and len(clean_line) < 100:  # Reasonable length
                    certifications_list.append(clean_line)
        if certifications_list:
            print(f"Fallback certifications found: {certifications_list}")
        else:
            print("No fallback certifications found either")
    
    return SimpleOCRDraft(
        skills=skills_list if skills_list else [],
        certifications=certifications_list if certifications_list else [],
        projects=simple_projects,
        education=simple_education,
        extractedAt=rich_data.extractedAt,
        source=rich_data.source
    )


# -----------------------
# API Endpoint
# -----------------------
@app.post("/upload_resume/", response_model=SimpleResumeResponse)
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    try:
        # Save PDF
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Extract text from PDF
        pdf_text = extract_text_from_pdf(file_path)

        # Process with Gemini LLM
        ocr_data = get_resume_json_from_gemini(pdf_text)

        # Print JSON in terminal
        print("=== Extracted Resume JSON ===")
        print(json.dumps(ocr_data.model_dump(), indent=2))
        print("=============================")

        # Always return MongoDB-compatible simple format
        simple_data = transform_to_simple_format(ocr_data, pdf_text)
        
        # Print simplified JSON in terminal as well
        print("=== Simplified Resume JSON (MongoDB-compatible) ===")
        print(json.dumps(SimpleResumeResponse(ocrDraft=simple_data).model_dump(), indent=2))
        print("==================================================")

        return SimpleResumeResponse(ocrDraft=simple_data)
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

@app.post("/extract/", response_model=SimpleResumeResponse)
async def extract_from_url_or_file(
    file: UploadFile = File(None),
    resume_url: str = None
):
    """
    Extract resume data from either uploaded file or URL.
    Supports both file upload and URL-based processing.
    """
    import requests
    import tempfile
    
    file_path = None
    try:
        if file and file.filename:
            # Handle file upload
            if not file.filename.endswith(".pdf"):
                raise HTTPException(status_code=400, detail="Only PDF files are allowed")
            
            file_path = os.path.join(UPLOAD_DIR, file.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            # Extract text from PDF
            pdf_text = extract_text_from_pdf(file_path)
            
        elif resume_url:
            # Handle URL-based processing
            try:
                response = requests.get(resume_url, timeout=30)
                response.raise_for_status()
                
                # Create temporary file
                with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
                    temp_file.write(response.content)
                    file_path = temp_file.name
                
                # Extract text from PDF
                pdf_text = extract_text_from_pdf(file_path)
                
            except requests.RequestException as e:
                raise HTTPException(status_code=400, detail=f"Failed to download resume from URL: {str(e)}")
        else:
            raise HTTPException(status_code=400, detail="Either file or resume_url must be provided")

        # Process with Gemini LLM
        ocr_data = get_resume_json_from_gemini(pdf_text)

        # Print JSON in terminal
        print("=== Extracted Resume JSON ===")
        print(json.dumps(ocr_data.model_dump(), indent=2))
        print("=============================")

        # Always return MongoDB-compatible simple format
        simple_data = transform_to_simple_format(ocr_data, pdf_text)
        
        # Print simplified JSON in terminal as well
        print("=== Simplified Resume JSON (MongoDB-compatible) ===")
        print(json.dumps(SimpleResumeResponse(ocrDraft=simple_data).model_dump(), indent=2))
        print("==================================================")

        return SimpleResumeResponse(ocrDraft=simple_data)
    finally:
        if file_path and os.path.exists(file_path):
            os.remove(file_path)



@app.get("/")
async def root():
    return {"message": "Resume Extractor API with Gemini LLM running"}