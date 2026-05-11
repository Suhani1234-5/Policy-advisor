# backend/main.py
import os, shutil
from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from agent import run_agent
from rag import add_policy_chunks, delete_policy_by_name, list_all_policies
from pdf_parser import parse_policy_pdf
from auth import verify_admin

load_dotenv()
app = FastAPI(title="AarogyaID Policy Advisor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://localhost:5173",  "http://127.0.0.1:5173",],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Models ────────────────────────────────────────────────

class UserProfile(BaseModel):
    name: str
    age: int
    lifestyle: str
    conditions: list[str]
    income_band: str
    city_tier: str

class RecommendRequest(BaseModel):
    session_id: str
    profile: UserProfile

class ChatRequest(BaseModel):
    session_id: str
    message: str

# ── Endpoints ─────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "AarogyaID Policy Advisor API running ✅"}

@app.post("/recommend")
def recommend(req: RecommendRequest):
    profile_dict = req.profile.model_dump()
    message = "Please recommend the best health insurance policy for me based on my profile."
    response = run_agent(req.session_id, message, profile=profile_dict)
    return {"session_id": req.session_id, "recommendation": response}

@app.post("/chat")
def chat(req: ChatRequest):
    response = run_agent(req.session_id, req.message)
    return {"session_id": req.session_id, "reply": response}

@app.post("/admin/upload")
def upload_policy(
    file: UploadFile = File(...),
    policy_name: str = Form(...),
    insurer: str = Form(...),
    _: str = Depends(verify_admin)
):
    """Admin only: Upload PDF, TXT, or JSON policy file."""
    allowed_extensions = {".pdf", ".txt", ".json"}
    ext = os.path.splitext(file.filename)[1].lower()

    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{ext}' not supported. Use PDF, TXT, or JSON."
        )

    upload_dir = "./uploaded_policies"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = f"{upload_dir}/{file.filename}"

    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    chunks = parse_policy_pdf(file_path, policy_name, insurer)

    if not chunks:
        raise HTTPException(status_code=400, detail="No text could be extracted from file.")

    doc_id = policy_name.replace(" ", "_").lower()
    add_policy_chunks(chunks, doc_id)

    return {
        "message": f"Successfully uploaded and indexed {len(chunks)} chunks",
        "policy_name": policy_name,
        "insurer": insurer,
        "chunks_indexed": len(chunks)
    }

@app.delete("/admin/policy/{policy_name}")
def delete_policy(policy_name: str, _: str = Depends(verify_admin)):
    delete_policy_by_name(policy_name)
    return {"message": f"Deleted policy: {policy_name}"}

@app.get("/admin/policies")
def get_policies(_: str = Depends(verify_admin)):
    policies = list_all_policies()
    return {"policies": policies}