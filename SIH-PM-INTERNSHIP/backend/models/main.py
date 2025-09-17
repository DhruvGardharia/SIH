

# from fastapi import FastAPI, UploadFile, File, Form
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import Optional
# import requests
# import io
# import re
# from pdfminer.high_level import extract_text

# app = FastAPI(title="OCR Resume Extraction Service", version="0.4.0")

# # Allow CORS for local testing
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ------------------------
# # Response Model
# # ------------------------
# class ExtractResponse(BaseModel):
#     skills: list[str] = []
#     certifications: list[str] = []
#     projects: list[str] = []
#     education: list[str] = []

# # ------------------------
# # Skills Extraction
# # ------------------------
# SKILL_KEYWORDS = [
#     "python", "java", "c++", "sql", "html", "css", "javascript",
#     "typescript", "react", "node", "angular", "django", "flask",
#     "docker", "kubernetes", "aws", "git", "linux", "machine learning",
#     "deep learning", "nlp", "opencv"
# ]

# def extract_skills(text: str) -> list[str]:
#     found = []
#     lower_text = text.lower()
#     for skill in SKILL_KEYWORDS:
#         if skill in lower_text:
#             found.append(skill.capitalize())
#     return sorted(list(set(found)))

# # ------------------------
# # Certifications Extraction
# # ------------------------
# def extract_certifications(text: str) -> list[str]:
#     lines = text.split("\n")
#     return [line.strip() for line in lines if "certified" in line.lower() or "certificate" in line.lower()]

# # ------------------------
# # Projects Extraction (Improved)
# # ------------------------

# def _split_projects(lines: list[str]) -> list[str]:
#     """
#     Split project section into individual projects.
#     New project starts whenever we see '—'.
#     Collect following bullets until the next heading.
#     """
#     projects = []
#     current = []

#     for line in lines:
#         if "—" in line:  # new project
#             if current:
#                 projects.append(" ".join(current).strip())
#                 current = []
#         current.append(line)

#     # ✅ Flush the last project
#     if current:
#         projects.append(" ".join(current).strip())

#     return projects


# def extract_projects(text: str) -> list[str]:
#     lines = [line.strip() for line in text.split("\n") if line.strip()]
#     projects = []
#     capture = False
#     buffer = []

#     for line in lines:
#         lower = line.lower()

#         # Start capturing when "projects" section begins
#         if "project" in lower and not capture:
#             capture = True
#             continue

#         # Stop when next major section starts
#         if capture and any(
#             k in lower
#             for k in ["technical skills", "skills", "certification",
#                       "achievements", "extracurricular", "experience", "education"]
#         ):
#             if buffer:
#                 projects.extend(_split_projects(buffer))
#             break

#         if capture:
#             # skip irrelevant lines
#             if re.search(r"(cgpa|%|class x|class xii|20\d{2})", lower):
#                 continue
#             buffer.append(line)

#     if buffer and not projects:
#         projects.extend(_split_projects(buffer))

#     return projects

# # ------------------------
# # Education Extraction
# # ------------------------
# def extract_education(text: str) -> list[str]:
#     education = []
#     lines = [line.strip() for line in text.split("\n") if line.strip()]

#     edu_keywords = ["university", "college", "institute", "academy", "school"]
#     degree_keywords = ["b.tech", "b.e", "m.tech", "mba", "phd", "bsc", "msc"]

#     for line in lines:
#         lower = line.lower()
#         if any(k in lower for k in edu_keywords) or any(d in lower for d in degree_keywords):
#             education.append(line)

#         # capture "2019 - 2023" style year ranges
#         if re.search(r"(19|20)\d{2}\s*[-–]\s*(19|20)\d{2}", line):
#             education.append(line)

#     return list(set(education))

# # ------------------------
# # Main Parsing Function
# # ------------------------
# def parse_resume_text(text: str) -> ExtractResponse:
#     return ExtractResponse(
#         skills=extract_skills(text),
#         certifications=extract_certifications(text),
#         projects=extract_projects(text),
#         education=extract_education(text)
#     )

# # ------------------------
# # API Endpoint
# # ------------------------

# @app.post("/extract", response_model=ExtractResponse)
# async def extract_resume(
#     file: Optional[UploadFile] = File(None),
#     resume_url: Optional[str] = Form(None)
# ):
#     text = ""

#     # Case 1: File uploaded
#     if file:
#         contents = await file.read()
#         text = extract_text(io.BytesIO(contents))
#         print("\n--- Extracted Text from File ---\n", text, "\n----------------\n")

#     # Case 2: File from URL
#     elif resume_url:
#         resp = requests.get(resume_url)
#         if resp.status_code == 200:
#             text = extract_text(io.BytesIO(resp.content))
#             print("\n--- Extracted Text from URL ---\n", text, "\n----------------\n")

#     if not text.strip():
#         return ExtractResponse()
#     print("\n--- Final Extracted Text ---\n", parse_resume_text(text), "\n----------------\n")
#     return parse_resume_text(text)

# # ------------------------
# # Health Check
# # ------------------------
# @app.get("/health")
# async def health():
#     return {"status": "ok"}

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import requests
import io
import re
from pdfminer.high_level import extract_text

app = FastAPI(title="OCR Resume Extraction Service", version="0.4.0")

# Allow CORS for local testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------
# Response Model
# ------------------------
class ExtractResponse(BaseModel):
    skills: list[str] = []
    certifications: list[str] = []
    projects: list[str] = []
    education: list[str] = []

# ------------------------
# Skills Extraction
# ------------------------
SKILL_KEYWORDS = [
    "python", "java", "c++", "sql", "html", "css", "javascript",
    "typescript", "react", "node", "angular", "django", "flask",
    "docker", "kubernetes", "aws", "git", "linux", "machine learning",
    "deep learning", "nlp", "opencv"
]

def extract_skills(text: str) -> list[str]:
    print("[DEBUG] Extracting skills...")
    found = []
    lower_text = text.lower()
    for skill in SKILL_KEYWORDS:
        if skill in lower_text:
            found.append(skill.capitalize())
    print(f"[DEBUG] Skills found: {found}")
    return sorted(list(set(found)))

# ------------------------
# Certifications Extraction
# ------------------------
def extract_certifications(text: str) -> list[str]:
    print("[DEBUG] Extracting certifications...")
    lines = text.split("\n")
    certs = [line.strip() for line in lines if "certified" in line.lower() or "certificate" in line.lower()]
    print(f"[DEBUG] Certifications found: {certs}")
    return certs

# ------------------------
# Projects Extraction
# ------------------------
def _split_projects(lines: list[str]) -> list[str]:
    projects = []
    current = []

    for line in lines:
        if "—" in line:  # new project
            if current:
                projects.append(" ".join(current).strip())
                current = []
        current.append(line)

    if current:
        projects.append(" ".join(current).strip())

    return projects


def extract_projects(text: str) -> list[str]:
    print("[DEBUG] Extracting projects...")
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    projects = []
    capture = False
    buffer = []

    for line in lines:
        lower = line.lower()
        if "project" in lower and not capture:
            capture = True
            continue

        if capture and any(
            k in lower
            for k in ["technical skills", "skills", "certification",
                      "achievements", "extracurricular", "experience", "education"]
        ):
            if buffer:
                projects.extend(_split_projects(buffer))
            break

        if capture:
            if re.search(r"(cgpa|%|class x|class xii|20\d{2})", lower):
                continue
            buffer.append(line)

    if buffer and not projects:
        projects.extend(_split_projects(buffer))

    print(f"[DEBUG] Projects found: {projects}")
    return projects

# ------------------------
# Education Extraction
# ------------------------
def extract_education(text: str) -> list[str]:
    print("[DEBUG] Extracting education...")
    education = []
    lines = [line.strip() for line in text.split("\n") if line.strip()]

    edu_keywords = ["university", "college", "institute", "academy", "school"]
    degree_keywords = ["b.tech", "b.e", "m.tech", "mba", "phd", "bsc", "msc"]

    for line in lines:
        lower = line.lower()
        if any(k in lower for k in edu_keywords) or any(d in lower for d in degree_keywords):
            education.append(line)
        if re.search(r"(19|20)\d{2}\s*[-–]\s*(19|20)\d{2}", line):
            education.append(line)

    education = list(set(education))
    print(f"[DEBUG] Education found: {education}")
    return education

# ------------------------
# Main Parsing Function
# ------------------------
def parse_resume_text(text: str) -> ExtractResponse:
    print("[DEBUG] Parsing extracted text...")
    result = ExtractResponse(
        skills=extract_skills(text),
        certifications=extract_certifications(text),
        projects=extract_projects(text),
        education=extract_education(text)
    )
    print(f"[DEBUG] Final Parsed Result: {result}")
    return result

# ------------------------
# API Endpoint
# ------------------------
@app.post("/extract", response_model=ExtractResponse)
async def extract_resume(
    file: Optional[UploadFile] = File(None),
    resume_url: Optional[str] = Form(None)
):
    text = ""

    if file:
        print(f"[DEBUG] Received file: {file.filename}")
        contents = await file.read()
        print(f"[DEBUG] File size: {len(contents)} bytes")
        text = extract_text(io.BytesIO(contents))
        print(f"[DEBUG] Raw extracted text length: {len(text)}")

    elif resume_url:
        print(f"[DEBUG] Fetching from URL: {resume_url}")
        resp = requests.get(resume_url)
        if resp.status_code == 200:
            text = extract_text(io.BytesIO(resp.content))
            print(f"[DEBUG] Raw extracted text length: {len(text)}")
        else:
            print(f"[ERROR] Failed to download file, status={resp.status_code}")

    if not text.strip():
        print("[ERROR] No text extracted from resume")
        return ExtractResponse()

    return parse_resume_text(text)

# ------------------------
# Health Check
# ------------------------
@app.get("/health")
async def health():
    return {"status": "ok"}
